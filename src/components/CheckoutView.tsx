import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  UserCheck,
  Banknote,
  Smartphone,
} from 'lucide-react';
import {
  CartItem,
  CartTotals,
  CustomerProfile,
  DeliveryAddress,
  DeliveryOption,
  PaymentMethod,
  Product,
} from '../types/store';
import { validateCheckoutAddress } from '../utils/storeLogic';

interface CheckoutViewProps {
  cartItems: CartItem[];
  products: Product[];
  totals: CartTotals;
  customer: CustomerProfile;
  onBackToShop: () => void;
  onPlaceOrder: (orderData: {
    address: DeliveryAddress;
    paymentMethod: PaymentMethod;
    upiReference?: string;
    deliveryOption: DeliveryOption;
    saveAddress: boolean;
  }) => void;
}

const VISSANNAPETA_AREAS = [
  'Main Road, Vissannapeta',
  'Temple Street, Vissannapeta',
  'Nuzvid Road, Vissannapeta',
  'Tiruvuru Cross Road, Vissannapeta',
  'Chatrai Road, Vissannapeta',
  'Putrela Village (Near Vissannapeta)',
];

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cartItems,
  products,
  totals,
  customer,
  onBackToShop,
  onPlaceOrder,
}) => {
  const defaultAddress = customer.savedAddresses.find((a) => a.isDefault) || customer.savedAddresses[0];

  const [customerName, setCustomerName] = useState(
    defaultAddress?.customerName || customer.name || ''
  );
  const [mobileNumber, setMobileNumber] = useState(
    defaultAddress?.mobileNumber || customer.mobile || ''
  );
  const [houseNumber, setHouseNumber] = useState(defaultAddress?.houseNumber || '');
  const [streetArea, setStreetArea] = useState(
    defaultAddress?.streetArea || 'Main Road, Near RTC Bus Stand'
  );
  const [villageTown, setVillageTown] = useState(
    defaultAddress?.villageTown || customer.villageTown || 'Vissannapeta'
  );
  const [pincode, setPincode] = useState(defaultAddress?.pincode || '521215');
  const [landmark, setLandmark] = useState(defaultAddress?.landmark || '');
  const [deliveryAddressNotes, setDeliveryAddressNotes] = useState(
    defaultAddress?.deliveryAddressNotes || ''
  );
  const [addressLabel, setAddressLabel] = useState(defaultAddress?.label || 'Home');
  const [saveAddress, setSaveAddress] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [upiId, setUpiId] = useState('customer@ybl');
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('shop-staff');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const detailedItems = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter((x): x is { productId: string; quantity: number; product: Product } => x !== null);

  const handleSelectSavedAddress = (addr: DeliveryAddress) => {
    setCustomerName(addr.customerName);
    setMobileNumber(addr.mobileNumber);
    setHouseNumber(addr.houseNumber);
    setStreetArea(addr.streetArea);
    setVillageTown(addr.villageTown);
    setPincode(addr.pincode);
    setLandmark(addr.landmark);
    setDeliveryAddressNotes(addr.deliveryAddressNotes);
    setAddressLabel(addr.label);
    setErrors({});
  };

  const handleQuickFillDemo = () => {
    setCustomerName('K. Srinivasa Rao');
    setMobileNumber('9848052121');
    setHouseNumber('D.No 4-88/2');
    setStreetArea('Temple Street, Main Road');
    setVillageTown('Vissannapeta');
    setPincode('521215');
    setLandmark('Near Sri Vasavi Kanyaka Parameswari Temple');
    setDeliveryAddressNotes(
      'D.No 4-88/2, First Floor, Temple Street, Main Road, Vissannapeta, NTR District, AP - 521215'
    );
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const composedNotes =
      deliveryAddressNotes.trim() ||
      `${houseNumber}, ${streetArea}, ${villageTown} - ${pincode} (Landmark: ${landmark})`;

    const validation = validateCheckoutAddress(
      {
        customerName,
        mobileNumber,
        houseNumber,
        streetArea,
        villageTown,
        pincode,
        landmark,
        deliveryAddressNotes: composedNotes,
      },
      paymentMethod,
      upiId
    );

    if (!validation.valid) {
      setErrors(validation.errors as Record<string, string>);
      return;
    }

    const finalAddress: DeliveryAddress = {
      id: `addr-${Date.now()}`,
      label: addressLabel || 'Home',
      customerName: customerName.trim(),
      mobileNumber: mobileNumber.replace(/\D/g, ''),
      houseNumber: houseNumber.trim(),
      streetArea: streetArea.trim(),
      villageTown: villageTown.trim(),
      pincode: pincode.trim(),
      landmark: landmark.trim(),
      deliveryAddressNotes: composedNotes,
    };

    onPlaceOrder({
      address: finalAddress,
      paymentMethod,
      upiReference: paymentMethod === 'upi' ? upiId.trim() : undefined,
      deliveryOption,
      saveAddress,
    });
  };

  if (detailedItems.length === 0) {
    return (
      <section className="max-w-[960px] mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h1>
        <p className="text-slate-600 mb-6">
          Please add groceries from Sri Lalitha Super Market before proceeding to checkout.
        </p>
        <button
          type="button"
          onClick={onBackToShop}
          className="px-5 py-2.5 bg-emerald-800 text-white font-semibold rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
        >
          Return to Storefront
        </button>
      </section>
    );
  }

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      {/* Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <button
            type="button"
            onClick={onBackToShop}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-800 hover:text-emerald-950 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shopping</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Customer Checkout · Vissannapeta Delivery
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Complete your delivery address, choose your preferred delivery team & payment method.
          </p>
        </div>

        <button
          type="button"
          onClick={handleQuickFillDemo}
          className="px-3.5 py-2 text-xs font-semibold text-emerald-900 bg-emerald-100/80 hover:bg-emerald-200/80 border border-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Auto-Fill Sample Vissannapeta Address
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer Address, Delivery Options & Payment Method */}
        <div className="lg:col-span-7 space-y-6">
          {/* Saved Addresses Selector */}
          {customer.savedAddresses.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Select from Saved Addresses</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {customer.savedAddresses.map((addr) => (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => handleSelectSavedAddress(addr)}
                    className="text-left p-3 rounded-lg border border-slate-200 hover:border-emerald-700 bg-slate-50/60 hover:bg-emerald-50/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
                      <span>{addr.label} · {addr.customerName}</span>
                      <span className="font-mono text-emerald-800">{addr.pincode}</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {addr.houseNumber}, {addr.streetArea}, {addr.villageTown}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Customer & Delivery Address Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  01. Customer & Delivery Address Details
                </h2>
                <p className="text-xs text-slate-500">
                  Serving Vissannapeta (521215) & surrounding villages in NTR District, AP
                </p>
              </div>
              <MapPin className="w-5 h-5 text-emerald-700 shrink-0" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="checkout-customer-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Customer Full Name *
                </label>
                <input
                  id="checkout-customer-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. K. Srinivasa Rao"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-700"
                />
                {errors.customerName && (
                  <p className="text-xs text-red-600 mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label htmlFor="checkout-mobile" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mobile Number (10 Digits) *
                </label>
                <input
                  id="checkout-mobile"
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="e.g. 9848052121"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:border-emerald-700"
                />
                {errors.mobileNumber && (
                  <p className="text-xs text-red-600 mt-1">{errors.mobileNumber}</p>
                )}
              </div>

              <div>
                <label htmlFor="checkout-house-no" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  House / Door Number *
                </label>
                <input
                  id="checkout-house-no"
                  type="text"
                  required
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  placeholder="e.g. D.No 4-88/2"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-700"
                />
                {errors.houseNumber && (
                  <p className="text-xs text-red-600 mt-1">{errors.houseNumber}</p>
                )}
              </div>

              <div>
                <label htmlFor="checkout-street-area" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Street / Area / Colony *
                </label>
                <input
                  id="checkout-street-area"
                  type="text"
                  required
                  value={streetArea}
                  onChange={(e) => setStreetArea(e.target.value)}
                  placeholder="e.g. Temple Street, Main Road"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-700"
                />
                {errors.streetArea && (
                  <p className="text-xs text-red-600 mt-1">{errors.streetArea}</p>
                )}
              </div>

              <div>
                <label htmlFor="checkout-village-town" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Village / Town *
                </label>
                <input
                  id="checkout-village-town"
                  type="text"
                  required
                  value={villageTown}
                  onChange={(e) => setVillageTown(e.target.value)}
                  placeholder="Vissannapeta"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-700"
                />
                {errors.villageTown && (
                  <p className="text-xs text-red-600 mt-1">{errors.villageTown}</p>
                )}
              </div>

              <div>
                <label htmlFor="checkout-pincode" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pincode *
                </label>
                <input
                  id="checkout-pincode"
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="521215"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:border-emerald-700"
                />
                {errors.pincode && (
                  <p className="text-xs text-red-600 mt-1">{errors.pincode}</p>
                )}
              </div>
            </div>

            {/* Quick Area Selector for Vissannapeta */}
            <div>
              <span className="block text-xs text-slate-500 mb-1.5">
                Quick Select Vissannapeta Locality:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {VISSANNAPETA_AREAS.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setStreetArea(area)}
                    className={`px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
                      streetArea === area
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-600'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="checkout-landmark" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nearby Landmark *
                </label>
                <input
                  id="checkout-landmark"
                  type="text"
                  required
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near RTC Bus Stand / SBI Bank"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-700"
                />
                {errors.landmark && (
                  <p className="text-xs text-red-600 mt-1">{errors.landmark}</p>
                )}
              </div>

              <div>
                <label htmlFor="checkout-address-label" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Address Type
                </label>
                <select
                  id="checkout-address-label"
                  value={addressLabel}
                  onChange={(e) => setAddressLabel(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:border-emerald-700"
                >
                  <option value="Home">Home</option>
                  <option value="Shop / Office">Shop / Office</option>
                  <option value="Farmhouse">Farmhouse</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="checkout-full-address" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Complete Delivery Address & Instructions *
              </label>
              <textarea
                id="checkout-full-address"
                rows={2}
                value={deliveryAddressNotes}
                onChange={(e) => setDeliveryAddressNotes(e.target.value)}
                placeholder="Full address or delivery note (e.g. Call on arrival at gate, 1st floor)"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-700"
              />
              {errors.deliveryAddressNotes && (
                <p className="text-xs text-red-600 mt-1">{errors.deliveryAddressNotes}</p>
              )}
            </div>

            <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
                className="rounded border-slate-300 text-emerald-800 focus:ring-emerald-700"
              />
              <span>Save this address to My Account for faster future orders</span>
            </label>
          </div>

          {/* Step 2: Delivery Options */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  02. Delivery Personnel Preference
                </h2>
                <p className="text-xs text-slate-500">
                  Choose how your groceries are dispatched from Sri Lalitha Super Market
                </p>
              </div>
              <Truck className="w-5 h-5 text-emerald-700 shrink-0" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDeliveryOption('shop-staff')}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  deliveryOption === 'shop-staff'
                    ? 'border-emerald-800 bg-emerald-50/50 ring-2 ring-emerald-800/15'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-slate-900">Shop Staff Delivery</span>
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Delivered directly by Sri Lalitha Super Market store staff (Ramesh / Naresh). Ideal for heavy 25kg rice bags & monthly kirana.
                </p>
                <div className="mt-2 text-xs font-semibold text-emerald-800">
                  Estimated: 35–45 mins in Vissannapeta
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryOption('assigned-partner')}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  deliveryOption === 'assigned-partner'
                    ? 'border-emerald-800 bg-emerald-50/50 ring-2 ring-emerald-800/15'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-slate-900">Assigned Delivery Person</span>
                  <Truck className="w-4 h-4 text-orange-600" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dedicated 2-wheeler local delivery partner assigned immediately upon billing for rapid express doorstep drop.
                </p>
                <div className="mt-2 text-xs font-semibold text-orange-700">
                  Estimated: 25–35 mins Express
                </div>
              </button>
            </div>
          </div>

          {/* Step 3: Payment Options */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">03. Payment Method</h2>
                <p className="text-xs text-slate-500">
                  Pay comfortably upon delivery or instantly via UPI
                </p>
              </div>
              <CreditCard className="w-5 h-5 text-emerald-700 shrink-0" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-800 bg-emerald-50/50 ring-2 ring-emerald-800/15'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-slate-900">Cash on Delivery (COD)</span>
                  <Banknote className="w-4 h-4 text-emerald-700" />
                </div>
                <p className="text-xs text-slate-600">
                  Pay cash or scan store QR code at your doorstep when receiving your items.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'border-emerald-800 bg-emerald-50/50 ring-2 ring-emerald-800/15'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-slate-900">UPI Online Payment</span>
                  <Smartphone className="w-4 h-4 text-orange-600" />
                </div>
                <p className="text-xs text-slate-600">
                  Instant payment via PhonePe, Google Pay, Paytm, or BHIM UPI.
                </p>
              </button>
            </div>

            {paymentMethod === 'upi' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span className="font-semibold">Merchant UPI ID: srilalithasupermarket@sbi</span>
                  <span className="text-emerald-700 font-medium">Verified Store Merchant</span>
                </div>
                <div>
                  <label htmlFor="checkout-upi-id" className="block text-xs font-semibold text-slate-700 mb-1">
                    Enter Your UPI ID (PhonePe / GPay / Paytm) *
                  </label>
                  <input
                    id="checkout-upi-id"
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@ybl or 9848052121@okaxis"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:border-emerald-700"
                  />
                  {errors.upiId && (
                    <p className="text-xs text-red-600 mt-1">{errors.upiId}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary Before Placing Order */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-xs">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>
            <p className="text-xs text-slate-500">
              {totals.totalItemsCount} items from Sri Lalitha Super Market, Vissannapeta
            </p>
          </div>

          {/* Itemized List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 pr-1">
            {detailedItems.map(({ product, quantity }) => (
              <div key={product.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-slate-900 truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono tabular-nums">
                      {product.weight} × {quantity}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold font-mono tabular-nums text-slate-900">
                    ₹{(product.discountPrice * quantity).toLocaleString('en-IN')}
                  </div>
                  {product.originalPrice > product.discountPrice && (
                    <div className="text-[11px] font-mono tabular-nums text-slate-400 line-through">
                      ₹{(product.originalPrice * quantity).toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bill Breakdown */}
          <div className="pt-4 border-t border-slate-200 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Items MRP Total</span>
              <span className="font-mono tabular-nums">
                ₹{totals.totalOriginalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Sri Lalitha Store Discount</span>
              <span className="font-mono tabular-nums">
                -₹{totals.totalSavings.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Item Subtotal</span>
              <span className="font-mono tabular-nums font-semibold">
                ₹{totals.subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>
                Delivery ({deliveryOption === 'shop-staff' ? 'Shop Staff' : 'Assigned Partner'})
              </span>
              <span className="font-mono tabular-nums">
                {totals.deliveryCharge === 0 ? (
                  <span className="text-emerald-700 font-semibold">FREE (₹0)</span>
                ) : (
                  `₹${totals.deliveryCharge}`
                )}
              </span>
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <div>
                <span className="text-base font-bold text-slate-900">Grand Total</span>
                <p className="text-xs text-slate-500">Inclusive of all taxes</p>
              </div>
              <span className="text-xl font-extrabold font-mono tabular-nums text-emerald-900">
                ₹{totals.grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>
              Place Order · ₹{totals.grandTotal.toLocaleString('en-IN')} (
              {paymentMethod === 'cod' ? 'COD' : 'UPI'})
            </span>
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>100% Fresh Quality Guaranteed by Sri Lalitha Super Market</span>
          </div>
        </div>
      </form>
    </section>
  );
};
