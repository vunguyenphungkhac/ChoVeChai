"use client";

import { usePiAuth } from "@/contexts/pi-auth-context";
import { AlertTriangle, RefreshCw, ShieldCheck } from "lucide-react";

export function AuthLoadingScreen() {
  const { authMessage, hasError, reinitialize } = usePiAuth();

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-surface-1 px-6">
      <div className="w-full max-w-xs text-center space-y-7">

        {/* Logo */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/30">
              <span className="text-primary-foreground font-black text-4xl leading-none">π</span>
            </div>
          </div>
          <div>
            <h1 className="text-[1.85rem] font-black text-foreground tracking-tight">ChoVeChai</h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              Chợ đồ cũ · Thanh toán bằng Pi
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4">
          {["10K+ SP", "5K+ ND", "Pi Secure"].map((label, i) => (
            <div key={label} className="flex items-center gap-1">
              {i === 2 && <ShieldCheck className="w-3 h-3 text-success" strokeWidth={2} />}
              <span className="text-[11px] font-semibold text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        {hasError ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-destructive" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Xác thực thất bại</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed px-2">{authMessage}</p>
              </div>
            </div>
            <button
              onClick={reinitialize}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/25 active:scale-95 transition-all"
            >
              <RefreshCw className="w-4 h-4" strokeWidth={2} />
              Thử lại
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-center">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-border" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{authMessage}</p>
              <p className="text-xs text-muted-foreground mt-1">Vui lòng đợi trong giây lát...</p>
            </div>
          </div>
        )}

        <p className="text-[11px] text-muted-foreground">Kết nối bảo mật với Pi Network</p>
      </div>
    </div>
  );
}
