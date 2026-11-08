import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDiscountPercentage,
  calculateCartTotals,
  filterAndSortProducts,
  getSearchSuggestions,
  validateCheckoutAddress,
  generateOrderId,
  resolveAisleProducts,
  getCategoryFallbackImage,
} from './storeLogic';
import { DEMO_PRODUCTS, STORE_CATEGORIES } from '../data/demoProducts';
import { Category, Product } from '../types/store';

const sampleProducts: Product[] = [
  {
    id: 'p1',
    name: 'Lalitha Gold Aged Sona Masoori Rice',
    brand: 'Lalitha Gold',
    category: 'rice-products',
    subcategory: 'Sona Masoori Rice',
    weight: '25 kg Bag',
    originalPrice: 1650,
    discountPrice: 1399,
    inStock: true,
    stockCount: 40,
    rating: 4.9,
    reviewsCount: 128,
    popularityScore: 98,
    image: '/test.jpg',
    tags: ['best-seller', 'special-offer'],
    description: 'Fine quality aged Sona Masoori raw rice from Andhra Pradesh.',
    isDemoData: true,
  },
  {
    id: 'p2',
    name: 'Freedom Refined Sunflower Oil',
    brand: 'Freedom',
    category: 'cooking-oils',
    subcategory: 'Sunflower Oil',
    weight: '1 Litre Pouch',
    originalPrice: 160,
    discountPrice: 135,
    inStock: true,
    stockCount: 85,
    rating: 4.8,
    reviewsCount: 94,
    popularityScore: 95,
    image: '/test2.jpg',
    tags: ['featured', 'discount-deal'],
    description: 'Pure refined sunflower cooking oil.',
    isDemoData: true,
  },
  {
    id: 'p3',
    name: 'Out of Stock Organic Jaggery',
    brand: 'Vissannapeta Naturals',
    category: 'sugar-jaggery-salt',
    subcategory: 'Organic Jaggery',
    weight: '1 kg',
    originalPrice: 120,
    discountPrice: 90,
    inStock: false,
    stockCount: 0,
    rating: 4.6,
    reviewsCount: 18,
    popularityScore: 70,
    image: '/test3.jpg',
    tags: ['newly-added'],
    description: 'Chemical-free traditional cane jaggery.',
    isDemoData: true,
  },
];

const sampleCategories: Category[] = [
  {
    id: 'rice-products',
    code: 'A',
    name: 'Rice & Rice Products',
    teluguSubtitle: 'బియ్యం & అటుకులు',
    description: 'Aged Sona Masoori & Basmati',
    subcategories: ['Sona Masoori Rice', 'Basmati Rice', 'Poha & Murmura'],
    image: '/test.jpg',
    accentColor: '#0B3B24',
  },
];

test('calculateDiscountPercentage computes accurate integer percentage', () => {
  assert.equal(calculateDiscountPercentage(200, 150), 25);
  assert.equal(calculateDiscountPercentage(1650, 1399), 15);
  assert.equal(calculateDiscountPercentage(100, 100), 0);
  assert.equal(calculateDiscountPercentage(100, 120), 0);
});

test('calculateCartTotals computes subtotal, delivery charges, and free delivery threshold accurately', () => {
  const smallCart = calculateCartTotals([{ productId: 'p2', quantity: 2 }], sampleProducts);
  assert.equal(smallCart.subtotal, 270);
  assert.equal(smallCart.totalOriginalPrice, 320);
  assert.equal(smallCart.totalSavings, 50);
  assert.equal(smallCart.deliveryCharge, 30);
  assert.equal(smallCart.grandTotal, 300);
  assert.equal(smallCart.totalItemsCount, 2);
  assert.equal(smallCart.amountForFreeDelivery, 229);

  const largeCart = calculateCartTotals([{ productId: 'p1', quantity: 1 }], sampleProducts);
  assert.equal(largeCart.subtotal, 1399);
  assert.equal(largeCart.deliveryCharge, 0);
  assert.equal(largeCart.grandTotal, 1399);
  assert.equal(largeCart.amountForFreeDelivery, 0);
});

