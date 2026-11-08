import React, { useState } from 'react';
import {
  User,
  MapPin,
  Package,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  X,
} from 'lucide-react';
import { CustomerProfile, DeliveryAddress } from '../types/store';

interface AccountModalProps {
  isOpen: boolean;
  initialTab: 'profile' | 'login' | 'addresses' | 'orders';
  onClose: () => void;
  customer: CustomerProfile;
  onUpdateCustomer: (updated: CustomerProfile) => void;
  onNavigateToOrders: () => void;
  onNavigateToWishlist: () => void;
  ordersCount: number;
  wishlistCount: number;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  initialTab,
  onClose,
  customer,
  onUpdateCustomer,
  onNavigateToOrders,
  onNavigateToWishlist,
  ordersCount,
  wishlistCount,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'login' | 'addresses'>(
    initialTab === 'orders' ? 'profile' : initialTab
  );
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Auth / Profile inputs
  const [nameInput, setNameInput] = useState(customer.name);
  const [mobileInput, setMobileInput] = useState(customer.mobile);
  const [emailInput, setEmailInput] = useState(customer.email);
  const [villageInput, setVillageInput] = useState(customer.villageTown || 'Vissannapeta');
  const [statusMessage, setStatusMessage] = useState('');

  // New Address Form
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrHouse, setAddrHouse] = useState('');
  const [addrStreet, setAddrStreet] = useState('Main Road, Vissannapeta');
  const [addrVillage, setAddrVillage] = useState('Vissannapeta');
  const [addrPincode, setAddrPincode] = useState('521215');
  const [addrLandmark, setAddrLandmark] = useState('');

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileInput.trim() || mobileInput.replace(/\D/g, '').length < 10) {
      setStatusMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    const finalName = nameInput.trim() || 'Vissannapeta Customer';
    onUpdateCustomer({
      ...customer,
      isLoggedIn: true,
      name: finalName,
      mobile: mobileInput.replace(/\D/g, '').slice(-10),
      email: emailInput.trim() || 'customer@vissannapeta.in',
      villageTown: villageInput.trim() || 'Vissannapeta',
    });
    setStatusMessage(
      authMode === 'register'
        ? 'Account registered successfully at Sri Lalitha Super Market!'
        : 'Logged in successfully!'
    );
    setActiveTab('profile');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrHouse.trim() || !addrStreet.trim()) return;
    const newAddr: DeliveryAddress = {
      id: `addr-${Date.now()}`,
      label: addrLabel,
      customerName: customer.name || 'Srinivasa Rao',
      mobileNumber: customer.mobile || '9848052121',
      houseNumber: addrHouse.trim(),
      streetArea: addrStreet.trim(),
      villageTown: addrVillage.trim() || 'Vissannapeta',
      pincode: addrPincode.trim() || '521215',
      landmark: addrLandmark.trim() || 'Near Main Road',
      deliveryAddressNotes: `${addrHouse.trim()}, ${addrStreet.trim()}, ${addrVillage.trim()} - ${addrPincode.trim()}`,
      isDefault: customer.savedAddresses.length === 0,
    };

    onUpdateCustomer({
      ...customer,
      savedAddresses: [...customer.savedAddresses, newAddr],
    });
    setAddrHouse('');
    setAddrLandmark('');
    setShowNewAddress(false);
    setStatusMessage('New Vissannapeta delivery address saved!');
  };

  const handleDeleteAddress = (id: string) => {
    onUpdateCustomer({
      ...customer,
      savedAddresses: customer.savedAddresses.filter((a) => a.id !== id),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-modal-title"
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-emerald-900 text-white flex items-center justify-between">
          <div>
            <h2 id="account-modal-title" className="text-lg font-bold">
              Customer Account · Sri Lalitha Super Market
            </h2>
            <p className="text-xs text-emerald-100">
              Vissannapeta Loyalty & Doorstep Delivery Profile
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Account Modal"
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('profile');
              setStatusMessage('');
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg border-b-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-emerald-800 text-emerald-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            My Profile
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('addresses');
              setStatusMessage('');
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg border-b-2 transition-colors cursor-pointer ${
              activeTab === 'addresses'
                ? 'border-emerald-800 text-emerald-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Saved Addresses ({customer.savedAddresses.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setStatusMessage('');
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg border-b-2 transition-colors cursor-pointer ${
              activeTab === 'login'
                ? 'border-emerald-800 text-emerald-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {customer.isLoggedIn ? 'Switch / Register Account' : 'Customer Login / Signup'}
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-lg">
                    {customer.name ? customer.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{customer.name}</h3>
                    <p className="text-xs text-slate-600 font-mono">
                      +91 {customer.mobile} · {customer.villageTown}
                    </p>
                  </div>
                </div>

                {customer.isLoggedIn && (
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateCustomer({ ...customer, isLoggedIn: false });
                      setActiveTab('login');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                )}
              </div>

              {/* Quick Shortcuts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToOrders();
                  }}
                  className="p-4 rounded-xl border border-slate-200 hover:border-emerald-700 text-left flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      My Orders & Live Tracking
                    </div>
                    <div className="text-xs text-slate-500">
                      {ordersCount} orders placed
                    </div>
                  </div>
                  <Package className="w-5 h-5 text-emerald-700" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToWishlist();
                  }}
                  className="p-4 rounded-xl border border-slate-200 hover:border-emerald-700 text-left flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-900">My Saved Wishlist</div>
                    <div className="text-xs text-slate-500">
                      {wishlistCount} items saved for later
                    </div>
                  </div>
                  <User className="w-5 h-5 text-orange-600" />
                </button>
              </div>

              {/* Edit Profile Details */}
              <form onSubmit={handleAuthSubmit} className="space-y-4 pt-2 border-t border-slate-200">
                <h4 className="text-sm font-bold text-slate-900">Update Customer Profile</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="profile-name" className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="profile-name"
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-mobile" className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      id="profile-mobile"
                      type="tel"
                      value={mobileInput}
                      onChange={(e) => setMobileInput(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-email" className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="profile-email"
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-village" className="block text-xs font-semibold text-slate-700 mb-1">
                      Default Town / Village
                    </label>
                    <input
                      id="profile-village"
                      type="text"
                      value={villageInput}
                      onChange={(e) => setVillageInput(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Saved Delivery Addresses in Vissannapeta
                </h3>
                <button
                  type="button"
                  onClick={() => setShowNewAddress(!showNewAddress)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {showNewAddress && (
                <form
                  onSubmit={handleAddAddress}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="new-addr-label" className="block text-xs font-semibold text-slate-700 mb-1">
                        Address Label
                      </label>
                      <input
                        id="new-addr-label"
                        type="text"
                        value={addrLabel}
                        onChange={(e) => setAddrLabel(e.target.value)}
                        placeholder="Home / Shop"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label htmlFor="new-addr-house" className="block text-xs font-semibold text-slate-700 mb-1">
                        House / Door No *
                      </label>
                      <input
                        id="new-addr-house"
                        type="text"
                        required
                        value={addrHouse}
                        onChange={(e) => setAddrHouse(e.target.value)}
                        placeholder="D.No 2-45"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label htmlFor="new-addr-street" className="block text-xs font-semibold text-slate-700 mb-1">
                        Street / Colony *
                      </label>
                      <input
                        id="new-addr-street"
                        type="text"
                        required
                        value={addrStreet}
                        onChange={(e) => setAddrStreet(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label htmlFor="new-addr-landmark" className="block text-xs font-semibold text-slate-700 mb-1">
                        Landmark *
                      </label>
                      <input
                        id="new-addr-landmark"
                        type="text"
                        required
                        value={addrLandmark}
                        onChange={(e) => setAddrLandmark(e.target.value)}
                        placeholder="Near Bus Stand"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowNewAddress(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {customer.savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{addr.label}</span>
                        <span>·</span>
                        <span>{addr.customerName}</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        {addr.houseNumber}, {addr.streetArea}, {addr.villageTown} – {addr.pincode}
                      </p>
                      <p className="text-xs text-slate-500">Landmark: {addr.landmark}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(addr.id)}
                      aria-label={`Delete ${addr.label} address`}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'login' && (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg w-fit">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  Customer Login
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  New Customer Registration
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="auth-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    id="auth-name"
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="auth-mobile" className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number (Vissannapeta / AP) *
                  </label>
                  <input
                    id="auth-mobile"
                    type="tel"
                    required
                    value={mobileInput}
                    onChange={(e) => setMobileInput(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                </div>
                {authMode === 'register' && (
                  <>
                    <div>
                      <label htmlFor="auth-email" className="block text-xs font-semibold text-slate-700 mb-1">
                        Email (Optional)
                      </label>
                      <input
                        id="auth-email"
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="auth-village" className="block text-xs font-semibold text-slate-700 mb-1">
                        Village / Town
                      </label>
                      <input
                        id="auth-village"
                        type="text"
                        value={villageInput}
                        onChange={(e) => setVillageInput(e.target.value)}
                        placeholder="Vissannapeta"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                  </>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
              >
                {authMode === 'register'
                  ? 'Complete Customer Registration'
                  : 'Login to Sri Lalitha Super Market'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
