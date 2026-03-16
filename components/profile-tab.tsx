"use client";

import {
  Star, ShieldCheck, Package, Heart, Settings,
  HelpCircle, LogOut, ChevronRight, Bell,
  Trophy, TrendingUp, MessageCircle, Wallet,
  MapPin, BarChart3, Users, Grid3x3,
} from "lucide-react";

import { LISTINGS } from "@/lib/mock-data";
import { usePiAuth } from "@/contexts/pi-auth-context"; // ⭐ thêm dòng này

// Show first 3 of user's "listed" items as a mini preview
const MY_LISTINGS = LISTINGS.slice(0, 3);

const CAT_IMAGE_BG: Record<string, { bg: string; icon: string }> = {
  electronics: { bg: "bg-sky-100", icon: "📱" },
  fashion: { bg: "bg-rose-100", icon: "👟" },
  home: { bg: "bg-amber-100", icon: "🛋️" },
  vehicles: { bg: "bg-zinc-200", icon: "🏍️" },
  sports: { bg: "bg-green-100", icon: "⚽" },
  books: { bg: "bg-violet-100", icon: "📚" },
  default: { bg: "bg-surface-3", icon: "📦" },
};

const STATS = [
  { label: "Đã bán", value: "12", unit: "", Icon: Package },
  { label: "Đánh giá", value: "4.9", unit: "", Icon: Star },
  { label: "Pi nhận", value: "680", unit: "π", Icon: TrendingUp },
];

const MENU_ITEMS = [
  {
    section: "Hoạt động",
    items: [
      { Icon: Package, label: "Tin đăng của tôi", sublabel: "3 tin đang hiển thị" },
      { Icon: Heart, label: "Đã lưu", sublabel: "8 sản phẩm yêu thích" },
      { Icon: MessageCircle, label: "Tin nhắn", sublabel: "2 tin nhắn chưa đọc", badge: "2" },
      { Icon: Trophy, label: "Thành tích", sublabel: "Pioneer cấp 2" },
    ],
  },
  {
    section: "Tài khoản",
    items: [
      { Icon: Wallet, label: "Ví Pi của tôi" },
      { Icon: Bell, label: "Thông báo", badge: "3" },
      { Icon: MapPin, label: "Địa chỉ đã lưu" },
      { Icon: BarChart3, label: "Thống kê bán hàng" },
      { Icon: Users, label: "Giới thiệu bạn bè", sublabel: "Nhận thưởng Pi" },
      { Icon: Settings, label: "Cài đặt" },
    ],
  },
  {
    section: "Hỗ trợ",
    items: [
      { Icon: HelpCircle, label: "Trợ giúp & FAQ" },
      { Icon: LogOut, label: "Đăng xuất", danger: true },
    ],
  },
];

export function ProfileTab() {

  const { username } = usePiAuth(); // ⭐ lấy username từ Pi

  return (
    <div className="flex flex-col bg-surface-1 overflow-y-auto no-scrollbar pb-nav">

      {/* Header */}
      <header className="bg-primary px-4 pt-11 pb-6">
        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-2xl bg-brand-deep flex items-center justify-center shrink-0 shadow-lg ring-2 ring-white/30">
            <span className="text-primary-foreground text-2xl font-black">
              {username ? username.charAt(0).toUpperCase() : "P"}
            </span>
          </div>

          <div className="flex-1 min-w-0">

            {/* ⭐ HIỂN THỊ USERNAME PI */}
            <h1 className="text-primary-foreground text-lg font-black tracking-tight truncate">
              {username ?? "Pi User"}
            </h1>

            <div className="flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary-foreground/70" strokeWidth={2} />
              <span className="text-primary-foreground/70 text-xs font-medium">
                Pioneer đã xác minh
              </span>
            </div>

            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-primary-foreground/70 text-primary-foreground/70" />
              ))}
              <span className="text-primary-foreground/80 text-xs font-bold ml-1">4.9</span>
              <span className="text-primary-foreground/50 text-xs ml-0.5">· 38 đánh giá</span>
            </div>

          </div>

          <button className="px-3.5 py-1.5 rounded-full border border-primary-foreground/30 text-primary-foreground text-xs font-bold shrink-0 active:opacity-70 transition-opacity">
            Sửa hồ sơ
          </button>

        </div>
      </header>

      {/* Stats */}
      <div className="px-4 pt-4">
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="grid grid-cols-3">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center py-4 gap-1 ${i < STATS.length - 1 ? "border-r border-border" : ""}`}
              >
                <stat.Icon className="w-4 h-4 text-primary mb-0.5" strokeWidth={1.75} />
                <p className="text-base font-black text-foreground leading-none">
                  {stat.value}
                  {stat.unit && <span className="text-xs">{stat.unit}</span>}
                </p>
                <p className="text-[11px] text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wallet */}
      <div className="px-4 mt-4">
        <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3.5 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-black text-xl leading-none">π</span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-medium">Ví Pi Network</p>
            <p className="text-sm font-bold text-foreground mt-0.5">
              Đã kết nối thành công
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-success-soft shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            <span className="text-xs font-bold text-success">Hoạt động</span>
          </div>
        </div>
      </div>

      {/* (phần còn lại giữ nguyên hoàn toàn) */}

      <div className="text-center py-4 pb-2">
        <p className="text-xs font-bold text-muted-foreground">ChoVeChai v1.0.0</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Được hỗ trợ bởi Pi Network
        </p>
      </div>

    </div>
  );
}