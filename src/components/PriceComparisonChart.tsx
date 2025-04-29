
import React, { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ProductData } from '@/hooks/useScraping';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PriceComparisonChartProps {
  data: ProductData[];
}

export const PriceComparisonChart = ({ data }: PriceComparisonChartProps) => {
  const { t } = useLanguage();
  const [currency, setCurrency] = useState('usd');
  
  const hasFishingData = data.length > 0 && data[0].priceUSD !== undefined;

  const formatPriceData = (products: ProductData[], curr: string) => {
    return products.map(item => {
      let price = 0;
      if (curr === 'usd' && item.priceUSD) {
        price = parseFloat(item.priceUSD.replace(/[^0-9.]/g, ''));
      } else if (curr === 'aud' && item.priceAUD) {
        price = parseFloat(item.priceAUD.replace(/[^0-9.]/g, ''));
      } else if (curr === 'yen' && item.priceYen) {
        price = parseFloat(item.priceYen.replace(/[^0-9.]/g, ''));
      } else if (item.price) {
        price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      }
      
      return {
        name: (item.nameEn || item.name).length > 20 
          ? `${(item.nameEn || item.name).substring(0, 20)}...` 
          : (item.nameEn || item.name),
        price: price
      };
    });
  };

  if (!data.length) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t('priceComparison')}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <p className="text-gray-500">{t('noData')}</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = formatPriceData(data, currency);

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{t('priceComparison')}</CardTitle>
        {hasFishingData && (
          <Tabs value={currency} onValueChange={setCurrency} className="w-auto">
            <TabsList>
              <TabsTrigger value="usd">USD</TabsTrigger>
              <TabsTrigger value="aud">AUD</TabsTrigger>
              <TabsTrigger value="yen">YEN</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 70,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={70}
                interval={0}
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => [
                  currency === 'usd' ? `$${value}` : 
                  currency === 'aud' ? `AUD $${value}` : 
                  `¥${value}`, 
                  t('price')
                ]} 
              />
              <Bar 
                dataKey="price" 
                fill="#0064D2" 
                className="hover:opacity-80 cursor-pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
