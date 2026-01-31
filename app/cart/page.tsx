"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type OrderType = "delivery" | "pickup" | "preorder";

const DELIVERY_FEE = 190;

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>("delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+996");
  const [address, setAddress] = useState("");
  const [utensilsCount, setUtensilsCount] = useState(1);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse text-muted-foreground">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 flex items-center gap-3 bg-background px-4 py-3">
          <button onClick={() => router.back()} className="text-foreground">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <span className="text-lg font-medium text-foreground">Назад</span>
        </header>
        <div className="flex flex-col items-center justify-center h-[60vh] px-4">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Корзина пуста
          </h2>
          <p className="text-muted-foreground text-center mb-6">
            Добавьте блюда из меню, чтобы оформить заказ
          </p>
          <Button onClick={() => router.push("/")}>Перейти в меню</Button>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const deliveryFee = orderType === "delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Пожалуйста, введите ваше имя");
      return;
    }
    if (!phone || phone.length < 10) {
      alert("Пожалуйста, введите корректный номер телефона");
      return;
    }
    if (orderType === "delivery" && !address.trim()) {
      alert("Пожалуйста, введите адрес доставки");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            menu_item_id: item.menuItem.id,
            quantity: item.quantity,
            price: item.menuItem.price,
            name: item.menuItem.name,
          })),
          customer_name: name,
          customer_phone: phone,
          customer_address: orderType === "delivery" ? address : null,
          order_type: orderType,
          utensils_count: utensilsCount,
          delivery_fee: deliveryFee,
          total_amount: total,
          comment: comment || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const order = await response.json();
      clearCart();
      router.push(`/order/${order.id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Ошибка при оформлении заказа. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-3 bg-background px-4 py-3 border-b border-border">
        <button onClick={() => router.back()} className="text-foreground">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <span className="text-lg font-medium text-foreground">Назад</span>
      </header>

      <main className="px-4 py-4">
        {/* Cart Items */}
        <div className="space-y-0 divide-y divide-border">
          {items.map((item) => (
            <div key={item.menuItem.id} className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">
                    {item.menuItem.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Итого за блюдо
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.menuItem.id, item.quantity - 1)
                      }
                      className="text-primary text-xl font-medium"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.menuItem.id, item.quantity + 1)
                      }
                      className="text-primary text-xl font-medium"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-foreground font-medium min-w-[80px] text-right">
                    {item.menuItem.price * item.quantity} сом
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-4 space-y-1 text-foreground">
          <p className="font-semibold">Сумма: {subtotal} сом</p>
          {orderType === "delivery" && (
            <p className="text-muted-foreground">
              Доставка: {deliveryFee.toFixed(2)} сом
            </p>
          )}
          <p className="font-bold text-lg">Итого: {total} сом</p>
        </div>

        {/* Order Type */}
        <div className="mt-6">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Тип заказа
          </Label>
          <Select
            value={orderType}
            onValueChange={(value) => setOrderType(value as OrderType)}
          >
            <SelectTrigger className="mt-2 h-12 bg-input border-0">
              <SelectValue placeholder="Выберите тип заказа" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="delivery">Доставка</SelectItem>
              <SelectItem value="pickup">Самовывоз</SelectItem>
              <SelectItem value="preorder">Предзаказ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Address (only for delivery) */}
        {orderType === "delivery" && (
          <div className="mt-4">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Адрес
            </Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="улица, дом, квартира"
              className="mt-2 h-12 bg-input border-0"
            />
            <button className="mt-2 text-sm text-primary">
              Добавить детали для курьера
            </button>
          </div>
        )}

        {/* Utensils Count */}
        <div className="mt-4">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Количество приборов
          </Label>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-xl">🍴</span>
            <div className="flex items-center gap-2 bg-input rounded-lg px-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-foreground"
                onClick={() => setUtensilsCount(Math.max(0, utensilsCount - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center text-foreground font-medium">
                {utensilsCount}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-foreground"
                onClick={() => setUtensilsCount(utensilsCount + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="mt-4">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Имя
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Напишите ваше имя"
            className="mt-2 h-12 bg-input border-0"
          />
        </div>

        {/* Phone */}
        <div className="mt-4">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Номер телефона
          </Label>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+996"
            className="mt-2 h-12 bg-input border-0"
          />
        </div>

        {/* Comment */}
        <div className="mt-4">
          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Комментарий к заведению
          </Label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Можете уточнить детали или пожелания"
            className="mt-2 min-h-[100px] bg-input border-0 resize-none"
          />
        </div>
      </main>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 bg-gradient-to-t from-background via-background to-transparent">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full h-14 text-lg font-semibold rounded-xl"
        >
          {isSubmitting ? "Оформление..." : "Оплатить"}
        </Button>
      </div>
    </div>
  );
}
