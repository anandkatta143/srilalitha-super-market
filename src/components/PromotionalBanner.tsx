import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Truck,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CategoryId } from '../types/store';
import { PROMOTIONAL_BANNERS, PromotionalBannerSlide } from '../data/demoProducts';

interface PromotionalBannerProps {
  onSelectSlideAction: (slide: PromotionalBannerSlide) => void;
  onExploreAllCategories: () => void;
  onSelectCategory?: (category: CategoryId) => void;
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({
  onSelectSlideAction,
  onExploreAllCategories,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentSlide = PROMOTIONAL_BANNERS[activeIndex] || PROMOTIONAL_BANNERS[0];

  const handlePrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? PROMOTIONAL_BANNERS.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) =>
      prev === PROMOTIONAL_BANNERS.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section
      className="bg-gradient-to-b from-[#EFECE2] to-[#FAF7F0] border-b border-[#E5DEC9] pt-4 pb-6"
      data-testid="promotional-banner-section"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 space-y-4">
        {/* Wide Nature's Basket-Inspired Promotional Banner */}
        <div
          className={`relative rounded-2xl overflow-hidden border border-[#C59B27]/45 bg-gradient-to-r ${currentSlide.bgTone} text-white shadow-md`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[280px] sm:min-h-[320px]">
            {/* Left Promotional Copy */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-5 z-10">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="text-[#D4AF37] uppercase tracking-widest font-bold">
                    {currentSlide.badge}
                  </span>
                  <span aria-hidden="true" className="text-white/40">
                    ·
                  </span>
                  <span className="text-[#E6E2D8] font-mono">
                    Sri Lalitha Super Market, Vissannapeta
                  </span>
                </div>

                <h1
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-[1.14]"
                  style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
                >
                  {currentSlide.title}
                </h1>

                <p className="text-xs sm:text-sm lg:text-base text-[#E6E2D8] leading-relaxed max-w-xl">
                  {currentSlide.subtitle}
                </p>
              </div>

              <div className="space-y-4 pt-1">
                <div className="inline-block px-3.5 py-1.5 rounded-lg bg-white/10 border border-[#D4AF37]/40 text-xs sm:text-sm font-mono font-semibold text-[#F5E6C4]">
                  {currentSlide.highlightOffer}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onSelectSlideAction(currentSlide)}
                    className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-[#C59B27] hover:bg-[#d4ab32] text-[#082B1A] text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
                  >
                    <span>{currentSlide.ctaLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={onExploreAllCategories}
                    className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Browse All 31 Departments
                  </button>
                </div>
              </div>
            </div>

            {/* Right Studio Grocery Photography */}
            <div className="lg:col-span-5 relative min-h-[210px] sm:min-h-[260px] overflow-hidden bg-[#082B1A]">
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#082B1A] via-[#082B1A]/25 to-transparent" />

              {/* Prev / Next Banner Controls */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous promotional banner"
                  className="w-8 h-8 rounded-full bg-[#082B1A]/85 hover:bg-[#082B1A] text-white border border-white/25 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next promotional banner"
                  className="w-8 h-8 rounded-full bg-[#082B1A]/85 hover:bg-[#082B1A] text-white border border-white/25 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 5 Promotional Campaign Switcher Tabs (Fresh Groceries, Special Offers, Daily Essentials, Festival Offers, New Arrivals) */}
          <div
            role="tablist"
            aria-label="Promotional Campaigns"
            className="bg-[#062114]/90 border-t border-white/10 px-4 py-2.5 flex items-center justify-between gap-2 overflow-x-auto [scrollbar-width:none]"
          >
            <div className="flex items-center gap-2">
              {PROMOTIONAL_BANNERS.map((slide, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveIndex(idx)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#C59B27] text-[#082B1A] font-bold shadow-2xs'
                        : 'text-[#D5E2DA] hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {slide.tabLabel}
                  </button>
                );
              })}
            </div>
            <span className="hidden md:inline-block text-[11px] text-[#D4AF37] font-mono shrink-0">
              Freshness, Quality & Convenience at Your Doorstep
            </span>
          </div>
        </div>

        {/* Compact 4-Pillar Luxury Store Promise Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white border border-[#E6E0D0] rounded-xl p-3.5 flex items-center gap-3">
            <Truck className="w-5 h-5 text-[#0B3B24] shrink-0" />
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#14261C]">
                35–45 Min Vissannapeta Drop
              </div>
              <p className="text-[11px] text-slate-500">
                Free doorstep delivery on ₹499+
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#E6E0D0] rounded-xl p-3.5 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#0B3B24] shrink-0" />
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#14261C]">
                100% Farm & Mill Fresh
              </div>
              <p className="text-[11px] text-slate-500">
                Aged Sona Masoori & local rythu produce
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#E6E0D0] rounded-xl p-3.5 flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#9A6F0B] shrink-0" />
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#14261C]">
                Shop Staff or Partner Delivery
              </div>
              <p className="text-[11px] text-slate-500">
                Heavy 25kg rice bags carried to door
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#E6E0D0] rounded-xl p-3.5 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#9A6F0B] shrink-0" />
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#14261C]">
                COD & Instant UPI Payment
              </div>
              <p className="text-[11px] text-slate-500">
                Cash on Delivery, PhonePe & GPay
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
