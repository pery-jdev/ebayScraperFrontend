import React, { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { useSearchProducts } from '@/hooks/api/useProductApi';
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
import { Search, BarChart3, Languages, Package } from 'lucide-react';
import { categories, TranslationKey } from '@/translations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface SearchFormProps {
  onSearch: (data: ProductData[]) => void;
}

interface SearchResponse {
  task_id: string;
  status: "pending";
}

export const SearchForm = ({ onSearch }: SearchFormProps) => {
  const { mutate: search, isPending: isLoading } = useSearchProducts();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('search');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      search({ query, category }, {
        onSuccess: (response: SearchResponse) => {
          toast({
            title: "Search Started",
            description: `Task ID: ${response.task_id}`,
          });
          // TODO: Implement polling for task status and results
          // For now, we'll just show a success message
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

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 md:p-6 mb-6">
      <Tabs defaultValue="search" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="search">{t('search')}</TabsTrigger>
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
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isLoading || !query.trim()} 
                className="bg-ebay-blue hover:bg-blue-700 text-white"
              >
                {isLoading ? (
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <label className="block text-sm font-medium text-gray-700">
                CSV File with Lure Data
              </label>
              <Input
                type="file"
                accept=".csv"
                className="pl-3"
              />
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Lures per Bundle
                  </label>
                  <Input
                    type="number"
                    defaultValue="6"
                    min="1"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Min USD Value
                  </label>
                  <Input
                    type="number"
                    defaultValue="75"
                    min="0"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Target Yen/Lure
                  </label>
                  <Input
                    type="number"
                    defaultValue="850"
                    min="0"
                    className="mt-1"
                  />
                </div>
              </div>
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
                    <Package className="mr-2 h-4 w-4" />
                    <span>{t('createBundles')}</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};
