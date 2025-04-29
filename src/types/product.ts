export interface ProductData {
  id: string;
  name: string;
  nameEn?: string;
  priceYen?: string;
  priceUSD?: string;
  priceAUD?: string;
  url: string;
  bundleGroup?: string | 'leftover';
  seller?: string;
  rating?: string;
}

export interface SearchParams {
  query: string;
  category: string;
}

export interface BundleParams {
  luresPerBundle: number;
  minUSDValue: number;
  targetYenPerLure: number;
}

export interface CurrencyConversionParams {
  amount: number;
  from: string;
  to: string;
}

export interface CurrencyConversionResult {
  convertedAmount: number;
}
