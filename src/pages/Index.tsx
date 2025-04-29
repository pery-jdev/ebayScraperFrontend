
import React from 'react';
import { LanguageProvider } from '@/components/LanguageProvider';
import { Header } from '@/components/Header';
import { SearchForm } from '@/components/SearchForm';
import { ScrapingTable } from '@/components/ScrapingTable';
import { PriceComparisonChart } from '@/components/PriceComparisonChart';
import { ExportButton } from '@/components/ExportButton';
import { useScraping } from '@/hooks/useScraping';

const Index = () => {
  const { data, isLoading, scrapeData } = useScraping();
  
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <main className="flex-1 container px-4 py-6 mx-auto">
          <SearchForm onSearch={scrapeData} isLoading={isLoading} />
          
          <div className="mb-6 flex justify-end">
            <ExportButton data={data} />
          </div>
          
          <ScrapingTable data={data} isLoading={isLoading} />
          
          <PriceComparisonChart data={data} />
        </main>
      </div>
    </LanguageProvider>
  );
};

export default Index;
