
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

export interface ProductData {
  id: string;
  name: string;
  nameEn?: string;
  price?: string;
  priceYen?: string;
  priceUSD?: string;
  priceAUD?: string;
  seller?: string;
  rating?: string;
  url: string;
  bundleGroup?: string | 'leftover';
}

export const useScraping = () => {
  const [data, setData] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock data function to simulate scraping
  const generateMockData = (query: string, category: string): ProductData[] => {
    // This would be replaced with actual API call in a real app
    if (query.toLowerCase().includes('lure') || query.toLowerCase().includes('fishing')) {
      return [
        {
          id: '1',
          name: 'ジャクソン飛び過ぎダニエル 14g',
          nameEn: 'Jackson Tobisugi Daniel 14g',
          priceYen: '¥850',
          priceUSD: '$15.99',
          priceAUD: '$22.50',
          url: 'https://www.plat.co.jp/shop/catalog/product_info/language/en/products_id/37340',
          bundleGroup: '1'
        },
        {
          id: '2',
          name: 'デプス バスエフェクト 10g',
          nameEn: 'Deps Bass Effect 10g',
          priceYen: '¥980',
          priceUSD: '$18.50',
          priceAUD: '$26.75',
          url: 'https://www.plat.co.jp/shop/catalog/product_info/language/en/products_id/37542',
          bundleGroup: '1'
        },
        {
          id: '3',
          name: 'ガンクラフト ジョインテッドクロー 178',
          nameEn: 'Gan Craft Jointed Claw 178',
          priceYen: '¥2500',
          priceUSD: '$24.99',
          priceAUD: '$35.50',
          url: 'https://www.plat.co.jp/shop/catalog/product_info/language/en/products_id/26483',
          bundleGroup: '1'
        },
        {
          id: '4',
          name: 'リュウギ メタルマル 20g',
          nameEn: 'Ryugi Metal Maru 20g',
          priceYen: '¥720',
          priceUSD: '$14.25',
          priceAUD: '$19.99',
          url: 'https://www.plat.co.jp/shop/catalog/product_info/language/en/products_id/83221',
          bundleGroup: '2'
        },
        {
          id: '5',
          name: 'シマノ バンタム ポップクイーン',
          nameEn: 'Shimano Bantam Pop Queen',
          priceYen: '¥1850',
          priceUSD: '$25.99',
          priceAUD: '$36.50',
          url: 'https://www.plat.co.jp/shop/catalog/product_info/language/en/products_id/91273',
          bundleGroup: '2'
        },
        {
          id: '6',
          name: 'イマカツ ギリングジャック',
          nameEn: 'Imakatsu Gilling Jack',
          priceYen: '¥1200',
          priceUSD: '$12.99',
          priceAUD: '$18.25',
          url: 'https://www.plat.co.jp/shop/catalog/product_info/language/en/products_id/42135',
          bundleGroup: 'leftover'
        },
        {
          id: '7',
          name: 'メガバス ポップX',
          nameEn: 'Megabass Pop-X',
          priceYen: '¥1950',
          priceUSD: '$19.99',
          priceAUD: '$28.50',
          url: 'https://www.plat.co.jp/shop/catalog/product_info/language/en/products_id/37290',
          bundleGroup: '2'
        }
      ];
    }
    
    // Return standard mock data for other queries
    const mockProducts = [
      {
        id: '1',
        name: `${query} - Premium Model`,
        price: '$199.99',
        seller: 'TechGiant Store',
        rating: '4.8',
        url: 'https://www.ebay.com'
      },
      {
        id: '2',
        name: `${query} - Standard Edition`,
        price: '$149.99',
        seller: 'ElectronicsHub',
        rating: '4.5',
        url: 'https://www.ebay.com'
      },
      {
        id: '3',
        name: `Budget ${query}`,
        price: '$89.99',
        seller: 'DiscountDeals',
        rating: '4.2',
        url: 'https://www.ebay.com'
      },
      {
        id: '4',
        name: `${query} Pro Max`,
        price: '$299.99',
        seller: 'PremiumGadgets',
        rating: '4.9',
        url: 'https://www.ebay.com'
      },
      {
        id: '5',
        name: `Refurbished ${query}`,
        price: '$129.99',
        seller: 'RenewTech',
        rating: '4.0',
        url: 'https://www.ebay.com'
      }
    ];

    // Filter by category in real app
    return mockProducts;
  };

  const scrapeData = async (query: string, category: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock data (replace with real API call)
      const results = generateMockData(query, category);
      setData(results);
      
      toast({
        title: "Processing Complete",
        description: `Found ${results.length} results for "${query}"`,
      });
    } catch (error) {
      console.error('Error during processing:', error);
      toast({
        title: "Error",
        description: "Failed to process data. Please try again.",
        variant: "destructive",
      });
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    scrapeData
  };
};
