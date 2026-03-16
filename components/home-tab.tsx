"use client";

import { useState, useEffect } from "react";
import {
  Search, Bell, MapPin, Heart, Star,
  ChevronRight, Flame, Zap, Eye, Tag,
} from "lucide-react";
import type { Listing } from "@/lib/types";
import { LISTINGS, CATEGORIES, CONDITION_CFG } from "@/lib/mock-data";

// Multiple icon variants per category so each product looks unique
const CAT_ICONS: Record<string, string[]> = {
  electronics: ["📱", "💻", "📷", "🎧", "🖥️", "⌚"],
  fashion:     ["👟", "👗", "🧥", "👜", "🧢", "👔"],
  home:        ["🛋️", "🪑", "🛏️", "🪴", "🍳", "🧹"],
  vehicles:    ["🏍️", "🚗", "🛵", "🚲", "🏎️", "🛺"],
  sports:      ["⚽", "🎾", "🏀", "🚴", "🏊", "🎿"],
  books:       ["📚", "📖", "🎨", "📝", "🗂️", "📒"],
  default:     ["📦", "🎁", "🏷️", "📫", "🪣", "🔧"],
};

const CAT_BG: Record<string, { bg: string; text: string }> = {
  electronics: { bg: "bg-sky-100",    text: "text-sky-500"    },
  fashion:     { bg: "bg-rose-100",   text: "text-rose-500"   },
  home:        { bg: "bg-amber-100",  text: "text-amber-600"  },
  vehicles:    { bg: "bg-zinc-200",   text: "text-zinc-500"   },
  sports:      { bg: "bg-green-100",  text: "text-green-600"  },
  books:       { bg: "bg-violet-100", text: "text-violet-500" },
  default:     { bg: "bg-surface-3",  text: "text-muted-foreground" },
};

function getCatIcon(item: Listing): string {
  const icons = CAT_ICONS[item.category] ?? CAT_ICONS.default;
  const idx = parseInt(item.id, 10) % icons.length;
  return icons[idx];
}

function ProductImage({ item, className }: { item: Listing; className?: string }) {
  const cfg  = CAT_BG[item.category] ?? CAT_BG.default;
  const icon = getCatIcon(item);
  return (
    <div className={`relative flex flex-col items-center justify-center gap-2 ${cfg.bg} ${className ?? ""}`}>
      <span className="text-4xl leading-none select-none">{icon}</span>
      <span className={`text-[9px] font-bold uppercase tracking-wider ${cfg.text} opacity-60`}>
        {item.condition}
      </span>
    </div>
  );
}

const PROMOS = [
  {
    id: "p1",
    bg: "bg-brand-deep",
    heading: "Giao dịch 0 phí",
    sub: "Miễn phí đăng tin tháng này",
    cta: "Đăng ngay",
    pill: "Ưu đãi",
  },
  {
    id: "p2",
    bg: "bg-success",
    heading: "Người bán mới +10π",
    sub: "Thưởng Pi cho người đăng bán lần đầu",
    cta: "Nhận thưởng",
    pill: "Mới",
  },
];

interface HomeTabProps {
  onViewListing: (listing: Listing) => void;
}

