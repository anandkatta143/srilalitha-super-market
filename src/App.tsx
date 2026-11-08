import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  Star,
  MapPin,
  Phone,
  Clock,
  Heart,
  CheckCircle2,
  Mail,
  Layers,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  ActiveView,
  CartItem,
  CategoryId,
  CollectionFilter,
  CustomerProfile,
  DeliveryAddress,
  DeliveryOption,
  Order,
  OrderStatus,
  PaymentMethod,
  Product,
  SortOption,
} from './types/store';
import {
  CURATED_AISLE_SECTIONS,
  CUSTOMER_REVIEWS,
  DEMO_PRODUCTS,
  POPULAR_BRANDS,
  PromotionalBannerSlide,
  STORE_CATEGORIES,
} from './data/demoProducts';
import {
  calculateCartTotals,
  filterAndSortProducts,
  generateOrderId,
  getSearchSuggestions,
  resolveAisleProducts,
  SearchSuggestion,
} from './utils/storeLogic';
import { storeRepository } from './services/storeRepository';
import { Header } from './components/Header';
import { PromotionalBanner } from './components/PromotionalBanner';
import { HorizontalProductRow } from './components/HorizontalProductRow';
import { ProductCard } from './components/ProductCard';
import { ProductDetailView } from './components/ProductDetailView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationView } from './components/OrderConfirmationView';
import { AccountModal } from './components/AccountModal';
import { Footer } from './components/Footer';

const INITIAL_CUSTOMER: CustomerProfile = {
  isLoggedIn: true,
  name: 'K. Srinivasa Rao',
  mobile: '9848052121',
  email: 'srinivas.vsp@example.com',
  villageTown: 'Vissannapeta',
  memberSince: '2024',
  savedAddresses: [
    {
      id: 'addr-default-1',
      label: 'Home',
      customerName: 'K. Srinivasa Rao',
      mobileNumber: '9848052121',
      houseNumber: 'D.No 4-88/2',
      streetArea: 'Temple Street, Main Road',
      villageTown: 'Vissannapeta',
      pincode: '521215',
      landmark: 'Near Sri Vasavi Kanyaka Parameswari Temple',
      deliveryAddressNotes:
        'D.No 4-88/2, Temple Street, Main Road, Vissannapeta, NTR District, AP - 521215',
      isDefault: true,
    },
  ],
};

const INITIAL_SAMPLE_ORDER: Order = {
  orderId: 'SLSM-VSP-20261105-3842',
  createdAt: '05 Nov 2026, 10:15 AM',
  items: [
    {
      productId: 'slsm-rice-01',
      name: 'Lalitha Gold Aged Sona Masoori Raw Rice (12 Months Old)',
      brand: 'Lalitha Gold',
      weight: '25 kg Bag',
      unitPrice: 1399,
      originalPrice: 1650,
      quantity: 1,
      image: DEMO_PRODUCTS[0].image,
    },
    {
      productId: 'slsm-oil-01',
      name: 'Freedom Refined Sunflower Oil',
      brand: 'Freedom',
      weight: '1 Litre Pouch',
      unitPrice: 134,
      originalPrice: 160,
      quantity: 2,
      image: DEMO_PRODUCTS[4].image,
    },
  ],
  subtotal: 1667,
  deliveryCharge: 0,
  totalSavings: 303,
  grandTotal: 1667,
  address: INITIAL_CUSTOMER.savedAddresses[0],
  paymentMethod: 'cod',
  deliveryOption: 'shop-staff',
  status: 'Delivered',
  estimatedDelivery: 'Delivered in 38 mins',
  assignedPersonName: 'M. Ramesh (Sri Lalitha Store Staff)',
  assignedPersonPhone: '+91 98480 52129',
};

