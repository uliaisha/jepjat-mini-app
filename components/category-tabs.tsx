"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeButtonRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const button = activeButtonRef.current;
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      const scrollLeft =
        button.offsetLeft - containerRect.width / 2 + buttonRect.width / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeCategory]);

  return (
    <div className="pb-3">
      <p className="mb-3 px-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Выберите категорию:
      </p>
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto px-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            ref={activeCategory === category.id ? activeButtonRef : null}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              activeCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
