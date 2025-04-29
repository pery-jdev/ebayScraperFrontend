import { useMutation, useQuery } from '@tanstack/react-query';
import {
  searchProducts,
  translateProducts,
  createBundles,
  convertCurrency
} from '@/api/productApi';
import {
  SearchParams,
  BundleParams,
  CurrencyConversionParams
} from '@/types/product';

export const useSearchProducts = () => {
  return useMutation({
    mutationFn: (params: SearchParams) => searchProducts(params)
  });
};

export const useTranslateProducts = () => {
  return useMutation({
    mutationFn: (file: File) => translateProducts(file)
  });
};

export const useCreateBundles = () => {
  return useMutation({
    mutationFn: ({ file, params }: { file: File; params: BundleParams }) => 
      createBundles(file, params)
  });
};

export const useConvertCurrency = () => {
  return useMutation({
    mutationFn: (params: CurrencyConversionParams) => convertCurrency(params)
  });
};

// Example query hook (if we had GET endpoints)
export const useGetProducts = (enabled = true) => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => searchProducts({ query: '', category: 'all' }),
    enabled
  });
};
