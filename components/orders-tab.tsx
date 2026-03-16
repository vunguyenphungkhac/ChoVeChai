"use client";

import { useState } from "react";
import {
  Clock, CheckCircle2, XCircle,
  ShoppingBag, Tag, ChevronRight, Truck, ArrowRight,
} from "lucide-react";
import type { Order, Listing } from "@/lib/types";
import { ORDERS } from "@/lib/mock-data";

type TabType = "buying" | "selling";

type OrderStatus = "pending" | "confirmed" | "shipping" | "completed" | "cancelled";

const STATUS_CFG: Record<
  OrderStatus,
  {
    label: string;
    textCls: string;
    bgCls: string;
    borderCls: string;
    Icon: React.ElementType;
    hint: string;
    step: number; // 0-3 for the progress stepper; -1 = cancelled
  }
> = {
  pending: {
    label:     "Chờ xác nhận",
    textCls:   "text-pi-gold",
    bgCls:     "bg-pi-gold-soft",
    borderCls: "border-l-pi-gold",
    Icon:      Clock,
    hint:      "Người bán sẽ xác nhận trong 24h",
    step:      0,
  },
  confirmed: {
    label:     "Đã xác nhận",
    textCls:   "text-primary",
    bgCls:     "bg-brand-soft",
    borderCls: "border-l-primary",
    Icon:      CheckCircle2,
    hint:      "Chờ người bán giao hàng",
    step:      1,
  },
  shipping: {
    label:     "Đang giao hàng",
    textCls:   "text-info",
    bgCls:     "bg-info-soft",
    borderCls: "border-l-info",
    Icon:      Truck,
    hint:      "Dự kiến nhận trong 1–2 ngày",
    step:      2,
  },
  completed: {
    label:     "Hoàn thành",
    textCls:   "text-success",
    bgCls:     "bg-success-soft",
    borderCls: "border-l-success",
    Icon:      CheckCircle2,
    hint:      "Giao dịch thành công",
    step:      3,
  },
  cancelled: {
    label:     "Đã huỷ",
    textCls:   "text-destructive",
    bgCls:     "bg-destructive/10",
    borderCls: "border-l-destructive",
    Icon:      XCircle,
    hint:      "Giao dịch đã bị huỷ",
    step:      -1,
  },
} as const;

const STEPS = ["Đặt hàng", "Xác nhận", "Giao hàng", "Hoàn tất"];

