import type React from "react";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { AppWrapper } from "@/components/app-wrapper";
import "./globals.css";
import { PiAuthProvider } from "@/contexts/pi-auth-context";

export const metadata: Metadata = {
  title: "Made with App Studio",
  description:
    "ChoVeChai — Chợ mua bán đồ cũ bằng Pi. Giao dịch an toàn, cộng đồng Pi Network.",
  generator: "v0.app",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#7c3a00",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>

        <PiAuthProvider>
          {children}
        </PiAuthProvider>

      </body>
    </html>
  );
}