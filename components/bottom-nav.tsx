"use client";

import type React from "react";
import { Home, Compass, Plus, ShoppingBag, User } from "lucide-react";
import type { AppTab } from "@/app/page";

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const NAV_ITEMS: { id: AppTab; label: string; Icon: React.ElementType }[] = [
  { id: "home",    label: "Trang chủ", Icon: Home },
  { id: "explore", label: "Khám phá",  Icon: Compass },
  { id: "sell",    label: "Đăng bán",  Icon: Plus },
  { id: "orders",  label: "Đơn hàng",  Icon: ShoppingBag },
  { id: "profile", label: "Cá nhân",   Icon: User },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      aria-label="Điều hướng chính"
      className="sticky bottom-0 z-50 bg-card border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-end justify-around px-1 pt-1.5 pb-2.5">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          const isSell   = id === "sell";

          if (isSell) {
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                className="flex flex-col items-center gap-1 -mt-5"
              >
                <span
                  className={`w-[3.25rem] h-[3.25rem] rounded-[1.1rem] flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                    isActive
                      ? "bg-brand-deep shadow-brand/30"
                      : "bg-primary shadow-primary/25"
                  }`}
                >
                  <Icon className="w-[1.3rem] h-[1.3rem] text-primary-foreground" strokeWidth={2.5} />
                </span>
                <span
                  className={`text-[10px] font-semibold leading-none mt-0.5 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-col items-center gap-1 flex-1 pt-1 transition-opacity active:opacity-50"
            >
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-xl transition-colors ${
                  isActive ? "bg-brand-soft" : ""
                }`}
              >
                <Icon
                  className={`w-[1.125rem] h-[1.125rem] transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                  strokeWidth={isActive ? 2.25 : 1.75}
                />
              </span>
              <span
                className={`text-[10px] leading-none transition-colors ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground font-medium"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
