"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Clock } from "lucide-react";
import { CategoryTabs } from "@/components/category-tabs";
import { MenuItemCard } from "@/components/menu-item-card";
import { CartButton } from "@/components/cart-button";
import { useCartStore } from "@/lib/store/cart-store";
import type { Category, MenuItem, RestaurantInfo } from "@/lib/types";

interface HomeContentProps {
  categories: Category[];
  menuItems: MenuItem[];
  restaurantInfo: RestaurantInfo | null;
}

function isOpen(openTime?: string | null, closeTime?: string | null): boolean {
  if (!openTime || !closeTime) return true;
  
  try {
    const now = new Date();
    const [openHour, openMin] = openTime.split(":").map(Number);
    const [closeHour, closeMin] = closeTime.split(":").map(Number);

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;

    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  } catch {
    return true;
  }
}

export function HomeContent({
  categories,
  menuItems,
  restaurantInfo,
}: HomeContentProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isScrollingFromClick = useRef(false);
  const { getTotalItems } = useCartStore();
  const hasItems = getTotalItems() > 0;

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    isScrollingFromClick.current = true;

    const element = sectionRefs.current[categoryId];
    if (element) {
      const headerHeight = 220;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setTimeout(() => {
        isScrollingFromClick.current = false;
      }, 500);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingFromClick.current) return;

      const headerHeight = 240;

      for (const category of categories) {
        const element = sectionRefs.current[category.id];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= headerHeight && rect.bottom > headerHeight) {
            setActiveCategory(category.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  const getItemsByCategory = (categoryId: string) => {
    return menuItems.filter((item) => item.category_id === categoryId);
  };

  const restaurantOpen = restaurantInfo
    ? isOpen(restaurantInfo.open_time, restaurantInfo.close_time)
    : true;

  return (
    <div className={`min-h-screen bg-background ${hasItems ? "pb-28" : "pb-4"}`}>
      {/* Restaurant Header */}
      {restaurantInfo && (
        <div className="bg-card p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">
                {restaurantInfo.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {restaurantInfo.address}
              </p>
              {(restaurantInfo.open_time || restaurantInfo.working_hours) && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {restaurantInfo.open_time && restaurantInfo.close_time 
                      ? `${restaurantInfo.open_time} - ${restaurantInfo.close_time}`
                      : restaurantInfo.working_hours}
                  </span>
                  <span
                    className={`font-medium ${
                      restaurantOpen ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {restaurantOpen ? "Открыто" : "Закрыто"}
                  </span>
                </div>
              )}
            </div>
            {restaurantInfo.logo_url && (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-background ring-2 ring-border">
                <Image
                  src={restaurantInfo.logo_url || "/placeholder.svg"}
                  alt={restaurantInfo.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Tabs - Sticky */}
      <div className="sticky top-0 z-40 bg-background pt-4">
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Menu Items by Category */}
      <main className="px-4 pt-2">
        {categories.map((category) => {
          const categoryItems = getItemsByCategory(category.id);
          if (categoryItems.length === 0) return null;

          return (
            <section
              key={category.id}
              ref={(el) => {
                sectionRefs.current[category.id] = el;
              }}
              className="mb-6"
            >
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                {category.name}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {categoryItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Floating Cart Button */}
      <CartButton />
    </div>
  );
}
