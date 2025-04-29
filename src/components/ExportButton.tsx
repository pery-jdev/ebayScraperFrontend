
import React from 'react';
import { useLanguage } from './LanguageProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { ProductData } from '@/hooks/useScraping';

interface ExportButtonProps {
  data: ProductData[];
}

export const ExportButton = ({ data }: ExportButtonProps) => {
  const { t } = useLanguage();

  const exportAsCSV = () => {
    if (!data.length) return;

    const headers = ['name', 'price', 'seller', 'rating', 'url'];
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header as keyof typeof row];
          return `"${value}"`;
        }).join(',')
      )
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'ebay_data.csv');
    link.click();
  };

  const exportAsJSON = () => {
    if (!data.length) return;
    
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'ebay_data.json');
    link.click();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="mr-2"
          disabled={!data.length}
        >
          <Download className="mr-2 h-4 w-4" />
          {t('exportData')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={exportAsCSV}>
          {t('exportCSV')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsJSON}>
          {t('exportJSON')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
