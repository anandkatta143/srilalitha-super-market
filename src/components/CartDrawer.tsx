import React from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
} from 'lucide-react';
import { CartItem, CartTotals, Product } from '../types/store';
import { getCategoryFallbackImage } from '../utils/storeLogic';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  products: Product[];
  totals: CartTotals;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  products,
  totals,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const detailedItems = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter((x): x is { productId: string; quantity: number; product: Product } => x !== null);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      <div className="w-full max-w-md bg-white h-full flex flex-col justify-between shadow-2xl border-l border-slate-200">
        {/* Top Bar */}
        <div>
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 id="cart-drawer-title" className="text-lg font-bold text-slate-900">
                Your Shopping Cart ({totals.totalItemsCount})
              </h2>
              <p className="text-xs text-slate-500">
                Sri Lalitha Super Market · Vissannapeta Delivery
              </p>
            </div>
            <div className="flex items-center gap-2">
              {detailedItems.length > 0 && (
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-xs font-medium text-slate-500 hover:text-red-600 px-2 py-1 rounded transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Shopping Cart"
                className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Free Delivery Threshold Banner */}
          {detailedItems.length > 0 && (
            <div className="px-6 py-3 bg-emerald-50/90 border-b border-emerald-200/70 flex items-center gap-3 text-xs text-emerald-950">
              <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
              {totals.amountForFreeDelivery === 0 ? (
                <span>
                  <strong>Free Vissannapeta Doorstep Delivery</strong> unlocked on your order!
                </span>
              ) : (
                <span>
                  Add{' '}
                  <strong className="font-mono tabular-nums">
                    ₹{totals.amountForFreeDelivery}
                  </strong>{' '}
                  more for <strong>FREE Delivery</strong> (Orders ₹{totals.freeDeliveryThreshold}+)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Cart Items Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-200/80">
          {detailedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Your grocery basket is empty
              </h3>
              <p className="text-sm text-slate-500 max-w-xs mb-6">
                Explore Sona Masoori rice, dals, cooking oils, spices, and fresh Vissannapeta produce.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-emerald-800 text-white text-sm font-semibold rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            detailedItems.map(({ product, quantity }) => (
              <div key={product.id} className="py-4 flex items-start gap-3.5">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const fallback = getCategoryFallbackImage(product.category);
                    if (e.currentTarget.src !== fallback) {
                      e.currentTarget.src = fallback;
                    }
                  }}
                  className="w-16 h-16 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
                      {product.name}
                    </h4>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(product.id)}
                      aria-label={`Remove ${product.name} from cart`}
                      className="text-slate-400 hover:text-red-600 p-1 transition-colors shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {product.brand} · {product.weight}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="inline-flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        aria-label={`Decrease cart quantity of ${product.name}`}
                        className="w-7 h-7 rounded-md bg-white text-slate-700 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold font-mono tabular-nums text-slate-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        aria-label={`Increase cart quantity of ${product.name}`}
                        className="w-7 h-7 rounded-md bg-emerald-800 text-white hover:bg-emerald-900 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold font-mono tabular-nums text-slate-900">
                        ₹{(product.discountPrice * quantity).toLocaleString('en-IN')}
                      </div>
                      {product.originalPrice > product.discountPrice && (
                        <div className="text-xs font-mono tabular-nums text-slate-400 line-through">
                          ₹{(product.originalPrice * quantity).toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer Summary & Checkout Button */}
        {detailedItems.length > 0 && (
          <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Total MRP ({totals.totalItemsCount} items)</span>
                <span className="font-mono tabular-nums">
                  ₹{totals.totalOriginalPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Store Discount Savings</span>
                <span className="font-mono tabular-nums">
                  -₹{totals.totalSavings.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums font-semibold">
                  ₹{totals.subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges (Vissannapeta)</span>
                <span className="font-mono tabular-nums">
                  {totals.deliveryCharge === 0 ? (
                    <span className="text-emerald-700 font-semibold">FREE (₹0)</span>
                  ) : (
                    `₹${totals.deliveryCharge}`
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-bold text-slate-900">
                <span>Grand Total</span>
                <span className="font-mono tabular-nums text-emerald-900">
                  ₹{totals.grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
