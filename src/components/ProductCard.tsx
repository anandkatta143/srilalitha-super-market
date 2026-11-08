import React, { useEffect, useState } from 'react';
import { Heart, Plus, Minus, ShoppingBag, Zap, Star } from 'lucide-react';
import { Product } from '../types/store';
import { calculateDiscountPercentage, getCategoryFallbackImage } from '../utils/storeLogic';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  isWishlisted: boolean;
  onAddToCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onBuyNow: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
  onOpenDetail?: () => void;
  compact?: boolean;
  pastelIndex?: number;
}

const SOFT_PASTEL_STAGES = [
  'bg-[#EAF3EC]', // Soft Mint Sage
  'bg-[#F7EFE6]', // Soft Warm Peach / Beige
  'bg-[#F5F0DE]', // Soft Butter Cream
  'bg-[#EFEBF4]', // Soft Lavender Mist
  'bg-[#F6ECEA]', // Soft Blush Sand
];

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  isWishlisted,
  onAddToCart,
  onUpdateQuantity,
  onBuyNow,
  onToggleWishlist,
  onOpenDetail,
  compact = false,
  pastelIndex = 0,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [useFallbackImage, setUseFallbackImage] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fallbackImageUrl = getCategoryFallbackImage(product.category);
  const activeImageSrc = useFallbackImage ? fallbackImageUrl : product.image;

  useEffect(() => {
    setIsImageLoaded(false);
    setUseFallbackImage(false);
    setImageError(false);
  }, [product.id, product.image]);

  const discountPercent = calculateDiscountPercentage(
    product.originalPrice,
    product.discountPrice
  );
  const savingsAmount = product.originalPrice - product.discountPrice;

  // Deterministic soft pastel background for the upper product stage
  const charSum = product.id
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), pastelIndex);
  const pastelStageClass = SOFT_PASTEL_STAGES[charSum % SOFT_PASTEL_STAGES.length];

  const handleImageError = () => {
    if (!useFallbackImage && fallbackImageUrl && fallbackImageUrl !== product.image) {
      setUseFallbackImage(true);
      setIsImageLoaded(false);
    } else {
      setImageError(true);
      setIsImageLoaded(true);
    }
  };

  return (
    <article
      className={`group bg-white border border-[#E6E0D2] rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[#C59B27]/60 ${
        compact ? 'w-[236px] sm:w-[264px] shrink-0 snap-start' : 'w-full'
      }`}
      data-testid={`product-card-${product.id}`}
    >
      <div>
        {/* Product Image Container with Soft Pastel Stage (Nature's Basket style) */}
        <div
          className={`relative aspect-4/3 ${pastelStageClass} p-2.5 overflow-hidden border-b border-[#EDE8DC]`}
        >
          <button
            type="button"
            onClick={onOpenDetail}
            aria-label={`View details for ${product.name}`}
            className="relative w-full h-full block text-left rounded-lg overflow-hidden bg-white shadow-2xs cursor-pointer"
          >
            {!isImageLoaded && !imageError && (
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-[#F4EFE4] via-[#FAF7F0] to-[#F4EFE4] animate-pulse flex items-center justify-center"
              >
                <ShoppingBag className="w-6 h-6 text-[#0B3B24]/25" />
              </div>
            )}
            {!imageError ? (
              <img
                src={activeImageSrc}
                alt={`${product.name} - ${product.weight}`}
                referrerPolicy="no-referrer"
                loading="lazy"
                onLoad={() => setIsImageLoaded(true)}
                onError={handleImageError}
                className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#EBF3EE] to-[#FAF7F0] text-[#0B3B24]">
                <ShoppingBag className="w-9 h-9 text-[#0B3B24] mb-1.5 opacity-80" />
                <span className="text-xs font-semibold text-center line-clamp-2">
                  {product.name}
                </span>
              </div>
            )}
          </button>

          {/* Top-right Wishlist Button */}
          <button
            type="button"
            onClick={() => onToggleWishlist(product.id)}
            aria-label={
              isWishlisted
                ? `Remove ${product.name} from Wishlist`
                : `Add ${product.name} to Wishlist`
            }
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs border border-[#E6E0D2] flex items-center justify-center text-slate-600 hover:text-[#9A6F0B] transition-colors shadow-2xs cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted ? 'fill-[#C59B27] text-[#C59B27]' : ''
              }`}
            />
          </button>

          {/* Subtle single text discount marker on image bottom-left */}
          {discountPercent > 0 && (
            <div className="absolute bottom-4 left-4 bg-[#0B3B24]/95 backdrop-blur-xs text-[#F5E6C4] px-2.5 py-0.5 rounded text-[11px] font-mono tabular-nums font-semibold pointer-events-none">
              {discountPercent}% OFF · Save ₹{savingsAmount}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-3.5 sm:p-4">
          {/* Unboxed Clean Single-Line Metadata: Brand · Weight/Quantity */}
          <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 mb-1.5">
            <div className="min-w-0 flex-1 flex items-center gap-1.5 overflow-hidden">
              <span className="font-bold text-[#0B3B24] uppercase tracking-wider shrink-0">
                {product.brand}
              </span>
              <span aria-hidden="true" className="shrink-0">
                ·
              </span>
              <span className="font-semibold text-[#6E5D46] truncate">
                {product.weight}
              </span>
            </div>
            <span className="inline-flex items-center gap-0.5 font-medium text-slate-700 shrink-0">
              <Star className="w-3 h-3 fill-[#C59B27] text-[#C59B27]" />
              <span className="tabular-nums text-[11px]">{product.rating.toFixed(1)}</span>
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-sm sm:text-[15px] font-semibold text-[#14261C] leading-snug line-clamp-2 h-[2.6rem] mb-2">
            <button
              type="button"
              onClick={onOpenDetail}
              className="text-left hover:text-[#0B3B24] transition-colors line-clamp-2 cursor-pointer"
            >
              {product.name}
            </button>
          </h3>

          {/* Stock & Demo Status Line */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2.5 pt-2 border-t border-[#F0ECE1]">
            <span
              className={
                product.inStock
                  ? 'text-[#0B3B24] font-medium'
                  : 'text-red-600 font-medium'
              }
            >
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
            <span className="text-slate-400">Demo Sample</span>
          </div>

          {/* Pricing Row: Selling Price + MRP + Discount */}
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-extrabold font-mono tabular-nums text-[#082B1A]">
                ₹{product.discountPrice.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.discountPrice && (
                <span className="text-xs font-mono tabular-nums text-slate-400 line-through">
                  MRP ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[11px] font-bold text-[#9A6F0B] font-mono tabular-nums">
                {discountPercent}% Off
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons: Forest Green Add to Cart / Quantity Stepper + Buy Now */}
      <div className="px-3.5 sm:px-4 pb-3.5 sm:pb-4 pt-1 flex items-center gap-2">
        {quantityInCart === 0 ? (
          <button
            type="button"
            disabled={!product.inStock}
            onClick={() => onAddToCart(product.id)}
            aria-label={`Add ${product.name} to Cart`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold bg-[#0B3B24] text-white hover:bg-[#082B1A] disabled:bg-slate-200 disabled:text-slate-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Add to Cart</span>
          </button>
        ) : (
          <div
            className="flex-1 flex items-center justify-between bg-[#EBF3EE] border border-[#0B3B24]/30 rounded-lg px-2 py-1"
            aria-label={`Quantity in cart for ${product.name}`}
          >
            <button
              type="button"
              onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
              aria-label={`Decrease quantity of ${product.name}`}
              className="w-7 h-7 rounded-md bg-white text-[#0B3B24] hover:bg-emerald-100 flex items-center justify-center font-bold transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-bold font-mono tabular-nums text-[#0B3B24] px-2">
              {quantityInCart}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(product.id, quantityInCart + 1)}
              aria-label={`Increase quantity of ${product.name}`}
              className="w-7 h-7 rounded-md bg-[#0B3B24] text-white hover:bg-[#082B1A] flex items-center justify-center font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <button
          type="button"
          disabled={!product.inStock}
          onClick={() => onBuyNow(product.id)}
          aria-label={`Buy Now ${product.name}`}
          className="inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-lg text-xs font-semibold text-[#14261C] bg-[#F5E6C4] border border-[#D4AF37]/60 hover:bg-[#C59B27] hover:text-slate-950 disabled:opacity-40 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 shrink-0" />
          <span>Buy</span>
        </button>
      </div>
    </article>
  );
};
