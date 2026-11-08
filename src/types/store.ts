export type CategoryId =
  | 'rice-products' // A. Rice & Rice Products
  | 'atta-flour' // B. Wheat, Atta & Flour
  | 'dals-pulses' // C. Dals & Pulses
  | 'cooking-oils' // D. Edible Oils & Ghee
  | 'spices-masalas' // E. Spices & Masalas
  | 'dry-fruits-nuts' // F. Dry Fruits & Nuts
  | 'sugar-jaggery-salt' // G. Sugar, Jaggery & Salt
  | 'biscuits-snacks' // H. Biscuits & Cookies
  | 'snacks-namkeen' // I. Snacks & Namkeen
  | 'chocolates' // J. Chocolates & Candies
  | 'beverages' // K. Tea & Coffee
  | 'soft-drinks-juices' // L. Soft Drinks & Juices
  | 'dairy-products' // M. Milk & Dairy Products
  | 'bakery-products' // N. Bakery Products
  | 'fruits' // O. Fruits
  | 'fruits-vegetables' // P. Fresh Vegetables
  | 'frozen-foods' // Q. Frozen Foods
  | 'instant-foods' // R. Instant Foods & Ready Mixes
  | 'noodles-pasta' // S. Noodles & Pasta
  | 'personal-care' // T. Personal Care
  | 'hair-care' // U. Hair Care
  | 'skin-care' // V. Skin Care
  | 'oral-care' // W. Oral Care
  | 'baby-care' // X. Baby Care
  | 'cleaning-products' // Y. Household Cleaning
  | 'laundry-products' // Z. Laundry Products
  | 'household-products' // AA. Kitchen Essentials
  | 'pooja-items' // AB. Pooja Items
  | 'stationery' // AC. Stationery
  | 'pet-care' // AD. Pet Care
  | 'health-wellness'; // AE. Health & Wellness Grocery

export interface Category {
  id: CategoryId;
  code: string; // 'A' .. 'AE'
  name: string;
  teluguSubtitle: string;
  description: string;
  subcategories: string[];
  image: string;
  accentColor: string;
}

export type CollectionTag =
  | 'special-offer'
  | 'best-seller'
  | 'featured'
  | 'newly-added'
  | 'discount-deal'
  | 'daily-essential'
  | 'recommended';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: CategoryId;
  subcategory?: string;
  weight: string;
  originalPrice: number;
  discountPrice: number;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  popularityScore: number;
  image: string;
  gallery?: string[];
  tags: CollectionTag[];
  description: string;
  origin?: string;
  shelfLife?: string;
  isDemoData: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  totalOriginalPrice: number;
  totalSavings: number;
  deliveryCharge: number;
  grandTotal: number;
  totalItemsCount: number;
  freeDeliveryThreshold: number;
  amountForFreeDelivery: number;
}

export type SortOption =
  | 'popularity'
  | 'price-asc'
  | 'price-desc'
  | 'discount-desc'
  | 'newest';

export type CollectionFilter =
  | 'all'
  | 'special-offer'
  | 'best-seller'
  | 'featured'
  | 'newly-added'
  | 'discount-deal'
  | 'daily-essential'
  | 'recommended';

export interface ProductFilterOptions {
  searchQuery: string;
  category: CategoryId | 'all';
  subcategory?: string | 'all';
  brand: string | 'all';
  maxPrice: number;
  minDiscount?: number;
  onlyInStock: boolean;
  collection: CollectionFilter;
  sortBy: SortOption;
}

export interface DeliveryAddress {
  id: string;
  label: string;
  customerName: string;
  mobileNumber: string;
  houseNumber: string;
  streetArea: string;
  villageTown: string;
  pincode: string;
  landmark: string;
  deliveryAddressNotes: string;
  isDefault?: boolean;
}

export type PaymentMethod = 'cod' | 'upi';
export type DeliveryOption = 'shop-staff' | 'assigned-partner';

export type OrderStatus =
  | 'Confirmed'
  | 'Packed at Vissannapeta Store'
  | 'Out for Delivery'
  | 'Delivered';

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  weight: string;
  unitPrice: number;
  originalPrice: number;
  quantity: number;
  image: string;
}

export interface Order {
  orderId: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalSavings: number;
  grandTotal: number;
  address: DeliveryAddress;
  paymentMethod: PaymentMethod;
  upiReference?: string;
  deliveryOption: DeliveryOption;
  status: OrderStatus;
  estimatedDelivery: string;
  assignedPersonName: string;
  assignedPersonPhone: string;
}

export interface CustomerProfile {
  isLoggedIn: boolean;
  name: string;
  mobile: string;
  email: string;
  villageTown: string;
  memberSince: string;
  savedAddresses: DeliveryAddress[];
}

export interface CustomerReview {
  id: string;
  customerName: string;
  area: string;
  rating: number;
  comment: string;
  purchasedItem: string;
  date: string;
}

export type ActiveView =
  | 'home'
  | 'catalog'
  | 'product-detail'
  | 'checkout'
  | 'order-confirmation'
  | 'my-orders'
  | 'wishlist'
  | 'account';

export type PolicyKey =
  | 'about'
  | 'contact'
  | 'support'
  | 'delivery'
  | 'returns'
  | 'privacy'
  | 'terms';
