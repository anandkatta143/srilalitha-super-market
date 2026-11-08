import React, { useState } from 'react';
import { MapPin, Phone, Clock, Mail, X } from 'lucide-react';
import { CategoryId, PolicyKey } from '../types/store';

interface FooterProps {
  onSelectCategory: (category: CategoryId) => void;
  onNavigateHome: () => void;
  onNavigateOrders: () => void;
  onNavigateWishlist: () => void;
}

const POLICY_CONTENT: Record<
  PolicyKey,
  { title: string; subtitle: string; paragraphs: string[] }
> = {
  about: {
    title: 'About Sri Lalitha Super Market',
    subtitle: 'Vissannapeta’s Trusted Family Grocery Destination',
    paragraphs: [
      'Founded in the heart of Vissannapeta, NTR District, Andhra Pradesh, Sri Lalitha Super Market serves over 4,500+ families across Vissannapeta, Putrela, Chatrai Road, Nuzvid Road, and Tiruvuru Cross.',
      'We source single-origin aged Sona Masoori rice directly from Krishna delta mills, unpolished pulses from Tenali, pure Guntur spices, and morning farm-fresh vegetables from local rythus.',
      'Our mission is simple: Your Daily Needs, Delivered to Your Doorstep at honest wholesale supermarket prices.',
    ],
  },
  contact: {
    title: 'Contact Us & Store Address',
    subtitle: 'Visit Us or Order via Phone / Online',
    paragraphs: [
      'Store Address: Main Road, Near RTC Bus Stand, Opposite SBI Bank, Vissannapeta, NTR District, Andhra Pradesh – 521215.',
      'Customer Care & Order Desk: +91 98480 52121 / +91 8673 272145',
      'Store Timings: Open Daily from 7:00 AM to 9:30 PM (Including Sundays & Festival Days).',
    ],
  },
  support: {
    title: 'Customer Support',
    subtitle: 'Dedicated Local Assistance in Telugu & English',
    paragraphs: [
      'Need help modifying an order, requesting a bulk marriage/function grocery quote, or tracking your delivery? Our Vissannapeta store desk responds within 5 minutes.',
      'Call +91 98480 52121 or share your Order ID (SLSM-VSP-XXXX) with our store manager for priority resolution.',
    ],
  },
  delivery: {
    title: 'Delivery Information',
    subtitle: 'Fast 35–45 Minute Doorstep Delivery in Vissannapeta',
    paragraphs: [
      'Free Doorstep Delivery on all grocery orders above ₹499 within Vissannapeta town limits (521215). For orders below ₹499, a nominal ₹30 delivery charge applies.',
      'Customers can choose between Shop Staff Delivery (ideal for 25kg rice bags and heavy monthly kirana) or Assigned Delivery Person (express 2-wheeler delivery).',
    ],
  },
  returns: {
    title: 'No-Questions-Asked Return & Replacement Policy',
    subtitle: '100% Quality & Freshness Guarantee',
    paragraphs: [
      'At Sri Lalitha Super Market, customer trust comes first. Inspect your fresh vegetables, fruits, dairy, and packaged groceries right at your doorstep.',
      'If any item is damaged, near expiry, or not up to your expectation, hand it back to our delivery staff for an instant replacement or full refund.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'Safe & Confidential Customer Data',
    paragraphs: [
      'We collect only your name, mobile number, and Vissannapeta delivery address strictly to fulfill and deliver your grocery orders.',
      'We never sell or share customer phone numbers or address records with third-party marketers.',
    ],
  },
  terms: {
    title: 'Terms and Conditions',
    subtitle: 'Transparent Pricing & Billing',
    paragraphs: [
      'All prices are listed in Indian Rupees (₹ INR) inclusive of applicable GST. Store discounts apply automatically in your shopping cart.',
      'Product images and sample catalog items Marked as Demo Sample represent our standard store inventory in Vissannapeta.',
    ],
  },
};

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onNavigateHome,
  onNavigateOrders,
  onNavigateWishlist,
}) => {
  const [activePolicy, setActivePolicy] = useState<PolicyKey | null>(null);

  return (
    <footer className="bg-[#082B1A] text-[#E6E2D8] border-t border-[#14452F] mt-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-[#14452F]">
          {/* Column 1: About Sri Lalitha Super Market */}
          <div className="lg:col-span-4 space-y-3">
            <div
              className="text-xl font-bold text-white tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Sri Lalitha Super Market
            </div>
            <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              Freshness, Quality & Convenience at Your Doorstep.
            </p>
            <p className="text-sm text-[#C8C4B8] leading-relaxed">
              Vissannapeta’s premier family grocery store offering farm-fresh produce, aged Sona Masoori rice, unpolished dals, pure cooking oils, and 31 grocery departments at wholesale savings.
            </p>
          </div>

          {/* Column 2: Quick Categories */}
          <div className="lg:col-span-3 space-y-2.5">
            <h3 className="text-sm font-bold text-white">Popular Departments</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#C8C4B8]">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('rice-products')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  A · Rice & Rice Products
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('dals-pulses')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  C · Dals & Pulses
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('cooking-oils')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  D · Edible Oils & Ghee
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('fruits-vegetables')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  P · Fresh Vegetables
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('spices-masalas')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  E · Spices & Masalas
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Policies & Links */}
          <div className="lg:col-span-2 space-y-2.5">
            <h3 className="text-sm font-bold text-white">Customer Policies</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicy('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicy('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicy('support')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Customer Support
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicy('delivery')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Delivery Information
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicy('returns')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Return Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicy('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActivePolicy('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms and Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Store Address & Contact */}
          <div className="lg:col-span-3 space-y-2.5">
            <h3 className="text-sm font-bold text-white">Vissannapeta Store Address</h3>
            <div className="space-y-2 text-xs sm:text-sm text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Main Road, Near RTC Bus Stand, Vissannapeta, NTR District, Andhra Pradesh – 521215
                </span>
              </p>
              <p className="flex items-center gap-2 font-mono">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 98480 52121</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>orders@srilalithasupermarket.in</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Open Daily: 7:00 AM – 9:30 PM</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Navigation */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Sri Lalitha Super Market, Vissannapeta, Andhra Pradesh. All Rights Reserved. Currency: INR (₹).
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Storefront Home
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={onNavigateOrders}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Track Order
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={onNavigateWishlist}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Policy Viewer Modal */}
      {activePolicy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white text-slate-900 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {POLICY_CONTENT[activePolicy].title}
                </h3>
                <p className="text-xs text-emerald-800 font-medium">
                  {POLICY_CONTENT[activePolicy].subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActivePolicy(null)}
                aria-label="Close policy window"
                className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
              {POLICY_CONTENT[activePolicy].paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActivePolicy(null)}
                className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-900 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
