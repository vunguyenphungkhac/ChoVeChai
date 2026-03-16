"use client";

import { useState } from "react";
import {
  ArrowLeft, Heart, Share2, MapPin, Star,
  ShieldCheck, MessageCircle, ShoppingCart,
  ChevronRight, Clock, CheckCircle2, AlertCircle, Eye, Flame,
  Camera,
} from "lucide-react";
import type { Listing } from "@/lib/types";
import { LISTINGS, CONDITION_CFG } from "@/lib/mock-data";

// Multiple icon variants per category
const CAT_ICONS: Record<string, string[]> = {
  electronics: ["📱", "💻", "📷", "🎧", "🖥️", "⌚"],
  fashion:     ["👟", "👗", "🧥", "👜", "🧢", "👔"],
  home:        ["🛋️", "🪑", "🛏️", "🪴", "🍳", "🧹"],
  vehicles:    ["🏍️", "🚗", "🛵", "🚲", "🏎️", "🛺"],
  sports:      ["⚽", "🎾", "🏀", "🚴", "🏊", "🎿"],
  books:       ["📚", "📖", "🎨", "📝", "🗂️", "📒"],
  default:     ["📦", "🎁", "🏷️", "📫", "🪣", "🔧"],
};

const CAT_BG: Record<string, { bg: string }> = {
  electronics: { bg: "bg-sky-100"    },
  fashion:     { bg: "bg-rose-100"   },
  home:        { bg: "bg-amber-100"  },
  vehicles:    { bg: "bg-zinc-200"   },
  sports:      { bg: "bg-green-100"  },
  books:       { bg: "bg-violet-100" },
  default:     { bg: "bg-surface-3"  },
};

function getItemIcon(item: Listing, slotOffset = 0): string {
  const icons = CAT_ICONS[item.category] ?? CAT_ICONS.default;
  return icons[(parseInt(item.id, 10) + slotOffset) % icons.length];
}

interface ListingDetailProps {
  listing: Listing;
  onBack: () => void;
}

type BuyState = "idle" | "loading" | "success" | "error";

