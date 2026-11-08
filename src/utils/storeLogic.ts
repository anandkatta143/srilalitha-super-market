import {
  CartItem,
  CartTotals,
  Category,
  CategoryId,
  DeliveryAddress,
  Product,
  ProductFilterOptions,
} from '../types/store';

export const FREE_DELIVERY_THRESHOLD = 499;
export const STANDARD_DELIVERY_CHARGE = 30;

export const CATEGORY_FALLBACK_IMAGES: Record<CategoryId, string> = {
  'rice-products': '/images/categories/rice.jpg',
  'atta-flour': '/images/categories/atta-jaggery.jpg',
  'dals-pulses': '/images/categories/dals.jpg',
  'cooking-oils': '/images/categories/oils.jpg',
  'spices-masalas': '/images/categories/spices.jpg',
  'dry-fruits-nuts': '/images/categories/dry-fruits.jpg',
  'sugar-jaggery-salt': '/images/categories/atta-jaggery.jpg',
  'biscuits-snacks': '/images/categories/biscuits.jpg',
  'snacks-namkeen': '/images/categories/snacks-noodles.jpg',
  chocolates: '/images/categories/chocolates.jpg',
  beverages: '/images/categories/beverages.jpg',
  'soft-drinks-juices': '/images/categories/beverages.jpg',
  'dairy-products': '/images/categories/dairy.jpg',
  'bakery-products': '/images/categories/bakery-wellness.jpg',
  fruits: '/images/categories/fruits.jpg',
  'fruits-vegetables': '/images/categories/vegetables.jpg',
  'frozen-foods': '/images/categories/snacks-noodles.jpg',
  'instant-foods': '/images/categories/snacks-noodles.jpg',
  'noodles-pasta': '/images/categories/snacks-noodles.jpg',
  'personal-care': '/images/categories/personal-care.jpg',
  'hair-care': '/images/categories/personal-care.jpg',
  'skin-care': '/images/categories/personal-care.jpg',
  'oral-care': '/images/categories/personal-care.jpg',
  'baby-care': '/images/categories/specialty.jpg',
  'cleaning-products': '/images/categories/cleaning.jpg',
  'laundry-products': '/images/categories/cleaning.jpg',
  'household-products': '/images/categories/cleaning.jpg',
  'pooja-items': '/images/categories/specialty.jpg',
  stationery: '/images/categories/specialty.jpg',
  'pet-care': '/images/categories/specialty.jpg',
  'health-wellness': '/images/categories/bakery-wellness.jpg',
};

export function getCategoryFallbackImage(category: CategoryId): string {
  return CATEGORY_FALLBACK_IMAGES[category] || '/images/categories/hero.jpg';
}

export function calculateDiscountPercentage(originalPrice: number, discountPrice: number): number {
  if (originalPrice <= 0 || discountPrice >= originalPrice) {
    return 0;
  }
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
}

export function calculateCartTotals(
  cartItems: CartItem[],
  products: Product[],
  freeThreshold: number = FREE_DELIVERY_THRESHOLD
): CartTotals {
  let subtotal = 0;
  let totalOriginalPrice = 0;
  let totalItemsCount = 0;

  for (const item of cartItems) {
    if (item.quantity <= 0) continue;
    const product = products.find((p) => p.id === item.productId);
    if (!product) continue;

    subtotal += product.discountPrice * item.quantity;
    totalOriginalPrice += product.originalPrice * item.quantity;
    totalItemsCount += item.quantity;
  }

  const totalSavings = Math.max(0, totalOriginalPrice - subtotal);
  const deliveryCharge =
    subtotal === 0 ? 0 : subtotal >= freeThreshold ? 0 : STANDARD_DELIVERY_CHARGE;
  const grandTotal = subtotal + deliveryCharge;
  const amountForFreeDelivery =
    subtotal >= freeThreshold || subtotal === 0 ? 0 : Math.max(0, freeThreshold - subtotal);

  return {
    subtotal,
    totalOriginalPrice,
    totalSavings,
    deliveryCharge,
    grandTotal,
    totalItemsCount,
    freeDeliveryThreshold: freeThreshold,
    amountForFreeDelivery,
  };
}

export function filterAndSortProducts(
  products: Product[],
  options: ProductFilterOptions
): Product[] {
  const query = options.searchQuery.trim().toLowerCase();
  const minDiscount = options.minDiscount || 0;

  const filtered = products.filter((product) => {
    if (options.category !== 'all' && product.category !== options.category) {
      return false;
    }

    if (
      options.subcategory &&
      options.subcategory !== 'all' &&
      product.subcategory?.toLowerCase() !== options.subcategory.toLowerCase()
    ) {
      return false;
    }

    if (options.brand !== 'all' && product.brand.toLowerCase() !== options.brand.toLowerCase()) {
      return false;
    }

    if (options.onlyInStock && !product.inStock) {
      return false;
    }

    if (product.discountPrice > options.maxPrice) {
      return false;
    }

    if (minDiscount > 0) {
      const disc = calculateDiscountPercentage(product.originalPrice, product.discountPrice);
      if (disc < minDiscount) {
        return false;
      }
    }

    if (options.collection !== 'all' && !product.tags.includes(options.collection)) {
      return false;
    }

    if (query.length > 0) {
      const matchesName = product.name.toLowerCase().includes(query);
      const matchesBrand = product.brand.toLowerCase().includes(query);
      const matchesDesc = product.description.toLowerCase().includes(query);
      const matchesCategory = product.category.replace(/-/g, ' ').toLowerCase().includes(query);
      const matchesSubcategory = (product.subcategory || '').toLowerCase().includes(query);
      if (
        !matchesName &&
        !matchesBrand &&
        !matchesDesc &&
        !matchesCategory &&
        !matchesSubcategory
      ) {
        return false;
      }
    }

    return true;
  });

  const sorted = [...filtered];
  switch (options.sortBy) {
    case 'price-asc':
      sorted.sort((a, b) => a.discountPrice - b.discountPrice);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.discountPrice - a.discountPrice);
      break;
    case 'discount-desc':
      sorted.sort(
        (a, b) =>
          calculateDiscountPercentage(b.originalPrice, b.discountPrice) -
          calculateDiscountPercentage(a.originalPrice, a.discountPrice)
      );
      break;
    case 'newest':
      sorted.sort((a, b) => {
        const aNew = a.tags.includes('newly-added') ? 1 : 0;
        const bNew = b.tags.includes('newly-added') ? 1 : 0;
        if (bNew !== aNew) return bNew - aNew;
        return b.popularityScore - a.popularityScore;
      });
      break;
    case 'popularity':
    default:
      sorted.sort((a, b) => b.popularityScore - a.popularityScore);
      break;
  }

  return sorted;
}

