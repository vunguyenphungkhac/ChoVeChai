"use client";

import { useState, useEffect } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { HomeTab } from "@/components/home-tab";
import { ExploreTab } from "@/components/explore-tab";
import { SellTab } from "@/components/sell-tab";
import { OrdersTab } from "@/components/orders-tab";
import { ProfileTab } from "@/components/profile-tab";
import { ListingDetail } from "@/components/listing-detail";
import type { Listing } from "@/lib/types";
import { usePiAuth } from "@/contexts/pi-auth-context";
import { useRouter } from "next/navigation";

export type AppTab = "home" | "explore" | "sell" | "orders" | "profile";

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, loginWithPi } = usePiAuth();
  const router = useRouter();

  // AUTO LOGIN KHI APP MỞ
  useEffect(() => {
    async function autoLogin() {
      try {
        await loginWithPi(); // gọi Pi SDK
      } catch (err) {
        console.error("Pi auto login failed", err);
      } finally {
        setLoading(false);
      }
    }

    autoLogin();
  }, [loginWithPi]);

  // nếu không login được thì chuyển sang /login
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  function openListing(listing: Listing) {
    setSelectedListing(listing);
  }

  function closeListing() {
    setSelectedListing(null);
  }

  function changeTab(tab: AppTab) {
    setSelectedListing(null);
    setActiveTab(tab);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        Loading Pi account...
      </div>
    );
  }

  if (selectedListing) {
    return (
      <div className="max-w-md mx-auto min-h-dvh bg-background">
        <ListingDetail listing={selectedListing} onBack={closeListing} />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-dvh bg-surface-1 flex flex-col">
      <main className="flex-1 overflow-hidden">
        {activeTab === "home" && <HomeTab onViewListing={openListing} />}
        {activeTab === "explore" && <ExploreTab onViewListing={openListing} />}
        {activeTab === "sell" && <SellTab />}
        {activeTab === "orders" && <OrdersTab onViewListing={openListing} />}
        {activeTab === "profile" && <ProfileTab />}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={changeTab} />
    </div>
  );
}