export function ListingDetail({ listing, onBack }: ListingDetailProps) {
  const [isLiked,   setIsLiked]   = useState(listing.isLiked);
  const [likeCount, setLikeCount] = useState(listing.likes);
  const [buyState,  setBuyState]  = useState<BuyState>("idle");
  const [activeImg, setActiveImg] = useState(0);

  const totalSlots     = 3;
  const catCfg         = CAT_BG[listing.category] ?? CAT_BG.default;
  const cond           = CONDITION_CFG[listing.condition];
  const sellerInitial  = (listing.sellerAvatar ?? listing.seller.charAt(0)).slice(0, 2);
  const similar        = LISTINGS.filter((l) => l.category === listing.category && l.id !== listing.id).slice(0, 4);

  function handleLike() {
    setIsLiked((v) => {
      setLikeCount((c) => (v ? c - 1 : c + 1));
      return !v;
    });
  }

  async function handleBuy() {
    setBuyState("loading");
    try {
      await new Promise((r) => setTimeout(r, 1800));
      setBuyState("success");
    } catch {
      setBuyState("error");
    }
  }

  return (
    <div className="flex flex-col min-h-dvh bg-surface-1">

      {/* Hero image gallery */}
      <div className="relative bg-surface-3 shrink-0">
        <div className={`w-full h-[17rem] ${catCfg.bg} flex flex-col items-center justify-center gap-3`}>
          <span className="text-8xl leading-none select-none">{getItemIcon(listing, activeImg)}</span>
          <div className="flex items-center gap-1.5 bg-black/10 rounded-full px-3 py-1">
            <Camera className="w-3 h-3 text-foreground/50" strokeWidth={2} />
            <span className="text-[11px] font-medium text-foreground/50">
              Ảnh {activeImg + 1} / {totalSlots}
            </span>
          </div>
        </div>

        {/* Dot navigation */}
        <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex gap-1.5">
          {Array.from({ length: totalSlots }).map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              aria-label={`Ảnh ${i + 1}`}
              className={`transition-all rounded-full ${
                i === activeImg
                  ? "w-5 h-1.5 bg-primary shadow-sm"
                  : "w-1.5 h-1.5 bg-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* Overlay controls */}
        <div className="absolute inset-0 flex items-start justify-between px-4 pt-12 pointer-events-none">
          <button
            onClick={onBack}
            aria-label="Quay lại"
            className="pointer-events-auto w-10 h-10 rounded-2xl bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-md"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" strokeWidth={2.25} />
          </button>
          <div className="flex gap-2 pointer-events-auto">
            <button
              aria-label="Chia sẻ"
              className="w-10 h-10 rounded-2xl bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-md"
            >
              <Share2 className="w-4 h-4 text-foreground" strokeWidth={2} />
            </button>
            <button
              onClick={handleLike}
              aria-label={isLiked ? "Bỏ thích" : "Thích"}
              className="w-10 h-10 rounded-2xl bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-md"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${isLiked ? "fill-destructive text-destructive" : "text-foreground"}`}
              />
            </button>
          </div>
        </div>

        {/* Condition + Hot badges */}
        <div className="absolute top-14 right-4 flex flex-col items-end gap-1.5 pointer-events-none">
          <span className={`text-[10px] px-2.5 py-1 rounded-full shadow-sm font-bold ${cond.cls}`}>
            {cond.label}
          </span>
          {listing.isHot && (
            <span className="flex items-center gap-1 bg-destructive text-destructive-foreground text-[10px] font-black px-2 py-1 rounded-full shadow-sm">
              <Flame className="w-2.5 h-2.5 fill-current" /> HOT
            </span>
          )}
        </div>

        {/* Posted time */}
        {listing.postedAt && (
          <div className="absolute bottom-8 right-3">
            <div className="flex items-center gap-1 bg-card/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
              <Clock className="w-2.5 h-2.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium">{listing.postedAt}</span>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail strip — each thumb shows a different icon variant */}
      <div className="bg-card border-b border-border px-4 py-3 flex gap-2">
        {Array.from({ length: totalSlots }).map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveImg(i)}
            className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${catCfg.bg} flex items-center justify-center ${
              i === activeImg ? "border-primary shadow-sm" : "border-border"
            }`}
          >
            <span className="text-xl leading-none select-none">{getItemIcon(listing, i)}</span>
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-32 space-y-4">

        {/* Title + Price */}
        <div>
          <div className="flex items-start gap-3 mb-3">
            <h1 className="flex-1 text-[1.25rem] font-black text-foreground leading-snug tracking-tight text-balance">
              {listing.title}
            </h1>
            <div className="shrink-0 text-right">
              <p className="text-[1.75rem] font-black text-primary leading-none">
                {listing.price.toLocaleString()}
                <span className="text-lg ml-0.5">π</span>
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">Pi Network</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground font-medium">{listing.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-pi-gold text-pi-gold" />
              <span className="text-xs font-bold text-foreground">{listing.rating}</span>
              <span className="text-xs text-muted-foreground">({listing.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{listing.views} lượt xem</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{likeCount} thích</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <h2 className="text-sm font-black text-foreground mb-2">Mô tả sản phẩm</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
        </div>

        {/* Seller card */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <h2 className="text-sm font-black text-foreground mb-3">Người bán</h2>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-brand-soft flex items-center justify-center shrink-0">
              <span className="text-sm font-black text-primary">{sellerInitial}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground">{listing.seller}</p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <div className="flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3 text-success" strokeWidth={2} />
                  <span className="text-[11px] text-muted-foreground">Đã xác minh</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-pi-gold text-pi-gold" />
                  <span className="text-[11px] font-bold text-foreground">{listing.sellerRating}</span>
                </div>
                <span className="text-[11px] text-muted-foreground">{listing.sellerSales} giao dịch</span>
              </div>
            </div>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary text-xs font-semibold text-foreground active:opacity-70 shrink-0">
              Hồ sơ <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Pi escrow trust */}
        <div className="flex items-start gap-3 bg-brand-soft rounded-2xl p-3.5 border border-primary/15">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-primary-foreground font-black text-lg leading-none">π</span>
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Giao dịch an toàn qua Pi</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
              Pi được giữ an toàn trong ví escrow cho đến khi bạn xác nhận nhận hàng.
            </p>
          </div>
        </div>

        {/* Buy feedback */}
        {buyState === "success" && (
          <div className="bg-success-soft rounded-2xl p-4 border border-success/20 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <p className="text-sm font-bold text-success">Đặt mua thành công!</p>
              <p className="text-xs text-success/80 mt-0.5 leading-relaxed">
                Người bán sẽ xác nhận trong 24h. Pi giữ an toàn cho đến khi nhận hàng.
              </p>
            </div>
          </div>
        )}
        {buyState === "error" && (
          <div className="bg-destructive/10 rounded-2xl p-4 border border-destructive/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <p className="text-sm font-bold text-destructive">Giao dịch thất bại</p>
              <p className="text-xs text-destructive/70 mt-0.5">Vui lòng kiểm tra ví Pi và thử lại.</p>
            </div>
          </div>
        )}

        {/* Similar items */}
        {similar.length > 0 && (
          <section>
            <h2 className="text-sm font-black text-foreground mb-3">Sản phẩm tương tự</h2>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
              {similar.map((item) => {
                const sCfg  = CAT_BG[item.category] ?? CAT_BG.default;
                const sCond = CONDITION_CFG[item.condition];
                const sIcon = getItemIcon(item);
                return (
                  <div
                    key={item.id}
                    className="flex-shrink-0 w-[9rem] bg-card rounded-2xl overflow-hidden border border-border shadow-sm"
                  >
                    <div className={`w-full h-24 ${sCfg.bg} flex items-center justify-center`}>
                      <span className="text-3xl leading-none select-none">{sIcon}</span>
                    </div>
                    <div className="p-2.5">
                      <p className="text-[10px] font-medium text-foreground line-clamp-2 leading-snug mb-1">
                        {item.title}
                      </p>
                      <p className="text-xs font-black text-primary">
                        {item.price.toLocaleString()}<span className="text-[10px] ml-0.5">π</span>
                      </p>
                      <span className={`inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold ${sCond.cls}`}>
                        {sCond.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Fixed action bar */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card/95 backdrop-blur-md border-t border-border px-4 pt-3 pb-6 flex gap-3 shadow-[0_-4px_24px_0_rgba(0,0,0,0.08)]"
        style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
      >
        <button
          aria-label="Nhắn tin người bán"
          className="w-12 h-12 rounded-xl border border-border bg-secondary flex items-center justify-center shrink-0 active:scale-95 transition-all"
        >
          <MessageCircle className="w-5 h-5 text-foreground" strokeWidth={1.75} />
        </button>
        <button
          onClick={handleBuy}
          disabled={buyState === "loading" || buyState === "success"}
          className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-black text-sm shadow-lg shadow-primary/25 disabled:opacity-55 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {buyState === "loading" ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Đang xử lý...
            </>
          ) : buyState === "success" ? (
            <>
              <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
              Đã đặt mua
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" strokeWidth={2} />
              Mua với {listing.price.toLocaleString()} π
            </>
          )}
        </button>
      </div>
    </div>
  );
}
