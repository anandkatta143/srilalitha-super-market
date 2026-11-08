import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Product } from '../types/store';
import { ProductCard } from './ProductCard';

interface HorizontalProductRowProps {
  id: string;
  title: string;
  eyebrow: string;
  subtitle: string;
  products: Product[];
  accentBg?: string;
  getCartQuantity: (productId: string) => number;
  wishlistIds: string[];
  onAddToCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onBuyNow: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
  onOpenProductDetail: (productId: string) => void;
  onViewAll: () => void;
}

export const HorizontalProductRow: React.FC<HorizontalProductRowProps> = ({
  id,
  title,
  eyebrow,
  subtitle,
  products,
  accentBg = '#FAF7F0',
  getCartQuantity,
  wishlistIds,
  onAddToCart,
  onUpdateQuantity,
  onBuyNow,
  onToggleWishlist,
  onOpenProductDetail,
  onViewAll,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -560 : 560;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (products.length === 0) return null;

  return (
    <section
      id={`aisle-${id}`}
      data-testid={`aisle-row-${id}`}
      style={{ backgroundColor: accentBg }}
      className="py-6 sm:py-8 border-b border-[#E8E2D4]/80"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-4">
        {/* Aisle Header Bar: Title on Left, View All + Prev/Next Arrows on Right */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#9A6F0B] mb-0.5">
              {eyebrow}
            </div>
            <h2
              className="text-xl sm:text-2xl font-bold text-[#082B1A] tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{subtitle}</p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onViewAll}
              aria-label={`View all in ${title}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-[#0B3B24] text-[#0B3B24] hover:text-white border border-[#D4CEBE] text-xs font-bold transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                aria-label={`Scroll ${title} left`}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-[#0B3B24] text-[#082B1A] hover:text-white border border-[#D4CEBE] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                aria-label={`Scroll ${title} right`}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-[#0B3B24] text-[#082B1A] hover:text-white border border-[#D4CEBE] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrolling Product Cards Track */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 pt-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product, index) => (
            <ProductCard
              key={`${id}-${product.id}`}
              product={product}
              compact={true}
              pastelIndex={index}
              quantityInCart={getCartQuantity(product.id)}
              isWishlisted={wishlistIds.includes(product.id)}
              onAddToCart={onAddToCart}
              onUpdateQuantity={onUpdateQuantity}
              onBuyNow={onBuyNow}
              onToggleWishlist={onToggleWishlist}
              onOpenDetail={() => onOpenProductDetail(product.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
