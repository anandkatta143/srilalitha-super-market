import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Plus,
  Minus,
  Zap,
  Star,
  Truck,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  MapPin,
} from 'lucide-react';
import { Category, Product } from '../types/store';
import { calculateDiscountPercentage, getCategoryFallbackImage } from '../utils/storeLogic';
import { ProductCard } from './ProductCard';

interface ProductDetailViewProps {
  product: Product;
  category?: Category;
  relatedProducts: Product[];
  quantityInCart: number;
  isWishlisted: boolean;
  getCartQuantity: (productId: string) => number;
  wishlistIds: string[];
  onBack: () => void;
  onSelectCategory: () => void;
  onAddToCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onBuyNow: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  category,
  relatedProducts,
  quantityInCart,
  isWishlisted,
  getCartQuantity,
  wishlistIds,
  onBack,
  onSelectCategory,
  onAddToCart,
  onUpdateQuantity,
  onBuyNow,
  onToggleWishlist,
  onSelectProduct,
}) => {
  const fallbackImage = getCategoryFallbackImage(product.category);
  const gallery =
    product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const [selectedImage, setSelectedImage] = useState<string>(gallery[0]);
  const [isMainImageLoaded, setIsMainImageLoaded] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  useEffect(() => {
    const nextGallery =
      product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
    setSelectedImage(nextGallery[0]);
    setIsMainImageLoaded(false);
    setIsZoomed(false);
  }, [product.id, product.image, product.gallery]);

  const discountPercent = calculateDiscountPercentage(
    product.originalPrice,
    product.discountPrice
  );
  const savings = product.originalPrice - product.discountPrice;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomOrigin({ x, y });
  };

  return (
    <section
      className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-12"
      data-testid="product-detail-view"
    >
      {/* Breadcrumb & Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 font-semibold text-[#0B3B24] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Storefront</span>
          </button>
          <span aria-hidden="true">/</span>
          {category && (
            <>
              <button
                type="button"
                onClick={onSelectCategory}
                className="hover:text-[#0B3B24] hover:underline cursor-pointer"
              >
                {category.code}. {category.name}
              </button>
              <span aria-hidden="true">/</span>
            </>
          )}
          {product.subcategory && (
            <>
              <span className="text-slate-500">{product.subcategory}</span>
              <span aria-hidden="true">/</span>
            </>
          )}
          <span className="text-slate-900 font-medium truncate max-w-xs">
            {product.name}
          </span>
        </div>

        <span className="text-xs text-slate-500">
          Sample Product Record · Editable via Future Admin Panel
        </span>
      </div>

      {/* Contiguous Purchase Module (Sticky Gallery Left + Sticky Purchase Module Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery & Interactive Zoom */}
        <div className="lg:col-span-6 space-y-4">
          <div
            onMouseMove={handleMouseMove}
            onClick={() => setIsZoomed((z) => !z)}
            className="relative aspect-4/3 rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-xs cursor-zoom-in"
          >
            {!isMainImageLoaded && (
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-[#F4EFE4] via-[#FAF7F0] to-[#F4EFE4] animate-pulse"
              />
            )}
            <img
              src={selectedImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              onLoad={() => setIsMainImageLoaded(true)}
              onError={() => {
                if (selectedImage !== fallbackImage) {
                  setSelectedImage(fallbackImage);
                }
                setIsMainImageLoaded(true);
              }}
              style={
                isZoomed
                  ? {
                      transform: 'scale(1.85)',
                      transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                    }
                  : undefined
              }
              className="w-full h-full object-cover transition-transform duration-200"
            />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed((z) => !z);
              }}
              aria-label={isZoomed ? 'Disable Image Zoom' : 'Enable Image Zoom'}
              className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/85 text-white text-xs font-medium backdrop-blur-xs hover:bg-slate-900 transition-colors cursor-pointer"
            >
              {isZoomed ? (
                <>
                  <ZoomOut className="w-3.5 h-3.5" />
                  <span>Reset Zoom</span>
                </>
              ) : (
                <>
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Click to Zoom</span>
                </>
              )}
            </button>

            {discountPercent > 0 && (
              <div className="absolute top-3 left-3 bg-[#0B3B24] text-[#F5E6C4] px-3 py-1 rounded-md text-xs font-mono tabular-nums font-semibold">
                {discountPercent}% OFF · Save ₹{savings}
              </div>
            )}
          </div>

          {/* Thumbnail Switcher */}
          {gallery.length > 1 && (
            <div className="flex items-center gap-3">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedImage(imgUrl);
                    setIsZoomed(false);
                  }}
                  aria-label={`View product angle ${idx + 1}`}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage === imgUrl
                      ? 'border-[#0B3B24] ring-2 ring-[#0B3B24]/20'
                      : 'border-slate-200 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} view ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          {/* Unboxed Metadata Line */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-bold text-[#0B3B24] uppercase tracking-wider">
                {product.brand}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-slate-700">Pack Size: {product.weight}</span>
              <span aria-hidden="true">·</span>
              <span
                className={
                  product.inStock
                    ? 'text-emerald-700 font-semibold'
                    : 'text-red-600 font-semibold'
                }
              >
                {product.inStock ? `In Stock (${product.stockCount} units)` : 'Out of Stock'}
              </span>
            </div>

            <span className="inline-flex items-center gap-1 font-medium text-slate-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span className="tabular-nums font-bold">{product.rating.toFixed(1)}</span>
              <span className="text-slate-400">({product.reviewsCount} reviews)</span>
            </span>
          </div>

          {/* Product Title */}
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
            {product.name}
          </h1>

          {/* Pricing Box */}
          <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E6DFCE] flex flex-wrap items-baseline justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-[#0B3B24]">
                  ₹{product.discountPrice.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.discountPrice && (
                  <span className="text-sm font-mono tabular-nums text-slate-400 line-through">
                    MRP ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Inclusive of all taxes · Direct Sri Lalitha Super Market Wholesale Price
              </p>
            </div>

            {discountPercent > 0 && (
              <div className="text-right">
                <span className="text-sm font-bold text-[#9A6F0B] font-mono tabular-nums">
                  You Save ₹{savings} ({discountPercent}% OFF)
                </span>
              </div>
            )}
          </div>

          {/* Description & Specifications */}
          <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <p>{product.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70">
                <div className="text-slate-400">Pack / Weight</div>
                <div className="font-semibold text-slate-900 mt-0.5">{product.weight}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70">
                <div className="text-slate-400">Sourcing / Origin</div>
                <div className="font-semibold text-slate-900 mt-0.5">
                  {product.origin || 'Vissannapeta Store Select'}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70">
                <div className="text-slate-400">Shelf Life</div>
                <div className="font-semibold text-slate-900 mt-0.5">
                  {product.shelfLife || 'Fresh Batch'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Row: Add to Cart / Quantity Stepper + Buy Now + Wishlist */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {quantityInCart === 0 ? (
              <button
                type="button"
                disabled={!product.inStock}
                onClick={() => onAddToCart(product.id)}
                className="flex-1 min-w-[160px] py-3.5 px-6 rounded-xl bg-[#0B3B24] hover:bg-[#082B1A] text-white font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            ) : (
              <div className="flex-1 min-w-[160px] flex items-center justify-between bg-emerald-50 border border-[#0B3B24]/30 rounded-xl px-4 py-2">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
                  aria-label="Decrease quantity"
                  className="w-9 h-9 rounded-lg bg-white text-[#0B3B24] hover:bg-emerald-100 flex items-center justify-center font-bold cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-base font-bold font-mono tabular-nums text-[#0B3B24]">
                  {quantityInCart} in Cart
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(product.id, quantityInCart + 1)}
                  aria-label="Increase quantity"
                  className="w-9 h-9 rounded-lg bg-[#0B3B24] text-white hover:bg-[#082B1A] flex items-center justify-center font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              type="button"
              disabled={!product.inStock}
              onClick={() => onBuyNow(product.id)}
              className="py-3.5 px-6 rounded-xl bg-[#C59B27] hover:bg-[#B0891E] text-slate-950 font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Buy Now</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleWishlist(product.id)}
              aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-[#C59B27] text-slate-700 hover:text-[#9A6F0B] transition-colors cursor-pointer"
            >
              <Heart
                className={`w-5 h-5 ${
                  isWishlisted ? 'fill-[#C59B27] text-[#C59B27]' : ''
                }`}
              />
            </button>
          </div>

          {/* Vissannapeta Delivery Promise */}
          <div className="pt-4 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#0B3B24] shrink-0" />
              <span>35–45 Min Delivery in Vissannapeta (521215)</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#9A6F0B] shrink-0" />
              <span>Shop Staff & Express Partner Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0B3B24] shrink-0" />
              <span>100% Fresh Quality & Doorstep Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products in Category */}
      {relatedProducts.length > 0 && (
        <div className="space-y-5 pt-6 border-t border-slate-200">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            More in {category?.name || 'This Department'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                quantityInCart={getCartQuantity(rel.id)}
                isWishlisted={wishlistIds.includes(rel.id)}
                onAddToCart={onAddToCart}
                onUpdateQuantity={onUpdateQuantity}
                onBuyNow={onBuyNow}
                onToggleWishlist={onToggleWishlist}
                onOpenDetail={() => onSelectProduct(rel)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
