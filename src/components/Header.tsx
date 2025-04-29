
import React from 'react';
import { useLanguage } from './LanguageProvider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const Header = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ja' : 'en');
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 md:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <span className="text-ebay-blue font-bold">e</span>
            <span className="text-ebay-red font-bold">b</span>
            <span className="text-ebay-yellow font-bold">a</span>
            <span className="text-ebay-green font-bold">y</span>
          </div>
          <h1 className="text-xl font-bold">{t('appTitle')}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="language-toggle" className="text-sm font-medium">
            {language === 'en' ? 'EN' : '日本語'}
          </Label>
          <Switch
            id="language-toggle"
            checked={language === 'ja'}
            onCheckedChange={toggleLanguage}
          />
        </div>
      </div>
    </header>
  );
};