function OrderProgressStepper({ status }: { status: OrderStatus }) {
  const cfg        = STATUS_CFG[status];
  const currentStep = cfg.step;

  if (currentStep === -1) return null; // cancelled — don't show stepper

  return (
    <div className="px-4 pb-3 pt-1">
      <div className="flex items-center">
        {STEPS.map((label, i) => {
          const done   = i <= currentStep;
          const active = i === currentStep;
          const isLast = i === STEPS.length - 1;

          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              {/* Circle */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    done
                      ? active
                        ? "bg-primary ring-2 ring-primary/30"
                        : "bg-primary"
                      : "bg-border"
                  }`}
                >
                  {done && !active && (
                    <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {active && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
                <span className={`text-[9px] font-semibold whitespace-nowrap leading-none ${done ? "text-primary" : "text-muted-foreground"}`}>
                  {label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 h-0.5 mx-1 mb-3 rounded-full overflow-hidden bg-border">
                  <div
                    className={`h-full bg-primary transition-all duration-500 ${i < currentStep ? "w-full" : "w-0"}`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const cfg  = STATUS_CFG[order.status];
  const Icon = cfg.Icon;
  const isActive = ["pending", "confirmed", "shipping"].includes(order.status);

  return (
    <button className={`w-full bg-card rounded-2xl border border-border border-l-4 ${cfg.borderCls} shadow-sm text-left active:scale-[0.98] transition-transform overflow-hidden`}>
      {/* Main row */}
      <div className="flex items-center gap-3.5 p-4 pb-3">
        <img
          src={order.image}
          alt={order.title}
          className="w-[3.5rem] h-[3.5rem] rounded-xl object-cover bg-surface-3 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground line-clamp-1">{order.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            {order.type === "buying" ? `Người bán: ${order.counterparty}` : `Người mua đặt hàng`}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{order.date}</p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <p className="text-base font-black text-primary leading-none">
            {order.price}<span className="text-[11px] ml-0.5">π</span>
          </p>
          <ChevronRight className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
        </div>
      </div>

      {/* Progress stepper for active buying orders */}
      {order.type === "buying" && isActive && (
        <OrderProgressStepper status={order.status} />
      )}

      {/* Status footer */}
      <div className={`flex items-center justify-between px-4 py-2.5 ${cfg.bgCls}`}>
        <div className="flex items-center gap-1.5">
          <Icon className={`w-3.5 h-3.5 ${cfg.textCls}`} strokeWidth={2} />
          <span className={`text-xs font-bold ${cfg.textCls}`}>{cfg.label}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground font-medium">{cfg.hint}</span>
          {(order.status === "confirmed" || order.status === "shipping") && (
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
          )}
        </div>
      </div>
    </button>
  );
}

interface OrdersTabProps {
  onViewListing?: (listing: Listing) => void;
}

export function OrdersTab({ onViewListing }: OrdersTabProps) {
  const [activeTab, setActiveTab] = useState<TabType>("buying");

  const orders  = ORDERS.filter((o) => o.type === activeTab);
  const bCount  = ORDERS.filter((o) => o.type === "buying").length;
  const sCount  = ORDERS.filter((o) => o.type === "selling").length;

  const totalCompleted = ORDERS
    .filter((o) => o.type === activeTab && o.status === "completed")
    .reduce((sum, o) => sum + o.price, 0);

  const activeCount = ORDERS.filter(
    (o) => o.type === activeTab && ["pending", "confirmed", "shipping"].includes(o.status)
  ).length;

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar bg-surface-1 pb-nav">

      {/* Header */}
      <header className="bg-primary px-4 pt-11 pb-5">
        <h1 className="text-primary-foreground text-[1.65rem] font-black tracking-tight">Đơn hàng</h1>
        <p className="text-primary-foreground/60 text-xs mt-1 font-medium">
          Theo dõi tất cả giao dịch Pi của bạn
        </p>
      </header>

      {/* Pi wallet summary */}
      <div className="px-4 py-4">
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="flex items-center gap-3.5 p-4">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-black text-2xl leading-none">π</span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium">Ví Pi Network</p>
              <p className="text-xl font-black text-foreground">—</p>
            </div>
            <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm shadow-primary/20 active:scale-95 transition-all">
              Nạp Pi
            </button>
          </div>
          {(totalCompleted > 0 || activeCount > 0) && (
            <div className="border-t border-border px-4 py-3 flex items-center justify-between bg-surface-1">
              <div className="text-center">
                <p className="text-[11px] text-muted-foreground font-medium">Hoàn thành</p>
                <p className="text-sm font-black text-success">{totalCompleted} π</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="text-[11px] text-muted-foreground font-medium">Đang xử lý</p>
                <p className="text-sm font-black text-primary">{activeCount} đơn</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="text-[11px] text-muted-foreground font-medium">Tổng đơn</p>
                <p className="text-sm font-black text-foreground">{orders.length}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tab switcher */}
      <div className="px-4 pb-4">
        <div className="flex bg-secondary rounded-2xl p-1">
          {(["buying", "selling"] as const).map((tab) => {
            const isActive = activeTab === tab;
            const count    = tab === "buying" ? bCount : sCount;
            const Icon     = tab === "buying" ? ShoppingBag : Tag;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                {tab === "buying" ? "Đang mua" : "Đang bán"}
                <span
                  className={`text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ${
                    isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders list */}
      <div className="flex-1 px-4 pb-6 space-y-3">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-brand-soft flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-primary" strokeWidth={1.75} />
            </div>
            <p className="text-sm font-bold text-foreground">
              Chưa có đơn {activeTab === "buying" ? "mua" : "bán"}
            </p>
            <p className="text-xs text-muted-foreground text-center max-w-[220px] leading-relaxed">
              {activeTab === "buying"
                ? "Khám phá hàng ngàn sản phẩm và mua bằng Pi"
                : "Đăng bán ngay để kết nối với người mua Pi"}
            </p>
          </div>
        ) : (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
}