export interface SearchSuggestion {
  type: 'product' | 'category' | 'brand';
  id: string;
  label: string;
  sublabel: string;
  price?: number;
}

export function getSearchSuggestions(
  products: Product[],
  categories: Category[],
  query: string,
  limit: number = 6
): SearchSuggestion[] {
  const q = query.trim().toLowerCase();
  if (q.length < 1) return [];

  const suggestions: SearchSuggestion[] = [];

  for (const cat of categories) {
    if (
      cat.name.toLowerCase().includes(q) ||
      cat.subcategories.some((s) => s.toLowerCase().includes(q))
    ) {
      suggestions.push({
        type: 'category',
        id: cat.id,
        label: `${cat.code}. ${cat.name}`,
        sublabel: cat.subcategories.slice(0, 3).join(', '),
      });
    }
    if (suggestions.length >= 2) break;
  }

  for (const prod of products) {
    if (
      prod.name.toLowerCase().includes(q) ||
      prod.brand.toLowerCase().includes(q) ||
      (prod.subcategory && prod.subcategory.toLowerCase().includes(q))
    ) {
      suggestions.push({
        type: 'product',
        id: prod.id,
        label: prod.name,
        sublabel: `${prod.brand} · ${prod.weight}`,
        price: prod.discountPrice,
      });
    }
    if (suggestions.length >= limit) break;
  }

  return suggestions.slice(0, limit);
}

export interface CheckoutValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof DeliveryAddress | 'upiId', string>>;
}

export function validateCheckoutAddress(
  address: Omit<DeliveryAddress, 'id' | 'label'>,
  paymentMethod: 'cod' | 'upi',
  upiId?: string
): CheckoutValidationResult {
  const errors: Partial<Record<keyof DeliveryAddress | 'upiId', string>> = {};

  if (!address.customerName || address.customerName.trim().length < 2) {
    errors.customerName = 'Please enter customer full name.';
  }

  const cleanedPhone = (address.mobileNumber || '').replace(/\D/g, '');
  if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
    errors.mobileNumber = 'Please enter a valid 10-digit Indian mobile number.';
  }

  if (!address.houseNumber || address.houseNumber.trim().length < 1) {
    errors.houseNumber = 'Please enter House / Door Number.';
  }

  if (!address.streetArea || address.streetArea.trim().length < 3) {
    errors.streetArea = 'Please enter Street / Area / Colony.';
  }

  if (!address.villageTown || address.villageTown.trim().length < 2) {
    errors.villageTown = 'Please enter Village / Town name.';
  }

  const cleanedPincode = (address.pincode || '').trim();
  if (!/^5\d{5}$/.test(cleanedPincode)) {
    errors.pincode = 'Please enter a valid 6-digit Andhra Pradesh Pincode (e.g. 521215).';
  }

  if (!address.landmark || address.landmark.trim().length < 2) {
    errors.landmark = 'Please enter a nearby landmark for easy delivery.';
  }

  if (!address.deliveryAddressNotes || address.deliveryAddressNotes.trim().length < 5) {
    errors.deliveryAddressNotes = 'Please enter your complete delivery address details.';
  }

  if (paymentMethod === 'upi') {
    const cleanedUpi = (upiId || '').trim();
    if (!cleanedUpi.includes('@') || cleanedUpi.length < 5) {
      errors.upiId = 'Please enter a valid UPI ID (e.g. name@ybl or mobile@okaxis).';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function generateOrderId(date: Date = new Date(), randomSeed?: number): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const suffix =
    randomSeed !== undefined
      ? String(randomSeed).padStart(4, '0')
      : String(Math.floor(1000 + Math.random() * 9000));
  return `SLSM-VSP-${year}${month}${day}-${suffix}`;
}

export function resolveAisleProducts(
  products: Product[],
  aisle: { categories: string[]; productIds?: string[] }
): Product[] {
  const picked: Product[] = [];
  const seen = new Set<string>();

  if (aisle.productIds && aisle.productIds.length > 0) {
    for (const pid of aisle.productIds) {
      const found = products.find((p) => p.id === pid);
      if (found && !seen.has(found.id)) {
        picked.push(found);
        seen.add(found.id);
      }
    }
  }

  for (const prod of products) {
    if (aisle.categories.includes(prod.category) && !seen.has(prod.id)) {
      picked.push(prod);
      seen.add(prod.id);
    }
  }

  return picked;
}

