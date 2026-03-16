"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type PiAuthContextType = {
  isAuthenticated: boolean;
  authMessage: string;
  username: string | null;
  login: () => Promise<void>;
};

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

export function PiAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMessage, setAuthMessage] = useState("Initializing Pi...");
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    initializePi();
  }, []);

  async function initializePi() {
    try {
      if (typeof window === "undefined") return;

      const Pi = (window as any).Pi;

      if (!Pi) {
        setAuthMessage("Please open this app inside Pi Browser");
        return;
      }

      Pi.init({
        version: "2.0",
        sandbox: true,
      });

      await login();
    } catch (error) {
      console.error(error);
      setAuthMessage("Pi initialization failed");
    }
  }

  async function login() {
    try {
      const Pi = (window as any).Pi;

      if (!Pi) return;

      console.log("PI LOGIN VERSION 2 ******************************");

      setAuthMessage("Logging in...");

      const auth = await Pi.authenticate(
        ["username"],
        function onIncompletePaymentFound(payment: any) {
          console.log("Incomplete payment found:", payment);
        }
      );

      if (auth?.user?.username) {
        setUsername(auth.user.username);
      }

      console.log(auth.user);

      setIsAuthenticated(true);
      setAuthMessage("Login successful");
    } catch (error) {
      console.error(error);
      setAuthMessage("Login failed");
    }
  }

  return (
    <PiAuthContext.Provider
      value={{
        isAuthenticated,
        authMessage,
        username,
        login,
      }}
    >
      {children}
    </PiAuthContext.Provider>
  );
}

export function usePiAuth() {
  const context = useContext(PiAuthContext);
  if (!context) {
    throw new Error("usePiAuth must be used inside PiAuthProvider");
  }
  return context;
}