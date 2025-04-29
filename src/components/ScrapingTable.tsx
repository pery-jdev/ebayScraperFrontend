
import React from 'react';
import { useLanguage } from './LanguageProvider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ExternalLink, Star, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductData } from '@/hooks/useScraping';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ScrapingTableProps {
  data: ProductData[];
  isLoading: boolean;
}

export const ScrapingTable = ({ data, isLoading }: ScrapingTableProps) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 md:p-6">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-gray-200 rounded col-span-2"></div>
                  <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-gray-500">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 md:p-6">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500">{t('noData')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('product')}</TableHead>
              <TableHead>{t('priceYen')}</TableHead>
              <TableHead>{t('priceUSD')}</TableHead>
              <TableHead>{t('priceAUD')}</TableHead>
              <TableHead>{t('bundleGroup')}</TableHead>
              <TableHead>{t('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((product) => (
              <TableRow key={product.id} className={product.bundleGroup === 'leftover' ? 'bg-amber-50' : ''}>
                <TableCell className="font-medium">
                  <div>
                    <div>{product.nameEn || product.name}</div>
                    {product.nameEn && (
                      <div className="text-xs text-gray-500">{product.name}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{product.priceYen}</TableCell>
                <TableCell>{product.priceUSD}</TableCell>
                <TableCell>{product.priceAUD}</TableCell>
                <TableCell>
                  {product.bundleGroup ? (
                    product.bundleGroup === 'leftover' ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                        {t('leftoverItems')}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {`Bundle ${product.bundleGroup}`}
                      </span>
                    )
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(product.url, '_blank')}
                          className="flex items-center"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          {t('viewDetails')}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View product on retailer website</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
