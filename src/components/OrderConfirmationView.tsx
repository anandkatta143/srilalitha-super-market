import React, { useState } from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Phone,
  Clock,
  ShoppingBag,
  Search,
  ChevronRight,
} from 'lucide-react';
import { Order, OrderStatus } from '../types/store';

interface OrderConfirmationViewProps {
  latestOrder: Order | null;
  orders: Order[];
  mode: 'confirmation' | 'my-orders';
  onContinueShopping: () => void;
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  onReorder: (order: Order) => void;
}

const ORDER_STEPS: OrderStatus[] = [
  'Confirmed',
  'Packed at Vissannapeta Store',
  'Out for Delivery',
  'Delivered',
];

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({
  latestOrder,
  orders,
  mode,
  onContinueShopping,
  onUpdateOrderStatus,
  onReorder,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    latestOrder?.orderId || orders[0]?.orderId || ''
  );
  const [trackingSearch, setTrackingSearch] = useState('');

  const activeOrder =
    orders.find((o) => o.orderId === selectedOrderId) || latestOrder || orders[0] || null;

  const filteredOrders = trackingSearch.trim()
    ? orders.filter(
        (o) =>
          o.orderId.toLowerCase().includes(trackingSearch.toLowerCase()) ||
          o.address.customerName.toLowerCase().includes(trackingSearch.toLowerCase())
      )
    : orders;

  if (!activeOrder || orders.length === 0) {
    return (
      <section className="max-w-[960px] mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">No Orders Yet</h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
          You have not placed any grocery orders yet. Browse our Vissannapeta store catalog to place your first doorstep order!
        </p>
        <button
          type="button"
          onClick={onContinueShopping}
          className="px-5 py-2.5 bg-emerald-800 text-white text-sm font-semibold rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
        >
          Shop Groceries Now
        </button>
      </section>
    );
  }

  const currentStepIndex = ORDER_STEPS.indexOf(activeOrder.status);

  const handleAdvanceStatus = () => {
    const nextIdx = (currentStepIndex + 1) % ORDER_STEPS.length;
    onUpdateOrderStatus(activeOrder.orderId, ORDER_STEPS[nextIdx]);
  };

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Confirmation Banner when arriving right after checkout */}
      {mode === 'confirmation' && latestOrder && (
        <div
          className="bg-emerald-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md"
          data-testid="order-confirmation-banner"
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Order Confirmed · Sri Lalitha Super Market, Vissannapeta</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Thank you, {latestOrder.address.customerName}! Your groceries are being packed.
            </h1>
            <p className="text-sm text-emerald-100">
              Order ID:{' '}
              <strong className="font-mono tabular-nums text-white">
                {latestOrder.orderId}
              </strong>{' '}
              · Estimated Arrival: <strong>{latestOrder.estimatedDelivery}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onContinueShopping}
              className="px-4 py-2.5 bg-white text-emerald-950 text-xs sm:text-sm font-bold rounded-lg hover:bg-emerald-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Main Orders & Live Order Tracking Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar: My Orders List & Order ID Search */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              My Orders ({orders.length})
            </h2>
            <span className="text-xs text-slate-500">Track & Reorder</span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={trackingSearch}
              onChange={(e) => setTrackingSearch(e.target.value)}
              placeholder="Track by Order ID (e.g. SLSM-VSP)..."
              aria-label="Track order by Order ID"
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {filteredOrders.map((ord) => {
              const isSelected = ord.orderId === activeOrder.orderId;
              return (
                <button
                  key={ord.orderId}
                  type="button"
                  onClick={() => setSelectedOrderId(ord.orderId)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-800 bg-emerald-50/60 ring-1 ring-emerald-800/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
                    <span className="font-mono tabular-nums">{ord.orderId}</span>
                    <span className="font-mono tabular-nums text-emerald-800">
                      ₹{ord.grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mb-1.5">
                    {ord.createdAt} · {ord.items.reduce((sum, i) => sum + i.quantity, 0)} items
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-800">{ord.status}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Detail Panel: Active Order Tracking, Address & Ordered Items */}
        <div className="lg:col-span-8 space-y-6">
          {/* Live Order Status Tracker Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">
                  Order Reference · Placed on {activeOrder.createdAt}
                </div>
                <h2 className="text-xl font-extrabold font-mono tabular-nums text-slate-900">
                  {activeOrder.orderId}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAdvanceStatus}
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer"
                >
                  Simulate Next Delivery Stage
                </button>
                <button
                  type="button"
                  onClick={() => onReorder(activeOrder)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors cursor-pointer"
                >
                  Reorder Items
                </button>
              </div>
            </div>

            {/* 4-Step Tracking Bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-3">
                <span>Live Order Status: {activeOrder.status}</span>
                <span className="inline-flex items-center gap-1 text-emerald-800">
                  <Clock className="w-3.5 h-3.5" />
                  <span>ETA: {activeOrder.estimatedDelivery}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                {ORDER_STEPS.map((step, index) => {
                  const completed = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  return (
                    <div
                      key={step}
                      className={`p-3 rounded-lg border text-xs transition-colors ${
                        isCurrent
                          ? 'border-emerald-800 bg-emerald-900 text-white font-bold'
                          : completed
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-900 font-semibold'
                          : 'border-slate-200 bg-slate-50 text-slate-600 font-medium'
                      }`}
                    >
                      <div className="font-mono text-[11px] opacity-75 mb-0.5">
                        Step 0{index + 1}
                      </div>
                      <div>{step}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Address & Assigned Person Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>Delivery Address ({activeOrder.address.label})</span>
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  {activeOrder.address.customerName} · {activeOrder.address.mobileNumber}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeOrder.address.houseNumber}, {activeOrder.address.streetArea},{' '}
                  {activeOrder.address.villageTown} – {activeOrder.address.pincode}
                </p>
                <p className="text-xs text-slate-500">
                  Landmark: {activeOrder.address.landmark}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Truck className="w-4 h-4 text-orange-600" />
                  <span>
                    {activeOrder.deliveryOption === 'shop-staff'
                      ? 'Shop Staff Delivery'
                      : 'Assigned Delivery Partner'}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  {activeOrder.assignedPersonName}
                </p>
                <p className="text-xs text-slate-600 inline-flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{activeOrder.assignedPersonPhone}</span>
                </p>
                <div className="text-xs text-slate-500 pt-1">
                  Payment:{' '}
                  <strong className="text-slate-800">
                    {activeOrder.paymentMethod === 'cod'
                      ? 'Cash on Delivery (COD)'
                      : `UPI Online (${activeOrder.upiReference || 'Paid'})`}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Ordered Products & Bill Receipt */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-700" />
                <span>Ordered Products ({activeOrder.items.length})</span>
              </h3>
              <span className="text-xs font-mono text-slate-500">
                GST Included · Sri Lalitha Super Market
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {activeOrder.items.map((item) => (
                <div
                  key={item.productId}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono tabular-nums">
                        {item.brand} · {item.weight} · ₹{item.unitPrice} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold font-mono tabular-nums text-slate-900">
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Item Subtotal</span>
                <span className="font-mono tabular-nums">
                  ₹{activeOrder.subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Total Discount Saved</span>
                <span className="font-mono tabular-nums">
                  -₹{activeOrder.totalSavings.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges</span>
                <span className="font-mono tabular-nums">
                  {activeOrder.deliveryCharge === 0
                    ? 'FREE (₹0)'
                    : `₹${activeOrder.deliveryCharge}`}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span className="font-mono tabular-nums text-emerald-900">
                  ₹{activeOrder.grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