export default function App() {
  // Navigation & Modal States
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [accountModalState, setAccountModalState] = useState<{
    isOpen: boolean;
    tab: 'profile' | 'login' | 'addresses' | 'orders';
  }>({ isOpen: false, tab: 'profile' });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Catalog Filter, Subcategory, Discount, Sort & Pagination States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [selectedCollection, setSelectedCollection] = useState<CollectionFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [expandAllCategoriesGrid, setExpandAllCategoriesGrid] = useState<boolean>(false);

  // Newsletter State
  const [newsletterContact, setNewsletterContact] = useState('');
  const [newsletterFeedback, setNewsletterFeedback] = useState<string | null>(null);

  const catalogSectionRef = useRef<HTMLElement | null>(null);
  const categoriesSectionRef = useRef<HTMLElement | null>(null);
  const categoryRailRef = useRef<HTMLDivElement | null>(null);

  // Persisted Cart, Wishlist, Orders & Customer Profile via storeRepository
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    storeRepository.getCart()
  );

  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    storeRepository.getWishlist()
  );

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = storeRepository.getOrders();
    return saved.length > 0 ? saved : [INITIAL_SAMPLE_ORDER];
  });

  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  const [customer, setCustomer] = useState<CustomerProfile>(() =>
    storeRepository.getCustomerProfile(INITIAL_CUSTOMER)
  );

  useEffect(() => {
    storeRepository.saveCart(cartItems);
  }, [cartItems]);

  useEffect(() => {
    storeRepository.saveWishlist(wishlistIds);
  }, [wishlistIds]);

  useEffect(() => {
    storeRepository.saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    storeRepository.saveCustomerProfile(customer);
  }, [customer]);

  // Reset pagination count when filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [
    searchQuery,
    selectedCategory,
    selectedSubcategory,
    selectedBrand,
    maxPrice,
    minDiscount,
    onlyInStock,
    selectedCollection,
    sortBy,
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2800);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Computed Cart Totals
  const cartTotals = useMemo(
    () => calculateCartTotals(cartItems, DEMO_PRODUCTS),
    [cartItems]
  );

  // All Unique Brands
  const allBrands = useMemo(() => {
    const set = new Set<string>(DEMO_PRODUCTS.map((p) => p.brand));
    return Array.from(set).sort();
  }, []);

  // Live Search Suggestions
  const searchSuggestions = useMemo(
    () => getSearchSuggestions(DEMO_PRODUCTS, STORE_CATEGORIES, searchQuery),
    [searchQuery]
  );

  // Active Category Object
  const activeCategoryObj = useMemo(
    () =>
      selectedCategory === 'all'
        ? undefined
        : STORE_CATEGORIES.find((c) => c.id === selectedCategory),
    [selectedCategory]
  );

  // Filtered & Sorted Products
  const filteredProducts = useMemo(
    () =>
      filterAndSortProducts(DEMO_PRODUCTS, {
        searchQuery,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        brand: selectedBrand,
        maxPrice,
        minDiscount,
        onlyInStock,
        collection: selectedCollection,
        sortBy,
      }),
    [
      searchQuery,
      selectedCategory,
      selectedSubcategory,
      selectedBrand,
      maxPrice,
      minDiscount,
      onlyInStock,
      selectedCollection,
      sortBy,
    ]
  );

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  // Resolved Products for all 16 Horizontal Category Sections
  const resolvedAisleSections = useMemo(
    () =>
      CURATED_AISLE_SECTIONS.map((aisle) => ({
        ...aisle,
        products: resolveAisleProducts(DEMO_PRODUCTS, aisle),
      })),
    []
  );

  // Selected Product for Product Detail View
  const selectedProduct: Product | null = useMemo(
    () =>
      selectedProductId
        ? DEMO_PRODUCTS.find((p) => p.id === selectedProductId) || null
        : null,
    [selectedProductId]
  );

  const relatedProducts = useMemo(() => {
    if (!selectedProduct) return [];
    const sameCategory = DEMO_PRODUCTS.filter(
      (p) => p.category === selectedProduct.category && p.id !== selectedProduct.id
    );
    if (sameCategory.length >= 4) return sameCategory.slice(0, 4);
    const others = DEMO_PRODUCTS.filter(
      (p) => p.category !== selectedProduct.category && p.id !== selectedProduct.id
    ).slice(0, 4 - sameCategory.length);
    return [...sameCategory, ...others];
  }, [selectedProduct]);

  // Open Product Detail Page
  const handleOpenProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    setActiveView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Smooth jump to any horizontal aisle section
  const handleJumpToAisle = (aisleId: string) => {
    setActiveView('home');
    setTimeout(() => {
      const el = document.getElementById(`aisle-${aisleId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  // Handle Promotional Banner Slide CTA
  const handleBannerSlideAction = (slide: PromotionalBannerSlide) => {
    if (slide.targetAisleId) {
      handleJumpToAisle(slide.targetAisleId);
    } else if (slide.targetCategory) {
      setSelectedCategory(slide.targetCategory);
      setSelectedSubcategory('all');
      catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Search Suggestion Click
  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'product') {
      setSearchQuery('');
      handleOpenProductDetail(suggestion.id);
    } else if (suggestion.type === 'category') {
      setSearchQuery('');
      setSelectedCategory(suggestion.id as CategoryId);
      setSelectedSubcategory('all');
      setActiveView('home');
      setTimeout(() => {
        catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else if (suggestion.type === 'brand') {
      setSearchQuery('');
      setSelectedBrand(suggestion.label);
      setActiveView('home');
      setTimeout(() => {
        catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    }
  };

  // Cart Handlers
  const handleAddToCart = (productId: string) => {
    const product = DEMO_PRODUCTS.find((p) => p.id === productId);
    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
    if (product) {
      showToast(`Added "${product.name}" to your Vissannapeta cart`);
    }
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setCartItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: newQuantity } : i
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const handleBuyNow = (productId: string) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) return prev;
      return [...prev, { productId, quantity: 1 }];
    });
    setIsCartOpen(false);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleWishlist = (productId: string) => {
    const product = DEMO_PRODUCTS.find((p) => p.id === productId);
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        if (product) showToast(`Removed "${product.name}" from Wishlist`);
        return prev.filter((id) => id !== productId);
      } else {
        if (product) showToast(`Saved "${product.name}" to Wishlist`);
        return [...prev, productId];
      }
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSelectedBrand('all');
    setMaxPrice(2000);
    setMinDiscount(0);
    setOnlyInStock(false);
    setSelectedCollection('all');
    setSortBy('popularity');
    setVisibleCount(12);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await storeRepository.subscribeNewsletter(newsletterContact);
    if (result.success) {
      setNewsletterFeedback(
        'Subscribed! You will receive Vissannapeta weekly wholesale price alerts & festival offers.'
      );
      setNewsletterContact('');
      showToast('Subscribed to Sri Lalitha Super Market Weekly Deals!');
    } else {
      setNewsletterFeedback('Please enter a valid 10-digit mobile number or email address.');
    }
  };

  const handlePlaceOrder = (orderData: {
    address: DeliveryAddress;
    paymentMethod: PaymentMethod;
    upiReference?: string;
    deliveryOption: DeliveryOption;
    saveAddress: boolean;
  }) => {
    const orderItems = cartItems
      .map((item) => {
        const product = DEMO_PRODUCTS.find((p) => p.id === item.productId);
        if (!product) return null;
        return {
          productId: product.id,
          name: product.name,
          brand: product.brand,
          weight: product.weight,
          unitPrice: product.discountPrice,
          originalPrice: product.originalPrice,
          quantity: item.quantity,
          image: product.image,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    const newOrder: Order = {
      orderId: generateOrderId(new Date()),
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      items: orderItems,
      subtotal: cartTotals.subtotal,
      deliveryCharge: cartTotals.deliveryCharge,
      totalSavings: cartTotals.totalSavings,
      grandTotal: cartTotals.grandTotal,
      address: orderData.address,
      paymentMethod: orderData.paymentMethod,
      upiReference: orderData.upiReference,
      deliveryOption: orderData.deliveryOption,
      status: 'Confirmed',
      estimatedDelivery:
        orderData.deliveryOption === 'shop-staff'
          ? '35–45 mins (Vissannapeta Store Staff)'
          : '25–35 mins (Assigned Express Partner)',
      assignedPersonName:
        orderData.deliveryOption === 'shop-staff'
          ? 'M. Ramesh (Sri Lalitha Store Staff)'
          : 'P. Ravi Teja (Assigned Delivery Partner)',
      assignedPersonPhone:
        orderData.deliveryOption === 'shop-staff'
          ? '+91 98480 52129'
          : '+91 94401 68214',
    };

    if (orderData.saveAddress) {
      setCustomer((prev) => {
        const alreadyExists = prev.savedAddresses.some(
          (a) =>
            a.houseNumber.toLowerCase() === orderData.address.houseNumber.toLowerCase() &&
            a.streetArea.toLowerCase() === orderData.address.streetArea.toLowerCase()
        );
        if (alreadyExists) return prev;
        return {
          ...prev,
          name: orderData.address.customerName,
          mobile: orderData.address.mobileNumber,
          savedAddresses: [orderData.address, ...prev.savedAddresses],
        };
      });
    }

    setOrders((prev) => [newOrder, ...prev]);
    setLatestOrder(newOrder);
    setCartItems([]);
    setActiveView('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: nextStatus } : o))
    );
    if (latestOrder?.orderId === orderId) {
      setLatestOrder((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
  };

  const handleReorder = (order: Order) => {
    setCartItems(
      order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }))
    );
    setIsCartOpen(true);
    showToast(`Loaded ${order.items.length} items from ${order.orderId} into your cart`);
  };

  const getCartQuantity = (productId: string) =>
    cartItems.find((i) => i.productId === productId)?.quantity || 0;

  const wishlistedProducts = useMemo(
    () => DEMO_PRODUCTS.filter((p) => wishlistIds.includes(p.id)),
    [wishlistIds]
  );

  const scrollCategoriesRail = (dir: 'left' | 'right') => {
    if (!categoryRailRef.current) return;
    categoryRailRef.current.scrollBy({
      left: dir === 'left' ? -520 : 520,
      behavior: 'smooth',
    });
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#14261C]">
      {/* Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim().length > 0) {
            setTimeout(() => {
              catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 80);
          }
        }}
        suggestions={searchSuggestions}
        onSelectSuggestion={handleSelectSuggestion}
        cartCount={cartTotals.totalItemsCount}
        cartSubtotal={cartTotals.subtotal}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        customer={customer}
        onOpenAccount={(tab = 'profile') =>
          setAccountModalState({ isOpen: true, tab })
        }
        onSelectCollection={(col) => {
          setSelectedCollection(col);
          setActiveView('home');
          setTimeout(() => {
            catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 60);
        }}
        onScrollToCategories={() => {
          if (activeView !== 'home') {
            setActiveView('home');
            setTimeout(() => {
              categoriesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 60);
          } else {
            categoriesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onJumpToAisle={handleJumpToAisle}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 bg-[#082B1A] text-white px-4 py-3 rounded-xl shadow-lg border border-[#C59B27]/50 flex items-center gap-2.5 text-xs sm:text-sm font-medium"
        >
          <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Router */}
      <main className="flex-1">
        {activeView === 'product-detail' && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            category={STORE_CATEGORIES.find((c) => c.id === selectedProduct.category)}
            quantityInCart={getCartQuantity(selectedProduct.id)}
            isWishlisted={wishlistIds.includes(selectedProduct.id)}
            relatedProducts={relatedProducts}
            getCartQuantity={getCartQuantity}
            wishlistIds={wishlistIds}
            onBack={() => setActiveView('home')}
            onSelectCategory={() => {
              setSelectedCategory(selectedProduct.category);
              setSelectedSubcategory('all');
              setActiveView('home');
              setTimeout(() => {
                catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
              }, 60);
            }}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onBuyNow={handleBuyNow}
            onToggleWishlist={handleToggleWishlist}
            onSelectProduct={(prod) => handleOpenProductDetail(prod.id)}
          />
        )}

        {activeView === 'checkout' && (
          <CheckoutView
            cartItems={cartItems}
            products={DEMO_PRODUCTS}
            totals={cartTotals}
            customer={customer}
            onBackToShop={() => setActiveView('home')}
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {(activeView === 'order-confirmation' || activeView === 'my-orders') && (
          <OrderConfirmationView
            latestOrder={latestOrder}
            orders={orders}
            mode={activeView === 'order-confirmation' ? 'confirmation' : 'my-orders'}
            onContinueShopping={() => setActiveView('home')}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onReorder={handleReorder}
          />
        )}

        {activeView === 'wishlist' && (
          <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E6E0D0] pb-5">
              <div>
                <h1
                  className="text-2xl sm:text-3xl font-bold text-[#14261C]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  My Saved Wishlist ({wishlistedProducts.length})
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Your favorite monthly groceries at Sri Lalitha Super Market, Vissannapeta
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveView('home')}
                className="px-4 py-2 bg-[#0B3B24] text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-[#082B1A] transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>

            {wishlistedProducts.length === 0 ? (
              <div className="bg-white border border-[#E6E0D0] rounded-2xl p-12 text-center space-y-3">
                <Heart className="w-10 h-10 text-slate-300 mx-auto" />
                <h2 className="text-lg font-bold text-[#14261C]">
                  Your wishlist is currently empty
                </h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Tap the heart icon on any grocery product card to save your family’s monthly staples for quick reordering.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveView('home')}
                  className="px-5 py-2.5 bg-[#0B3B24] text-white text-sm font-semibold rounded-lg hover:bg-[#082B1A] cursor-pointer"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlistedProducts.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    pastelIndex={idx}
                    quantityInCart={getCartQuantity(product.id)}
                    isWishlisted={true}
                    onAddToCart={handleAddToCart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onBuyNow={handleBuyNow}
                    onToggleWishlist={handleToggleWishlist}
                    onOpenDetail={() => handleOpenProductDetail(product.id)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {(activeView === 'home' || activeView === 'catalog') && (
          <div className="pb-10">
            {/* 1. WIDE PROMOTIONAL BANNER (Fresh Groceries, Special Offers, Daily Essentials, Festival Offers, New Arrivals) */}
            <PromotionalBanner
              onSelectSlideAction={handleBannerSlideAction}
              onExploreAllCategories={() => {
                setExpandAllCategoriesGrid(true);
                categoriesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 2. HORIZONTAL CATEGORY NAVIGATION STRIP + EXPANDABLE 31 DEPARTMENTS (A to AE) */}
            <section
              id="categories"
              ref={categoriesSectionRef}
              className="py-8 bg-[#F4F0E6] border-b border-[#E5DEC9]"
            >
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-5">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-[#9A6F0B] mb-0.5">
                      SUPERMARKET DIRECTORY · DEPARTMENTS A TO AE
                    </div>
                    <h2
                      className="text-xl sm:text-2xl font-bold text-[#082B1A] tracking-tight"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Shop by All 31 Grocery Categories
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                      Scroll horizontally or expand the full grid to filter by any of our 31 departments
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedCategory !== 'all' && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory('all');
                          setSelectedSubcategory('all');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#0B3B24] text-white text-xs font-semibold hover:bg-[#082B1A] cursor-pointer"
                      >
                        Reset Category Filter
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setExpandAllCategoriesGrid((prev) => !prev)}
                      className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-[#0B3B24] text-[#0B3B24] hover:text-white border border-[#D4CEBE] text-xs font-bold transition-colors cursor-pointer"
                    >
                      {expandAllCategoriesGrid
                        ? 'Switch to Horizontal Slider'
                        : 'View All 31 Categories Grid'}
                    </button>

                    {!expandAllCategoriesGrid && (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => scrollCategoriesRail('left')}
                          aria-label="Scroll categories left"
                          className="w-8 h-8 rounded-full bg-white hover:bg-[#0B3B24] text-[#082B1A] hover:text-white border border-[#D4CEBE] flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => scrollCategoriesRail('right')}
                          aria-label="Scroll categories right"
                          className="w-8 h-8 rounded-full bg-white hover:bg-[#0B3B24] text-[#082B1A] hover:text-white border border-[#D4CEBE] flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {expandAllCategoriesGrid ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {STORE_CATEGORIES.map((cat) => {
                      const isActive = selectedCategory === cat.id;
                      const countInCat = DEMO_PRODUCTS.filter(
                        (p) => p.category === cat.id
                      ).length;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            if (isActive) {
                              setSelectedCategory('all');
                              setSelectedSubcategory('all');
                            } else {
                              setSelectedCategory(cat.id);
                              setSelectedSubcategory('all');
                              catalogSectionRef.current?.scrollIntoView({
                                behavior: 'smooth',
                              });
                            }
                          }}
                          className={`group text-left p-3 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                            isActive
                              ? 'border-[#0B3B24] bg-[#0B3B24] text-white shadow-sm'
                              : 'border-[#E6E0D0] bg-white hover:border-[#0B3B24] hover:shadow-xs'
                          }`}
                        >
                          <div>
                            <div className="aspect-4/3 rounded-lg overflow-hidden bg-[#F4F1EA] mb-2 border border-[#E6E0D0]/60 relative">
                              <img
                                src={cat.image}
                                alt={cat.name}
                                referrerPolicy="no-referrer"
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#082B1A]/90 text-[#D4AF37] font-mono text-[10px] font-bold">
                                {cat.code}
                              </span>
                            </div>
                            <div
                              className={`text-[11px] font-mono mb-0.5 truncate ${
                                isActive ? 'text-[#D4AF37]' : 'text-[#8C7A5B]'
                              }`}
                            >
                              {cat.teluguSubtitle}
                            </div>
                            <h3
                              className={`text-xs font-bold leading-snug truncate ${
                                isActive ? 'text-white' : 'text-[#14261C]'
                              }`}
                            >
                              {cat.name}
                            </h3>
                          </div>
                          <div
                            className={`text-[11px] mt-1.5 font-semibold flex items-center justify-between ${
                              isActive ? 'text-[#D4AF37]' : 'text-[#0B3B24]'
                            }`}
                          >
                            <span>
                              {countInCat} {countInCat === 1 ? 'Item' : 'Items'}
                            </span>
                            <span>→</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    ref={categoryRailRef}
                    className="flex items-stretch gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {STORE_CATEGORIES.map((cat) => {
                      const isActive = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(isActive ? 'all' : cat.id);
                            setSelectedSubcategory('all');
                            catalogSectionRef.current?.scrollIntoView({
                              behavior: 'smooth',
                            });
                          }}
                          className={`group w-[165px] sm:w-[180px] shrink-0 snap-start text-left p-2.5 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                            isActive
                              ? 'border-[#0B3B24] bg-[#0B3B24] text-white shadow-sm'
                              : 'border-[#E2DEC9] bg-white hover:border-[#0B3B24] hover:shadow-xs'
                          }`}
                        >
                          <div>
                            <div className="aspect-4/3 rounded-lg overflow-hidden bg-[#F5F2EB] mb-2 relative">
                              <img
                                src={cat.image}
                                alt={cat.name}
                                referrerPolicy="no-referrer"
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#082B1A]/90 text-[#D4AF37] font-mono text-[10px] font-bold">
                                {cat.code}
                              </span>
                            </div>
                            <div
                              className={`text-[10px] font-mono truncate ${
                                isActive ? 'text-[#D4AF37]' : 'text-[#8C7A5B]'
                              }`}
                            >
                              {cat.teluguSubtitle}
                            </div>
                            <h3
                              className={`text-xs font-bold leading-snug truncate mt-0.5 ${
                                isActive ? 'text-white' : 'text-[#14261C]'
                              }`}
                            >
                              {cat.name}
                            </h3>
                          </div>
                          <div
                            className={`text-[10px] mt-1.5 font-medium truncate ${
                              isActive ? 'text-emerald-100' : 'text-slate-500'
                            }`}
                          >
                            {cat.subcategories[0]} →
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            {/* 3. ALL 16 NATURE'S BASKET-INSPIRED HORIZONTAL PRODUCT CATEGORY SECTIONS */}
            <div data-testid="horizontal-aisles-container">
              {resolvedAisleSections.map((aisle) => (
                <HorizontalProductRow
                  key={aisle.id}
                  id={aisle.id}
                  title={aisle.title}
                  eyebrow={aisle.eyebrow}
                  subtitle={aisle.subtitle}
                  products={aisle.products}
                  accentBg={aisle.accentBg}
                  getCartQuantity={getCartQuantity}
                  wishlistIds={wishlistIds}
                  onAddToCart={handleAddToCart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onBuyNow={handleBuyNow}
                  onToggleWishlist={handleToggleWishlist}
                  onOpenProductDetail={handleOpenProductDetail}
                  onViewAll={() => {
                    if (aisle.categories.length > 0) {
                      setSelectedCategory(aisle.categories[0]);
                      setSelectedSubcategory('all');
                    }
                    catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              ))}
            </div>

            {/* 4. FULL FILTERABLE SUPERMARKET CATALOGUE EXPLORER */}
            <section
              id="shop"
              ref={catalogSectionRef}
              className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-12 space-y-6"
            >
              {/* Section Heading & Collection Tabs */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E6E0D0] pb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#9A6F0B] mb-0.5">
                    Complete Vissannapeta Supermarket Inventory · Search & Filter
                  </div>
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-[#082B1A] tracking-tight"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    All Products & Department Filter
                  </h2>
                  <p className="text-sm text-slate-600 mt-0.5">
                    Showing <strong className="font-mono">{visibleProducts.length}</strong> of{' '}
                    <strong className="font-mono">{filteredProducts.length}</strong> matching products (Total Catalogue:{' '}
                    <strong className="font-mono">{DEMO_PRODUCTS.length}</strong> Demo Sample Items)
                  </p>
                </div>

                {/* Curated Collection Tabs */}
                <div
                  role="tablist"
                  aria-label="Product Collections"
                  className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#EFECE3] rounded-xl border border-[#E2DEC9]"
                >
                  {(
                    [
                      { id: 'all', label: 'All Groceries' },
                      { id: 'special-offer', label: "Today's Best Deals" },
                      { id: 'best-seller', label: 'Best Sellers' },
                      { id: 'daily-essential', label: 'Daily Essentials' },
                      { id: 'discount-deal', label: 'Special Offers' },
                      { id: 'recommended', label: 'Recommended' },
                      { id: 'newly-added', label: 'New Arrivals' },
                    ] as { id: CollectionFilter; label: string }[]
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={selectedCollection === tab.id}
                      onClick={() => setSelectedCollection(tab.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        selectedCollection === tab.id
                          ? 'bg-[#0B3B24] text-white shadow-xs'
                          : 'text-[#14261C] hover:bg-white/70'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Category Subcategories Bar */}
              {activeCategoryObj && (
                <div className="bg-[#EBF3EE] border border-[#0B3B24]/20 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B3B24] mr-1">
                      <Layers className="w-4 h-4 text-[#9A6F0B]" />
                      <span>
                        {activeCategoryObj.code} · {activeCategoryObj.name} Subcategories:
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedSubcategory('all')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        selectedSubcategory === 'all'
                          ? 'bg-[#0B3B24] text-white'
                          : 'bg-white text-[#14261C] hover:bg-white/80 border border-[#D5DDD8]'
                      }`}
                    >
                      All in {activeCategoryObj.name}
                    </button>
                    {activeCategoryObj.subcategories.map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() =>
                          setSelectedSubcategory(selectedSubcategory === sub ? 'all' : sub)
                        }
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          selectedSubcategory === sub
                            ? 'bg-[#0B3B24] text-white'
                            : 'bg-white text-[#14261C] hover:bg-white/80 border border-[#D5DDD8]'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Filter & Sort Toolbar */}
              <div className="bg-white border border-[#E6E0D0] rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center shadow-2xs">
                {/* Category Dropdown */}
                <div className="lg:col-span-3">
                  <label
                    htmlFor="filter-category-select"
                    className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1"
                  >
                    Department (A – AE)
                  </label>
                  <select
                    id="filter-category-select"
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value as CategoryId | 'all');
                      setSelectedSubcategory('all');
                    }}
                    className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#E2DEC9] rounded-lg text-xs sm:text-sm font-medium text-[#14261C] focus:outline-none focus:border-[#0B3B24]"
                  >
                    <option value="all">All 31 Categories (A – AE)</option>
                    {STORE_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.code} · {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div className="lg:col-span-2">
                  <label
                    htmlFor="filter-brand-select"
                    className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1"
                  >
                    Brand Filter
                  </label>
                  <select
                    id="filter-brand-select"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#E2DEC9] rounded-lg text-xs sm:text-sm font-medium text-[#14261C] focus:outline-none focus:border-[#0B3B24]"
                  >
                    <option value="all">All Brands ({allBrands.length})</option>
                    {allBrands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Minimum Discount Filter */}
                <div className="lg:col-span-2">
                  <label
                    htmlFor="filter-discount-select"
                    className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1"
                  >
                    Discount Filter
                  </label>
                  <select
                    id="filter-discount-select"
                    value={minDiscount}
                    onChange={(e) => setMinDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#E2DEC9] rounded-lg text-xs sm:text-sm font-medium text-[#14261C] focus:outline-none focus:border-[#0B3B24]"
                  >
                    <option value={0}>All Discounts</option>
                    <option value={10}>10% Off or more</option>
                    <option value={15}>15% Off or more</option>
                    <option value={20}>20% Off or more</option>
                  </select>
                </div>

                {/* Price Range Filter */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    <label htmlFor="filter-max-price">Max Price</label>
                    <span className="font-mono tabular-nums text-[#0B3B24] font-bold">
                      ₹{maxPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    id="filter-max-price"
                    type="range"
                    min={50}
                    max={2000}
                    step={50}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#0B3B24] cursor-pointer"
                  />
                </div>

                {/* Sort By */}
                <div className="lg:col-span-2">
                  <label
                    htmlFor="sort-by-select"
                    className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1"
                  >
                    Sort Products
                  </label>
                  <select
                    id="sort-by-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#E2DEC9] rounded-lg text-xs sm:text-sm font-medium text-[#14261C] focus:outline-none focus:border-[#0B3B24]"
                  >
                    <option value="popularity">Sort by Popularity</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="discount-desc">Highest Discount %</option>
                    <option value="newest">Newly Added First</option>
                  </select>
                </div>

                {/* In-Stock Toggle & Reset */}
                <div className="lg:col-span-1 flex items-center justify-between lg:flex-col lg:items-end gap-2 pt-2 lg:pt-0">
                  <label className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#14261C] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={(e) => setOnlyInStock(e.target.checked)}
                      className="rounded border-slate-300 text-[#0B3B24] focus:ring-[#0B3B24]"
                    />
                    <span>In Stock</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleResetFilters}
                    title="Reset all product filters"
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-[#0B3B24] bg-[#F2EFE7] hover:bg-[#E6E0D0] rounded-lg transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Product Cards Grid (2-column on mobile, 4-column on desktop) */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white border border-[#E6E0D0] rounded-2xl p-12 text-center space-y-3">
                  <SlidersHorizontal className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-lg font-bold text-[#14261C]">
                    No grocery products match your active filters
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    Try clearing your search query or adjusting the discount, price slider, or category filter.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 bg-[#0B3B24] text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-[#082B1A] transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {visibleProducts.map((product, idx) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        pastelIndex={idx}
                        quantityInCart={getCartQuantity(product.id)}
                        isWishlisted={wishlistIds.includes(product.id)}
                        onAddToCart={handleAddToCart}
                        onUpdateQuantity={handleUpdateQuantity}
                        onBuyNow={handleBuyNow}
                        onToggleWishlist={handleToggleWishlist}
                        onOpenDetail={() => handleOpenProductDetail(product.id)}
                      />
                    ))}
                  </div>

                  {/* Pagination / Load More Controls */}
                  {filteredProducts.length > visibleCount && (
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setVisibleCount((prev) => prev + 12)}
                        className="px-6 py-3 rounded-xl bg-[#0B3B24] hover:bg-[#082B1A] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                      >
                        <span>
                          Load More Groceries ({filteredProducts.length - visibleCount} remaining)
                        </span>
                        <ChevronDown className="w-4 h-4 text-[#D4AF37]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setVisibleCount(filteredProducts.length)}
                        className="px-5 py-3 rounded-xl bg-white hover:bg-[#F2EFE7] text-[#0B3B24] border border-[#D5DDD8] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                      >
                        Show All {filteredProducts.length} Products
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>

            {/* 5. POPULAR BRANDS SECTION */}
            <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-12 space-y-5">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#9A6F0B] mb-0.5">
                    Trusted Household Names
                  </div>
                  <h2
                    className="text-2xl font-bold text-[#082B1A] tracking-tight"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Popular Brands at Sri Lalitha Super Market
                  </h2>
                  <p className="text-sm text-slate-600 mt-0.5">
                    Click any brand below to filter products from that brand
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {POPULAR_BRANDS.map((b) => {
                  const isSelected = selectedBrand.toLowerCase() === b.name.toLowerCase();
                  return (
                    <button
                      key={b.name}
                      type="button"
                      onClick={() => {
                        setSelectedBrand(isSelected ? 'all' : b.name);
                        catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#0B3B24] bg-[#0B3B24] text-white'
                          : 'border-[#E6E0D0] bg-white hover:border-[#0B3B24]'
                      }`}
                    >
                      <div className="text-xs font-extrabold truncate">{b.name}</div>
                      <div
                        className={`text-[11px] truncate mt-0.5 ${
                          isSelected ? 'text-emerald-200' : 'text-slate-500'
                        }`}
                      >
                        {b.origin}
                      </div>
                      <div
                        className={`text-[11px] font-mono font-semibold mt-2 ${
                          isSelected ? 'text-[#D4AF37]' : 'text-[#9A6F0B]'
                        }`}
                      >
                        {b.discountText}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 6. CUSTOMER REVIEWS & VISSANNAPETA STORE CONTACT INFORMATION */}
            <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Customer Reviews (7 Columns) */}
                <div className="lg:col-span-7 bg-white border border-[#E6E0D0] rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="text-xs font-semibold text-[#9A6F0B] uppercase tracking-wider mb-1">
                      Verified Vissannapeta Families
                    </div>
                    <h2
                      className="text-2xl font-bold text-[#082B1A] tracking-tight"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      What Our Local Customers Say
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {CUSTOMER_REVIEWS.map((rev) => (
                      <blockquote
                        key={rev.id}
                        className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E6E0D0] space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-[#14261C]">
                              {rev.customerName}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="text-slate-500">{rev.area}</span>
                          </div>
                          <div className="flex items-center gap-0.5 text-[#C59B27]">
                            {Array.from({ length: rev.rating }).map((_, idx) => (
                              <Star
                                key={idx}
                                className="w-3.5 h-3.5 fill-[#C59B27] text-[#C59B27]"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          “{rev.comment}”
                        </p>
                        <div className="text-[11px] text-[#0B3B24] font-semibold">
                          Verified Purchase: {rev.purchasedItem}
                        </div>
                      </blockquote>
                    ))}
                  </div>
                </div>

                {/* Store Contact & Vissannapeta Dispatch Desk (5 Columns) */}
                <div className="lg:col-span-5 bg-[#082B1A] text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 border border-[#C59B27]/40">
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                      Store Location & Dispatch Desk
                    </div>
                    <h2
                      className="text-2xl font-bold tracking-tight"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Visit Sri Lalitha Super Market, Vissannapeta
                    </h2>
                    <p className="text-xs sm:text-sm text-[#D5E2DA] leading-relaxed">
                      Walk into our air-conditioned supermarket on Main Road or order online for same-hour home delivery across Vissannapeta and surrounding villages.
                    </p>
                  </div>

                  <div className="space-y-3.5 text-xs sm:text-sm border-y border-white/15 py-5">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                      <div>
                        <div className="font-bold text-white">Store Address</div>
                        <div className="text-[#D5E2DA]">
                          Main Road, Near RTC Bus Stand, Opposite SBI, Vissannapeta, NTR District, Andhra Pradesh – 521215
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                      <div>
                        <div className="font-bold text-white">Phone & WhatsApp Order Desk</div>
                        <div className="text-[#D5E2DA] font-mono">
                          +91 98480 52121 · +91 8673 272145
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                      <div>
                        <div className="font-bold text-white">Store & Delivery Hours</div>
                        <div className="text-[#D5E2DA]">
                          Open Every Day: 7:00 AM – 9:30 PM
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-[#D5E2DA]">
                      Serviceable Areas:{' '}
                      <strong className="text-white">
                        Vissannapeta, Putrela, Chatrai Rd, Nuzvid Rd
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCartOpen(true)}
                      className="px-4 py-2.5 bg-[#C59B27] hover:bg-[#b0891f] text-[#082B1A] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Open Shopping Cart ({cartTotals.totalItemsCount})
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. NEWSLETTER SUBSCRIPTION SECTION */}
            <section className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-12">
              <div className="bg-[#EFECE3] border border-[#D4AF37]/40 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-1.5 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9A6F0B]">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Vissannapeta Weekly Wholesale Alerts</span>
                  </div>
                  <h2
                    className="text-xl sm:text-2xl font-bold text-[#082B1A]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Subscribe for Festival Deals & New Harvest Arrivals
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Receive weekly Sona Masoori rice mill rates, oil price drops, and festival combo offers directly on your phone or email.
                  </p>
                </div>

                <div className="w-full lg:w-auto flex-1 max-w-md">
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      value={newsletterContact}
                      onChange={(e) => setNewsletterContact(e.target.value)}
                      placeholder="Enter mobile number or email..."
                      aria-label="Mobile number or email for newsletter"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#D5DDD8] text-xs sm:text-sm text-[#14261C] focus:outline-none focus:border-[#0B3B24]"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#0B3B24] hover:bg-[#082B1A] text-white text-xs sm:text-sm font-bold transition-colors shrink-0 cursor-pointer"
                    >
                      Subscribe
                    </button>
                  </form>
                  {newsletterFeedback && (
                    <p className="text-xs font-medium text-[#0B3B24] mt-2">
                      {newsletterFeedback}
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        products={DEMO_PRODUCTS}
        totals={cartTotals}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={() => setCartItems([])}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setActiveView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Customer Account Modal */}
      <AccountModal
        isOpen={accountModalState.isOpen}
        initialTab={accountModalState.tab}
        onClose={() => setAccountModalState((prev) => ({ ...prev, isOpen: false }))}
        customer={customer}
        onUpdateCustomer={setCustomer}
        ordersCount={orders.length}
        wishlistCount={wishlistIds.length}
        onNavigateToOrders={() => {
          setAccountModalState((prev) => ({ ...prev, isOpen: false }));
          setActiveView('my-orders');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToWishlist={() => {
          setAccountModalState((prev) => ({ ...prev, isOpen: false }));
          setActiveView('wishlist');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSelectedSubcategory('all');
          setActiveView('home');
          setTimeout(() => {
            catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 60);
        }}
        onNavigateHome={() => {
          setActiveView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateOrders={() => {
          setActiveView('my-orders');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateWishlist={() => {
          setActiveView('wishlist');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