test('filterAndSortProducts filters by search, brand, subcategory, minDiscount, stock, and sorts by price', () => {
  const byDiscount = filterAndSortProducts(sampleProducts, {
    searchQuery: '',
    category: 'all',
    brand: 'all',
    maxPrice: 2000,
    minDiscount: 20,
    onlyInStock: false,
    collection: 'all',
    sortBy: 'popularity',
  });
  assert.equal(byDiscount.length, 1);
  assert.equal(byDiscount[0].id, 'p3');

  const bySubcategory = filterAndSortProducts(sampleProducts, {
    searchQuery: '',
    category: 'rice-products',
    subcategory: 'Sona Masoori Rice',
    brand: 'all',
    maxPrice: 2000,
    onlyInStock: true,
    collection: 'all',
    sortBy: 'price-asc',
  });
  assert.equal(bySubcategory.length, 1);
  assert.equal(bySubcategory[0].id, 'p1');
});

test('getSearchSuggestions returns matching categories and products', () => {
  const suggestions = getSearchSuggestions(sampleProducts, sampleCategories, 'sona');
  assert.equal(suggestions.length, 2);
  assert.equal(suggestions[0].type, 'category');
  assert.equal(suggestions[1].type, 'product');
});

test('validateCheckoutAddress validates required Vissannapeta address fields and UPI', () => {
  const invalidResult = validateCheckoutAddress(
    {
      customerName: '',
      mobileNumber: '12345',
      houseNumber: '',
      streetArea: '',
      villageTown: '',
      pincode: '110001',
      landmark: '',
      deliveryAddressNotes: '',
    },
    'upi',
    'invalid-upi'
  );
  assert.equal(invalidResult.valid, false);
  assert.ok(invalidResult.errors.customerName);
  assert.ok(invalidResult.errors.mobileNumber);
  assert.ok(invalidResult.errors.pincode);
  assert.ok(invalidResult.errors.upiId);

  const validResult = validateCheckoutAddress(
    {
      customerName: 'Ramesh Babu',
      mobileNumber: '9848052121',
      houseNumber: 'D.No 4-112',
      streetArea: 'Main Road, Near Bus Stand',
      villageTown: 'Vissannapeta',
      pincode: '521215',
      landmark: 'Opposite SBI Bank',
      deliveryAddressNotes: 'D.No 4-112, Main Road, Near Bus Stand, Vissannapeta',
    },
    'cod'
  );
  assert.equal(validResult.valid, true);
});

test('generateOrderId produces deterministic formatted order ID', () => {
  const fixedDate = new Date('2026-11-08T10:00:00Z');
  const id = generateOrderId(fixedDate, 4219);
  assert.equal(id, 'SLSM-VSP-20261108-4219');
});

test('resolveAisleProducts prioritizes explicit productIds and appends matching categories without duplicates', () => {
  const result = resolveAisleProducts(sampleProducts, {
    productIds: ['p2'],
    categories: ['rice-products', 'cooking-oils'],
  });
  assert.equal(result.length, 2);
  assert.equal(result[0].id, 'p2');
  assert.equal(result[1].id, 'p1');
});

test('every product in DEMO_PRODUCTS has a unique product-specific image URL and valid category fallback', () => {
  assert.ok(DEMO_PRODUCTS.length >= 40);
  const uniqueImages = new Set(DEMO_PRODUCTS.map((p) => p.image));
  assert.equal(
    uniqueImages.size,
    DEMO_PRODUCTS.length,
    'Every product in DEMO_PRODUCTS must have a unique image URL'
  );

  for (const product of DEMO_PRODUCTS) {
    assert.ok(product.image.startsWith('/images/products/'), `Expected /images/products/ path for ${product.id}`);
    const fallback = getCategoryFallbackImage(product.category);
    assert.ok(fallback.startsWith('/images/categories/'), `Expected category fallback for ${product.category}`);
  }

  for (const cat of STORE_CATEGORIES) {
    assert.ok(cat.image.startsWith('/images/categories/'), `Expected category image for ${cat.id}`);
  }
});

