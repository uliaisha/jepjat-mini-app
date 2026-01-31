"use client";

import Image from "next/image";
import { Minus, Plus, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import type { MenuItem } from "@/lib/types";

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { items, addItem, updateQuantity } = useCartStore();

  const cartItem = items.find((i) => i.menuItem.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const bgColor = item.bg_color || "#F5E6D3";

  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-card">
      {/* Image container with colored background */}
      <div
        className="relative aspect-square w-full overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        {item.image_url ? (
          <Image
            src={item.image_url || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-4xl text-muted-foreground/30">🌯</span>
          </div>
        )}

        {/* Spicy badge */}
        {item.is_spicy && (
          <div className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
            <Flame className="h-5 w-5 text-white" fill="currentColor" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-foreground">{item.price}</span>
          <span className="text-lg font-bold text-foreground">сом</span>
        </div>

        {item.unit && (
          <span className="text-xs text-muted-foreground">{item.unit}</span>
        )}

        <h3 className="mt-1 text-sm font-medium text-foreground line-clamp-2">
          {item.name}
        </h3>

        {/* Add/Quantity controls */}
        <div className="mt-auto pt-3">
          {quantity === 0 ? (
            <Button
              onClick={() => addItem(item)}
              className="h-10 w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Добавить
            </Button>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="default"
                size="icon"
                onClick={() => updateQuantity(item.id, quantity - 1)}
                className="h-10 w-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-[2rem] text-center text-lg font-semibold text-foreground">
                {quantity}
              </span>
              <Button
                variant="default"
                size="icon"
                onClick={() => addItem(item)}
                className="h-10 w-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
