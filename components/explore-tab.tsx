"use client";

import { useState } from "react";
import {
  Search, SlidersHorizontal, MapPin, Heart,
  Star, X, Eye, ChevronUp,
} from "lucide-react";
import type { Listing } from "@/lib/types";
import { LISTINGS, CATEGORIES, CONDITION_CFG } from "@/lib/mock-data";

// Multiple icon variants per category for visual distinction
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
  return icons[parseInt(item.id, 10) % icons.length];
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

const SORT_OPTIONS = [
  { id: "newest",     label: "Mới nhất"       },
  { id: "price_asc",  label: "Giá thấp"       },
  { id: "price_desc", label: "Giá cao"         },
  { id: "popular",    label: "Lượt xem nhiều" },
];

interface ExploreTabProps {
  onViewListing: (listing: Listing) => void;
}

export function ExploreTab({ onViewListing }: ExploreTabProps) {
  const [search,      setSearch]      = useState("");
  const [sortBy,      setSortBy]      = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [category,    setCategory]    = useState("all");
  const [maxPrice,    setMaxPrice]    = useState(1000);
  const [liked, setLiked] = useState<Set<string>>(
    new Set(LISTINGS.filter((l) => l.isLiked).map((l) => l.id))
  );

  function toggleLike(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const filtered = LISTINGS.filter((l) => {
    const matchCat    = category === "all" || l.category === category;
    const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase());
    const matchPrice  = l.price <= maxPrice;
    return matchCat && matchSearch && matchPrice;
  }).sort((a, b) => {
    if (sortBy === "price_asc")  return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "popular")    return b.views - a.views;
    return 0;
  });

  const activeFiltersCount = (category !== "all" ? 1 : 0) + (maxPrice < 1000 ? 1 : 0);

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar bg-surface-1 pb-nav">

      {/* Header */}
      <header className="bg-primary px-4 pt-11 pb-4">
        <h1 className="text-primary-foreground text-[1.65rem] font-black tracking-tight mb-3">
          Khám phá
        </h1>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={2} />
            <input
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card rounded-2xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted flex items-center justify-center"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            aria-label="Bộ lọc"
            aria-pressed={showFilters}
            className={`relative w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-colors ${
              showFilters || activeFiltersCount > 0
                ? "bg-card text-primary"
                : "bg-white/15 text-primary-foreground"
            }`}
          >
            <SlidersHorizontal className="w-[1.1rem] h-[1.1rem]" strokeWidth={2} />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-black flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-card border-b border-border px-4 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-black text-foreground">Bộ lọc nâng cao</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setCategory("all"); setMaxPrice(1000); }}
                className="text-xs font-bold text-primary"
              >
                Xóa tất cả
              </button>
              <button
                onClick={() => setShowFilters(false)}
                aria-label="Đóng bộ lọc"
                className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center"
              >
                <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-wider mb-2">Danh mục</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    category === cat.id
                      ? "bg-foreground text-background border-foreground"
                      : "bg-secondary text-muted-foreground border-transparent"
                  }`}
                >
                  <span>{cat.emoji}</span> {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">Giá tối đa</p>
              <span className="text-sm font-black text-primary">{maxPrice.toLocaleString()} π</span>
            </div>
            <input
              type="range"
              min={0}
              max={1000}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-primary h-1.5 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-medium">
              <span>0 π</span><span>1000 π</span>
            </div>
          </div>
        </div>
      )}

      {/* Sort + result count — sticky below filter panel */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-card border-b border-border sticky top-0 z-10">
        <span className="text-xs text-muted-foreground shrink-0">
          <span className="font-bold text-foreground">{filtered.length}</span> kết quả
        </span>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar flex-1 justify-end">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSortBy(opt.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                sortBy === opt.id
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results grid */}
      <div className="flex-1 px-4 py-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-brand-soft flex items-center justify-center">
              <Search className="w-6 h-6 text-primary" strokeWidth={1.75} />
            </div>
            <p className="text-sm font-bold text-foreground">Không tìm thấy sản phẩm</p>
            <p className="text-xs text-muted-foreground text-center max-w-[220px]">
              Thử thay đổi từ khóa hoặc điều chỉnh bộ lọc
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((item) => {
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
                      <div className="flex items-center gap-0.5 max-w-[70px]">
                        <MapPin className="w-2.5 h-2.5 text-muted-foreground shrink-0" />
                        <span className="text-[10px] text-muted-foreground truncate">
                          {item.location.split(",")[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Bottom padding for view count label */}
        {filtered.length > 0 && (
          <p className="text-center text-[11px] text-muted-foreground mt-6 pb-2">
            Hiển thị <span className="font-bold text-foreground">{filtered.length}</span> sản phẩm
          </p>
        )}
      </div>
    </div>
  );
}
