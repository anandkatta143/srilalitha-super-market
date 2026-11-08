import {
  CartItem,
  Category,
  CustomerProfile,
  Order,
  Product,
} from '../types/store';
import { DEMO_PRODUCTS, STORE_CATEGORIES } from '../data/demoProducts';

/**
 * Future Backend-Ready Store Repository Abstraction
 * Designed for drop-in replacement with Firebase Firestore or Supabase PostgreSQL
 * and Admin Dashboard inventory/order management.
 */
export interface IStoreRepository {
  getCategories(): Promise<Category[]>;
  getProducts(): Promise<Product[]>;
  saveProduct(product: Product): Promise<Product>;
  getCart(): CartItem[];
  saveCart(items: CartItem[]): void;
  getWishlist(): string[];
  saveWishlist(ids: string[]): void;
  getOrders(): Order[];
  saveOrders(orders: Order[]): void;
  getCustomerProfile(defaultProfile: CustomerProfile): CustomerProfile;
  saveCustomerProfile(profile: CustomerProfile): void;
  subscribeNewsletter(emailOrPhone: string): Promise<{ success: boolean; message: string }>;
}

const STORAGE_KEYS = {
  CART: 'slsm_cart_v1',
  WISHLIST: 'slsm_wishlist_v1',
  ORDERS: 'slsm_orders_v1',
  CUSTOMER: 'slsm_customer_v1',
  CUSTOM_PRODUCTS: 'slsm_products_v2',
  NEWSLETTER: 'slsm_newsletter_v1',
};

export const storeRepository: IStoreRepository = {
  async getCategories(): Promise<Category[]> {
    return STORE_CATEGORIES;
  },

  async getProducts(): Promise<Product[]> {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved) as Product[];
        if (Array.isArray(parsed) && parsed.length >= DEMO_PRODUCTS.length) {
          const demoById = new Map(DEMO_PRODUCTS.map((d) => [d.id, d]));
          return parsed.map((item) => {
            const latestDemo = demoById.get(item.id);
            return latestDemo
              ? { ...item, image: latestDemo.image, gallery: latestDemo.gallery }
              : item;
          });
        }
      }
    } catch {
      // fallback to demo products
    }
    return DEMO_PRODUCTS;
  },

  async saveProduct(product: Product): Promise<Product> {
    const current = await this.getProducts();
    const exists = current.some((p) => p.id === product.id);
    const updated = exists
      ? current.map((p) => (p.id === product.id ? product : p))
      : [product, ...current];
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_PRODUCTS, JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
    return product;
  },

  getCart(): CartItem[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      { productId: 'slsm-dal-01', quantity: 1 },
      { productId: 'slsm-veg-01', quantity: 1 },
    ];
  },

  saveCart(items: CartItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
    } catch {
      // ignore
    }
  },

  getWishlist(): string[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['slsm-rice-01', 'slsm-oil-03'];
  },

  saveWishlist(ids: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(ids));
    } catch {
      // ignore
    }
  },

  getOrders(): Order[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  },

  saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // ignore
    }
  },

  getCustomerProfile(defaultProfile: CustomerProfile): CustomerProfile {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMER);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return defaultProfile;
  },

  saveCustomerProfile(profile: CustomerProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(profile));
    } catch {
      // ignore
    }
  },

  async subscribeNewsletter(
    emailOrPhone: string
  ): Promise<{ success: boolean; message: string }> {
    const cleaned = emailOrPhone.trim();
    if (!cleaned || cleaned.length < 5) {
      return {
        success: false,
        message: 'Please enter a valid email address or 10-digit WhatsApp number.',
      };
    }
    try {
      const existingRaw = localStorage.getItem(STORAGE_KEYS.NEWSLETTER);
      const list: string[] = existingRaw ? JSON.parse(existingRaw) : [];
      if (!list.includes(cleaned)) {
        list.push(cleaned);
        localStorage.setItem(STORAGE_KEYS.NEWSLETTER, JSON.stringify(list));
      }
    } catch {
      // ignore
    }
    return {
      success: true,
      message: `Subscribed "${cleaned}" to Sri Lalitha Super Market weekly Vissannapeta deals!`,
    };
  },
};