export function HomeTab({ onViewListing }: HomeTabProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery]       = useState("");
  const [liked, setLiked] = useState<Set<string>>(
    new Set(LISTINGS.filter((l) => l.isLiked).map((l) => l.id))
  );
  const [promoIdx, setPromoIdx] = useState(0);

  // Auto-cycle promo banner every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setPromoIdx((i) => (i + 1) % PROMOS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  function toggleLike(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const filtered = LISTINGS.filter((l) => {
    const matchCat = activeCategory === "all" || l.category === activeCategory;
    const matchQ   = !searchQuery || l.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQ;
  });

  const featured = filtered.filter((l) => l.isFeatured);
  const recent   = filtered.filter((l) => !l.isFeatured);
  const promo    = PROMOS[promoIdx];

  return (
    <div className="flex flex-col overflow-y-auto no-scrollbar bg-surface-1 pb-nav">

      {/* Header */}
      <header className="bg-primary px-4 pt-11 pb-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-primary-foreground/70 text-[11px] font-black tracking-[0.18em] uppercase">
                π ChoVeChai
              </span>
            </div>
            <h1 className="text-primary-foreground text-[1.65rem] font-black leading-tight tracking-tight text-balance">
              Chợ đồ cũ Pi
            </h1>
            <p className="text-primary-foreground/60 text-xs mt-0.5 font-medium">
              Mua bán · Giao dịch an toàn bằng Pi Network
            </p>
          </div>
          <button
            aria-label="Thông báo"
            className="relative w-[2.6rem] h-[2.6rem] rounded-2xl bg-white/15 flex items-center justify-center shrink-0 mt-0.5 active:opacity-70"
          >
            <Bell className="w-[1.1rem] h-[1.1rem] text-primary-foreground" strokeWidth={1.75} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive ring-[1.5px] ring-primary" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
          <input
            type="search"
            placeholder="Tìm iPhone, giày Nike, sofa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card rounded-2xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-sm"
          />
        </div>
      </header>

      {/* Stats strip */}
      <div className="bg-brand-deep px-4 py-2.5 flex items-center justify-between">
        <span className="text-primary-foreground/60 text-[11px] font-bold tracking-wide">Đang hoạt động</span>
        <div className="flex items-center gap-3">
          {[
            { n: "10K+", l: "Sản phẩm" },
            { n: "5K+",  l: "Người dùng" },
            { n: "99%",  l: "Tin cậy" },
          ].map((s, i, arr) => (
            <div key={s.l} className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-primary-foreground text-xs font-black leading-none">{s.n}</p>
                <p className="text-primary-foreground/50 text-[9px] mt-0.5 font-medium">{s.l}</p>
              </div>
              {i < arr.length - 1 && <div className="w-px h-4 bg-white/20" />}
            </div>
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div className="px-4 pt-4 pb-0.5">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all active:scale-95 border ${
                  isActive
                    ? "bg-foreground text-background border-foreground shadow-sm"
                    : "bg-card text-foreground border-border"
                }`}
              >
                <span className="text-sm leading-none">{cat.emoji}</span>
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-6 pb-2">

        {/* Promo banner with auto-cycle */}
        <div
          className={`${promo.bg} rounded-2xl p-4 flex items-center gap-4 shadow-sm transition-colors duration-500`}
          role="banner"
        >
          <div className="flex-1 min-w-0">
            <span className="inline-block text-[10px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white mb-1.5">
              {promo.pill}
            </span>
            <p className="text-white font-black text-base leading-tight">{promo.heading}</p>
            <p className="text-white/70 text-xs mt-0.5">{promo.sub}</p>
          </div>
          <div className="flex flex-col items-end gap-3 shrink-0">
            <button className="px-3.5 py-2 rounded-xl bg-white text-foreground text-xs font-black shadow-sm active:scale-95 transition-transform">
              {promo.cta}
            </button>
            <div className="flex gap-1">
              {PROMOS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPromoIdx(i)}
                  aria-label={`Ưu đãi ${i + 1}`}
                  className={`transition-all rounded-full ${
                    i === promoIdx
                      ? "w-4 h-1.5 bg-white"
                      : "w-1.5 h-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Featured / Hot deals */}
        {featured.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-destructive fill-destructive/70" />
                <h2 className="text-[0.9rem] font-black text-foreground">Tin nổi bật</h2>
              </div>
              <button className="flex items-center gap-0.5 text-xs font-bold text-primary">
                Xem tất cả <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
              {featured.map((item) => {
                const cond        = CONDITION_CFG[item.condition];
                const isLikedItem = liked.has(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewListing(item)}
                    className="flex-shrink-0 w-[11.5rem] bg-card rounded-2xl overflow-hidden border border-border shadow-sm text-left active:scale-95 transition-transform"
                  >
                    <div className="relative w-full h-36">
                      <ProductImage item={item} className="w-full h-full" />
                      {item.isHot && (
                        <span className="absolute top-2 left-2 flex items-center gap-1 bg-destructive text-destructive-foreground text-[9px] font-black px-1.5 py-0.5 rounded-full">
                          <Zap className="w-2.5 h-2.5 fill-current" /> HOT
                        </span>
                      )}
                      <button
                        onClick={(e) => toggleLike(item.id, e)}
                        aria-label={isLikedItem ? "Bỏ thích" : "Thích"}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${isLikedItem ? "fill-destructive text-destructive" : "text-muted-foreground"}`}
                        />
                      </button>
                      <span className={`absolute bottom-2 left-2 text-[10px] px-2 py-0.5 rounded-full font-bold ${cond.cls}`}>
                        {cond.label}
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-[11px] font-semibold text-foreground line-clamp-2 leading-snug mb-2">
                        {item.title}
                      </p>
                      <p className="text-base font-black text-primary leading-none mb-1.5">
                        {item.price.toLocaleString()}<span className="text-[11px] ml-0.5 font-bold">π</span>
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-pi-gold text-pi-gold" />
                          <span className="text-[10px] font-bold text-foreground">{item.rating}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5 text-muted-foreground shrink-0" />
                          <span className="text-[10px] text-muted-foreground truncate max-w-[70px]">
                            {item.location.split(",")[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Category quick grid (only on "all" + no search) */}
        {activeCategory === "all" && !searchQuery && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-primary" strokeWidth={2.25} />
                <h2 className="text-[0.9rem] font-black text-foreground">Danh mục</h2>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
                const cfg   = CAT_BG[cat.id] ?? CAT_BG.default;
                const count = LISTINGS.filter((l) => l.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
                  >
                    <div className={`w-full aspect-square rounded-2xl ${cfg.bg} flex items-center justify-center`}>
                      <span className="text-2xl leading-none">{cat.emoji}</span>
                    </div>
                    <p className="text-[10px] font-semibold text-foreground leading-tight text-center">{cat.label}</p>
                    <p className="text-[9px] text-muted-foreground">{count}</p>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Recent grid */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[0.9rem] font-black text-foreground">Mới đăng</h2>
            <span className="text-xs text-muted-foreground font-medium">{filtered.length} sản phẩm</span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-brand-soft flex items-center justify-center">
                <Search className="w-6 h-6 text-primary" strokeWidth={1.75} />
              </div>
              <p className="text-sm font-bold text-foreground">Không tìm thấy sản phẩm</p>
              <p className="text-xs text-muted-foreground">Thử từ khóa khác hoặc đổi danh mục</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {recent.map((item) => {
                const cond        = CONDITION_CFG[item.condition];
                const isLikedItem = liked.has(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewListing(item)}
                    className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm text-left active:scale-95 transition-transform"
                  >
                    <div className="relative w-full h-[9.5rem]">
                      <ProductImage item={item} className="w-full h-full" />
                      <button
                        onClick={(e) => toggleLike(item.id, e)}
                        aria-label={isLikedItem ? "Bỏ thích" : "Thích"}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${isLikedItem ? "fill-destructive text-destructive" : "text-muted-foreground"}`}
                        />
                      </button>
                      <span className={`absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full font-bold ${cond.cls}`}>
                        {cond.label}
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-[11px] font-medium text-foreground line-clamp-2 leading-snug mb-1.5">
                        {item.title}
                      </p>
                      <p className="text-sm font-black text-primary mb-1.5">
                        {item.price.toLocaleString()}<span className="text-[11px] ml-0.5">π</span>
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-pi-gold text-pi-gold" />
                          <span className="text-[10px] font-semibold text-foreground">{item.rating}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <Eye className="w-2.5 h-2.5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">{item.views}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
