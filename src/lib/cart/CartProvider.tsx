"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import type { CartLine } from "@/lib/checkout/types";
import { cartSubtotal } from "@/lib/checkout";
import * as store from "./store";

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number | null;
  /** False until localStorage has been read, so SSR and first paint agree. */
  hydrated: boolean;
  addLine: (line: CartLine) => void;
  removeLine: (id: string) => void;
  updateQuantity: (id: string, quantity: number, quantityLabel: string) => void;
  clear: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // The cart lives in an external store (localStorage). See ./store.ts for why.
  const { lines, hydrated } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );

  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll only while the drawer is open, restoring the prior value.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const addLine = useCallback((line: CartLine) => {
    store.addLine(line);
    setIsOpen(true);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      itemCount: lines.length,
      subtotal: cartSubtotal(lines),
      hydrated,
      addLine,
      removeLine: store.removeLine,
      updateQuantity: store.updateQuantity,
      clear: store.clear,
      isOpen,
      openCart,
      closeCart,
    }),
    [lines, hydrated, isOpen, addLine, openCart, closeCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>.");
  }
  return context;
}
