
export type TranslationKey = 
  | 'appTitle'
  | 'search'
  | 'searchPlaceholder'
  | 'category'
  | 'allCategories'
  | 'electronics'
  | 'fashion'
  | 'home'
  | 'toys'
  | 'sports'
  | 'scrapeNow'
  | 'scraping'
  | 'product'
  | 'price'
  | 'seller'
  | 'rating'
  | 'link'
  | 'exportData'
  | 'exportCSV'
  | 'exportJSON'
  | 'priceComparison'
  | 'noData'
  | 'loading'
  | 'errorFetching'
  | 'viewDetails'
  | 'actions'
  | 'translateProducts'
  | 'priceUSD'
  | 'priceAUD'
  | 'priceYen'
  | 'bundleGroup'
  | 'leftoverItems'
  | 'createBundles';

type Translation = Record<TranslationKey, string>;

export const translations: Record<string, Translation> = {
  en: {
    appTitle: 'Fishing Lure Dashboard',
    search: 'Search',
    searchPlaceholder: 'Enter product name...',
    category: 'Category',
    allCategories: 'All Categories',
    electronics: 'Electronics',
    fashion: 'Fashion',
    home: 'Home & Garden',
    toys: 'Toys',
    sports: 'Sports',
    scrapeNow: 'Scrape & Process',
    scraping: 'Processing...',
    product: 'Product',
    price: 'Price',
    seller: 'Seller',
    rating: 'Rating',
    link: 'Link',
    exportData: 'Export Data',
    exportCSV: 'Export as CSV',
    exportJSON: 'Export as JSON',
    priceComparison: 'Price Comparison',
    noData: 'No data available',
    loading: 'Loading...',
    errorFetching: 'Error fetching data',
    viewDetails: 'View Details',
    actions: 'Actions',
    translateProducts: 'Translate Products',
    priceUSD: 'Price (USD)',
    priceAUD: 'Price (AUD)',
    priceYen: 'Price (¥)',
    bundleGroup: 'Bundle Group',
    leftoverItems: 'Leftover Items',
    createBundles: 'Create Bundles'
  },
  ja: {
    appTitle: '釣りルアーダッシュボード',
    search: '検索',
    searchPlaceholder: '製品名を入力...',
    category: 'カテゴリー',
    allCategories: 'すべてのカテゴリー',
    electronics: '電子機器',
    fashion: 'ファッション',
    home: 'ホーム＆ガーデン',
    toys: 'おもちゃ',
    sports: 'スポーツ',
    scrapeNow: 'スクレイプと処理',
    scraping: '処理中...',
    product: '製品',
    price: '価格',
    seller: '販売者',
    rating: '評価',
    link: 'リンク',
    exportData: 'データのエクスポート',
    exportCSV: 'CSVとしてエクスポート',
    exportJSON: 'JSONとしてエクスポート',
    priceComparison: '価格比較',
    noData: 'データがありません',
    loading: '読み込み中...',
    errorFetching: 'データの取得中にエラーが発生しました',
    viewDetails: '詳細を見る',
    actions: 'アクション',
    translateProducts: '製品の翻訳',
    priceUSD: '価格 (USD)',
    priceAUD: '価格 (AUD)',
    priceYen: '価格 (¥)',
    bundleGroup: 'バンドルグループ',
    leftoverItems: '余りアイテム',
    createBundles: 'バンドルを作成'
  }
};

export const categories = [
  { value: 'all', labelKey: 'allCategories' },
  { value: 'electronics', labelKey: 'electronics' },
  { value: 'fashion', labelKey: 'fashion' },
  { value: 'home', labelKey: 'home' },
  { value: 'toys', labelKey: 'toys' },
  { value: 'sports', labelKey: 'sports' },
];

export type Language = 'en' | 'ja';
