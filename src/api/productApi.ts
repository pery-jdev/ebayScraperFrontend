import axios from 'axios';
import {
  ProductData,
  SearchParams,
  BundleParams,
  CurrencyConversionParams,
  CurrencyConversionResult
} from '@/types/product';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Search products
export const searchProducts = async (params: SearchParams): Promise<ProductData[]> => {
  const response = await apiClient.post('/search', params);
  return response.data;
};

// Translate products from CSV
export const translateProducts = async (file: File): Promise<ProductData[]> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiClient.post('/translate', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Create lure bundles
export const createBundles = async (
  file: File,
  params: BundleParams
): Promise<ProductData[]> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('luresPerBundle', params.luresPerBundle.toString());
  formData.append('minUSDValue', params.minUSDValue.toString());
  formData.append('targetYenPerLure', params.targetYenPerLure.toString());

  const response = await apiClient.post('/bundle', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Convert currency
export const convertCurrency = async (
  params: CurrencyConversionParams
): Promise<CurrencyConversionResult> => {
  const response = await apiClient.post('/convert', params);
  return response.data;
};
