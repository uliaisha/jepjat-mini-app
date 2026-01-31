"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store/cart-store";

export function CartButton() {
  const { getTotalItems, getTotalPrice } = useCartStore();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 bg-gradient-to-t from-background via-background to-transparent">
      <Link
        href="/cart"
        className="flex h-14 w-full items-center justify-center rounded-xl bg-primary text-lg font-semibold text-primary-foreground shadow-lg transition-transform active:scale-[0.98]"
      >
        Оформить заказ – {totalPrice} сом
      </Link>
    </div>
  );
}
