import React, { useState } from 'react';
import { LanguageProvider } from '@/components/LanguageProvider';
import { Header } from '@/components/Header';
import { SearchForm } from '@/components/SearchForm';
import { useScraping } from '@/hooks/useScraping';

const Index = () => {
  const { data, isLoading, scrapeData } = useScraping();
  const [activeTab, setActiveTab] = useState('search');

  // Adapter to match SearchForm's onSearch signature
  const handleSearch = (results: any[]) => {
    // Just call setData in useScraping, which is already handled by scrapeData
    // But since scrapeData is async and expects (query, category),
    // we assume SearchForm will call onSearch with the result array
    // So we do nothing here, as useScraping already manages data state
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <main className="flex-1 container px-4 py-6 mx-auto">
          <SearchForm onSearch={handleSearch} activeTab={activeTab} setActiveTab={setActiveTab} />
        </main>
      </div>
    </LanguageProvider>
  );
};

export default Index;
