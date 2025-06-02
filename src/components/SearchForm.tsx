import React, { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { useSearchProducts } from '@/hooks/api/useProductApi';
import { useTaskStatus } from '@/hooks/api/useTaskApi';
import { ProductData } from '@/types/product';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, BarChart3, Languages, Package, ListTodo } from 'lucide-react';
import { categories, TranslationKey } from '@/translations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from '@/components/ui/progress';
import { TaskList } from './TaskList';
import { usePipeline } from '@/hooks/api/usePipeline';

interface SearchFormProps {
  onSearch: (data: ProductData[]) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface SearchResponse {
  task_id: string;
  status: "pending";
}

export const SearchForm = ({ onSearch, activeTab, setActiveTab }: SearchFormProps) => {
  const { mutate: search, isPending: isLoading } = useSearchProducts();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  
  const { data: taskStatus } = useTaskStatus(currentTaskId || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      search({ query, category }, {
        onSuccess: (response: SearchResponse) => {
          setCurrentTaskId(response.task_id);
          toast({
            title: "Search Started",
            description: `Task ID: ${response.task_id}`,
          });
        },
        onError: (error) => {
          console.error('Search failed:', error);
          toast({
            title: "Error",
            description: "Failed to start search. Please try again.",
            variant: "destructive",
          });
        }
      });
    }
  };

  // Handle task completion
  React.useEffect(() => {
    if (taskStatus?.status === 'completed' && taskStatus.result) {
      onSearch(taskStatus.result);
      setCurrentTaskId(null);
      toast({
        title: "Search Complete",
        description: `Found ${taskStatus.result.length} results`,
      });
    } else if (taskStatus?.status === 'failed') {
      toast({
        title: "Search Failed",
        description: taskStatus.error || "An error occurred during search",
        variant: "destructive",
      });
      setCurrentTaskId(null);
    }
  }, [taskStatus, onSearch, toast]);

  const pipeline = usePipeline();
  const [bundleFile, setBundleFile] = useState<File | null>(null);
  const [luresPerBundle, setLuresPerBundle] = useState(6);
  const [minUSDValue, setMinUSDValue] = useState(75);
  const [targetYenPerLure, setTargetYenPerLure] = useState(850);

  const handleBundleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bundleFile) return;
    pipeline.start({
      file: bundleFile,
      lures_per_bundle: luresPerBundle,
      min_usd_value: minUSDValue,
      target_yen_per_lure: targetYenPerLure,
    });
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 md:p-6 mb-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="search">{t('search')}</TabsTrigger>
          <TabsTrigger value="tasks">
            <ListTodo className="w-4 h-4 mr-2" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="translate">{t('translateProducts')}</TabsTrigger>
          <TabsTrigger value="bundles">{t('createBundles')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder={t('searchPlaceholder')}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('category')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {t(cat.labelKey as TranslationKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {taskStatus?.progress && (
              <div className="space-y-2">
                <Progress value={(taskStatus.progress.processed / taskStatus.progress.total) * 100} />
                <div className="text-sm text-gray-500">
                  {taskStatus.progress.processed} / {taskStatus.progress.total} items processed
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isLoading || !query.trim() || !!currentTaskId} 
                className="bg-ebay-blue hover:bg-blue-700 text-white"
              >
                {isLoading || currentTaskId ? (
                  <>
                    <BarChart3 className="mr-2 h-4 w-4 animate-pulse" />
                    <span>{t('scraping')}</span>
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    <span>{t('scrapeNow')}</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="tasks">
          <TaskList isActive={activeTab === 'tasks'} />
        </TabsContent>
        
        <TabsContent value="translate">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <label className="block text-sm font-medium text-gray-700">
                CSV File with Japanese Product Names
              </label>
              <Input
                type="file"
                accept=".csv"
                className="pl-3"
              />
            </div>
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="bg-ebay-blue hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <>
                    <BarChart3 className="mr-2 h-4 w-4 animate-pulse" />
                    <span>{t('scraping')}</span>
                  </>
                ) : (
                  <>
                    <Languages className="mr-2 h-4 w-4" />
                    <span>{t('translateProducts')}</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="bundles">
          <form onSubmit={handleBundleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <label className="block text-sm font-medium text-gray-700">
                CSV File with Lure Data
              </label>
              <Input
                type="file"
                accept=".csv"
                className="pl-3"
                onChange={e => setBundleFile(e.target.files?.[0] || null)}
              />
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Lures per Bundle
                  </label>
                  <Input
                    type="number"
                    value={luresPerBundle}
                    min="1"
                    className="mt-1"
                    onChange={e => setLuresPerBundle(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Min USD Value
                  </label>
                  <Input
                    type="number"
                    value={minUSDValue}
                    min="0"
                    className="mt-1"
                    onChange={e => setMinUSDValue(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Target Yen/Lure
                  </label>
                  <Input
                    type="number"
                    value={targetYenPerLure}
                    min="0"
                    className="mt-1"
                    onChange={e => setTargetYenPerLure(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={pipeline.isProcessing || !bundleFile}
                className="bg-ebay-blue hover:bg-blue-700 text-white"
              >
                {pipeline.isProcessing ? (
                  <>
                    <BarChart3 className="mr-2 h-4 w-4 animate-pulse" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Package className="mr-2 h-4 w-4" />
                    <span>Create Bundle</span>
                  </>
                )}
              </Button>
            </div>
          </form>
          {/* Progress Indicator */}
          {pipeline.isProcessing && pipeline.progress && (
            <div className="mt-4">
              <h3 className="font-semibold">Pipeline Progress</h3>
              <p>Current Step: {pipeline.progress.step}</p>
              {pipeline.progress.processed !== undefined && (
                <p>Processed: {pipeline.progress.processed} / {pipeline.progress.total}</p>
              )}
              <Progress value={pipeline.progress.processed && pipeline.progress.total ? (pipeline.progress.processed / pipeline.progress.total) * 100 : 0} />
            </div>
          )}
          {/* Error Display */}
          {pipeline.error && (
            <div className="mt-4 text-red-600">Error: {pipeline.error}</div>
          )}
          {/* Results Display */}
          {pipeline.result && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Pipeline Results</h3>
              <div>
                <h4 className="font-semibold">Bundles ({pipeline.result.bundles.length})</h4>
                {pipeline.result.bundles.map((bundle, index) => (
                  <div key={index} className="mb-2 p-2 border rounded">
                    <p className="font-semibold">Bundle {index + 1}</p>
                    <p>Total Value: ${bundle.total_value}</p>
                    <p>Total Yen: ¥{bundle.total_yen}</p>
                    <p>Yen per Lure: ¥{bundle.yen_per_lure}</p>
                    <ul className="list-disc ml-6">
                      {bundle.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item.TranslatedTitle || item.Title}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-semibold">Leftovers ({pipeline.result.leftovers.length})</h4>
                {pipeline.result.leftovers.map((item, index) => (
                  <div key={index}>{item.TranslatedTitle || item.Title}</div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
