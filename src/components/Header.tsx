import React, { useState } from 'react';
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  MapPin,
  X,
  Package,
} from 'lucide-react';
import { ActiveView, CollectionFilter, CustomerProfile } from '../types/store';
import { SearchSuggestion } from '../utils/storeLogic';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  suggestions: SearchSuggestion[];
  onSelectSuggestion: (suggestion: SearchSuggestion) => void;
  cartCount: number;
  cartSubtotal: number;
  wishlistCount: number;
  onOpenCart: () => void;
  customer: CustomerProfile;
  onOpenAccount: (tab?: 'profile' | 'login' | 'addresses' | 'orders') => void;
  onSelectCollection: (collection: CollectionFilter) => void;
  onScrollToCategories: () => void;
  onJumpToAisle?: (aisleId: string) => void;
}

const QUICK_AISLE_PILLS = [
  { id: 'trending-neighbourhood', label: 'Trending in Vissannapeta' },
  { id: 'curated-snacks', label: 'Curated Snacks' },
  { id: 'daily-essentials', label: 'Daily Essentials' },
  { id: 'fresh-from-farm', label: 'Fresh From The Farm' },
  { id: 'fruits-vegetables-aisle', label: 'Fruits & Vegetables' },
  { id: 'farm-creamery', label: 'Farm & Creamery' },
  { id: 'cheese-collection', label: 'The Cheese Collection' },
  { id: 'chocolates-treats', label: 'Chocolates & Treats' },
  { id: 'global-pantry', label: 'Global Pantry' },
  { id: 'health-wellness-aisle', label: 'Health & Wellness' },
  { id: 'bakery-breakfast', label: 'Bakery & Breakfast' },
  { id: 'cooking-essentials', label: 'Cooking Essentials' },
  { id: 'dry-fruits-aisle', label: 'Dry Fruits & Nuts' },
];

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  searchQuery,
  onSearchChange,
  suggestions,
  onSelectSuggestion,
  cartCount,
  cartSubtotal,
  wishlistCount,
  onOpenCart,
  customer,
  onOpenAccount,
  onSelectCollection,
  onScrollToCategories,
  onJumpToAisle,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onSearchChange(val);
    if (activeView !== 'home' && activeView !== 'catalog') {
      setActiveView('home');
    }
  };

  return (
    <>
      {/* Strict 3-Zone Top Bar Contract (Slim sticky bar: ~54px, well under 15% mobile viewport cap) */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5DEC9]">
        <header className="max-w-[1280px] mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 py-2.5">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('home');
            }}
            className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#0B3B24] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#0B3B24] rounded"
          >
            Sri Lalitha Super Market
          </a>

          {/* Zone 2: 5 concise single-line text navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700"
          >
            <a
              href="#aisle-trending-neighbourhood"
              onClick={(e) => {
                e.preventDefault();
                setActiveView('home');
                onJumpToAisle?.('trending-neighbourhood');
              }}
              className={`hover:text-[#0B3B24] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'home' ? 'text-[#0B3B24] font-semibold' : ''
              }`}
            >
              Curated Aisles
            </a>
            <a
              href="#special-offers"
              onClick={(e) => {
                e.preventDefault();
                onSelectCollection('special-offer');
                setActiveView('home');
              }}
              className="hover:text-[#0B3B24] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Special Offers
            </a>
            <a
              href="#categories"
              onClick={(e) => {
                e.preventDefault();
                setActiveView('home');
                setTimeout(onScrollToCategories, 50);
              }}
              className="hover:text-[#0B3B24] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              31 Categories
            </a>
            <a
              href="#my-orders"
              onClick={(e) => {
                e.preventDefault();
                setActiveView('my-orders');
              }}
              className={`hover:text-[#0B3B24] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'my-orders' ? 'text-[#0B3B24] font-semibold' : ''
              }`}
            >
              My Orders
            </a>
            <a
              href="#my-account"
              onClick={(e) => {
                e.preventDefault();
                onOpenAccount('profile');
              }}
              className={`hover:text-[#0B3B24] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'account' ? 'text-[#0B3B24] font-semibold' : ''
              }`}
            >
              My Account
            </a>
          </nav>

          {/* Zone 3: Green Shopping Cart Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Open Shopping Cart with ${cartCount} items, subtotal ₹${cartSubtotal}`}
              className="inline-flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#0B3B24] hover:bg-[#082B1A] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 shrink-0 text-[#D4AF37]" />
              <span>Cart ({cartCount})</span>
              {cartSubtotal > 0 && (
                <span className="font-mono tabular-nums text-[#F5E6C4]">
                  · ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              )}
            </button>
          </div>
        </header>
      </div>

      {/* Storefront Search, Location, Login & Quick Aisle Navigation Bar */}
      <div className="bg-[#F3EFE6] border-b border-[#E2DEC9]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-2.5 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Location Indicator: Vissannapeta */}
            <button
              type="button"
              onClick={() => onOpenAccount('addresses')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-700 hover:text-[#0B3B24] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Change delivery address in Vissannapeta"
            >
              <MapPin className="w-4 h-4 text-[#9A6F0B] shrink-0" />
              <span className="font-semibold text-[#082B1A]">Vissannapeta, AP</span>
              <span className="text-slate-400 hidden sm:inline" aria-hidden="true">
                ·
              </span>
              <span className="text-slate-600 hidden sm:inline">
                Doorstep Delivery in 45 Mins
              </span>
            </button>

            {/* Large Search Products Bar with Live Suggestions Dropdown */}
            <div className="flex-1 min-w-[220px] max-w-xl relative">
              <label htmlFor="global-product-search" className="sr-only">
                Search groceries by product name, brand, or category
              </label>
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="global-product-search"
                type="search"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 180)}
                onChange={handleSearchInput}
                placeholder="Search 31 departments: Sona Masoori rice, cheese, Palasa cashews, Freedom oil..."
                className="w-full pl-9 pr-9 py-1.5 bg-white border border-[#D6D0C0] rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0B3B24] focus:ring-2 focus:ring-[#0B3B24]/15 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search query"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Live Search Suggestions Dropdown */}
              {isSearchFocused && suggestions.length > 0 && (
                <div
                  role="listbox"
                  aria-label="Search Suggestions"
                  className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100"
                >
                  {suggestions.map((s) => (
                    <button
                      key={`${s.type}-${s.id}`}
                      type="button"
                      onMouseDown={() => onSelectSuggestion(s)}
                      className="w-full px-4 py-2.5 text-left hover:bg-[#FAF7F0] flex items-center justify-between gap-3 transition-colors cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {s.label}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {s.type === 'category'
                            ? `Department · ${s.sublabel}`
                            : s.sublabel}
                        </div>
                      </div>
                      {s.price !== undefined ? (
                        <span className="text-xs font-mono font-bold text-[#0B3B24] shrink-0">
                          ₹{s.price}
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-[#9A6F0B] shrink-0">
                          Explore →
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Customer Actions: Wishlist, My Orders (mobile), Login / Signup / My Account */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setActiveView('wishlist')}
                aria-label={`View Wishlist (${wishlistCount} saved items)`}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeView === 'wishlist'
                    ? 'bg-[#0B3B24] text-white'
                    : 'text-slate-700 hover:text-[#0B3B24] hover:bg-emerald-100/60'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    wishlistCount > 0 && activeView !== 'wishlist'
                      ? 'fill-[#C59B27] text-[#C59B27]'
                      : ''
                  }`}
                />
                <span>Wishlist ({wishlistCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('my-orders')}
                className="md:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-700 hover:text-[#0B3B24] hover:bg-emerald-100/60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Package className="w-4 h-4 text-[#0B3B24]" />
                <span>Orders</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenAccount(customer.isLoggedIn ? 'profile' : 'login')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold text-[#082B1A] bg-white border border-[#D6D0C0] hover:border-[#0B3B24] hover:text-[#0B3B24] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <User className="w-4 h-4 text-[#0B3B24] shrink-0" />
                <span>
                  {customer.isLoggedIn
                    ? `Hi, ${customer.name.split(' ')[0]}`
                    : 'Login'}
                </span>
              </button>
            </div>
          </div>

          {/* Quick-Jump Horizontal Aisle Ribbon (Nature's Basket Style Category Navigation) */}
          <div
            aria-label="Quick Aisle Navigation"
            className="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5 border-t border-[#E4DFD0] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9A6F0B] shrink-0 mr-1">
              Aisles:
            </span>
            {QUICK_AISLE_PILLS.map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => {
                  setActiveView('home');
                  onJumpToAisle?.(pill.id);
                }}
                className="px-2.5 py-1 rounded-md bg-white/80 hover:bg-[#0B3B24] text-[#14261C] hover:text-white border border-[#DFD9C8] text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
