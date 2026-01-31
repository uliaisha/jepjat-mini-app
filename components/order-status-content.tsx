"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Clock,
  ChefHat,
  Bike,
  Package,
  XCircle,
  Home,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import type { OrderWithItems, Order } from "@/lib/types";
import { cn } from "@/lib/utils";

interface OrderStatusContentProps {
  order: OrderWithItems;
}

const statusSteps = [
  { key: "pending", label: "Заказ принят", icon: Clock },
  { key: "confirmed", label: "Подтверждён", icon: Check },
  { key: "preparing", label: "Готовится", icon: ChefHat },
  { key: "delivering", label: "В пути", icon: Bike },
  { key: "delivered", label: "Доставлен", icon: Package },
] as const;

type OrderStatus = Order["status"];

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-amber-500",
  confirmed: "bg-blue-500",
  preparing: "bg-orange-500",
  delivering: "bg-primary",
  delivered: "bg-green-500",
  cancelled: "bg-destructive",
};

const orderTypeLabels: Record<string, string> = {
  delivery: "Доставка",
  pickup: "Самовывоз",
  preorder: "Предзаказ",
};

export function OrderStatusContent({
  order: initialOrder,
}: OrderStatusContentProps) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`order-${order.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${order.id}`,
        },
        (payload) => {
          setOrder((prev) => ({ ...prev, ...payload.new }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order.id]);

  const currentStatusIndex = statusSteps.findIndex(
    (s) => s.key === order.status
  );
  const isCancelled = order.status === "cancelled";
  const isDelivered = order.status === "delivered";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center gap-3 bg-background px-4 py-3 border-b border-border">
        <button onClick={() => router.push("/")} className="text-foreground">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <span className="text-lg font-medium text-foreground">
          Заказ #{order.id.slice(0, 8)}
        </span>
      </header>

      <main className="px-4 py-4">
        {/* Status Banner */}
        <Card
          className={cn(
            "border-0 shadow-sm mb-4",
            isCancelled && "bg-destructive/10"
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  isCancelled ? "bg-destructive" : statusColors[order.status]
                )}
              >
                {isCancelled ? (
                  <XCircle className="w-6 h-6 text-destructive-foreground" />
                ) : isDelivered ? (
                  <Check className="w-6 h-6 text-primary-foreground" />
                ) : (
                  <Clock className="w-6 h-6 text-primary-foreground animate-pulse" />
                )}
              </div>
              <div>
                <h2 className="font-semibold text-foreground">
                  {isCancelled
                    ? "Заказ отменён"
                    : isDelivered
                      ? "Заказ доставлен!"
                      : "Заказ в обработке"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Steps */}
        {!isCancelled && (
          <Card className="border-0 shadow-sm mb-4">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-4">
                Статус заказа
              </h3>
              <div className="space-y-4">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;

                  return (
                    <div key={step.key} className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                          isCompleted
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span
                        className={cn(
                          "font-medium transition-colors",
                          isCompleted
                            ? "text-foreground"
                            : "text-muted-foreground",
                          isCurrent && "text-primary"
                        )}
                      >
                        {step.label}
                      </span>
                      {isCurrent && !isDelivered && (
                        <span className="ml-auto text-xs text-primary animate-pulse">
                          Текущий
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Delivery Info */}
        <Card className="border-0 shadow-sm mb-4">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3">
              Детали заказа
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Тип заказа</span>
                <span className="text-foreground">
                  {orderTypeLabels[order.order_type || "delivery"] ||
                    order.order_type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Имя</span>
                <span className="text-foreground">{order.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Телефон</span>
                <span className="text-foreground">{order.customer_phone}</span>
              </div>
              {order.delivery_address && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Адрес</span>
                  <span className="text-foreground text-right max-w-[60%]">
                    {order.delivery_address}
                  </span>
                </div>
              )}
              {order.utensils_count !== undefined && order.utensils_count > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Приборы</span>
                  <span className="text-foreground">{order.utensils_count}</span>
                </div>
              )}
              {order.notes && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Комментарий</span>
                  <span className="text-foreground text-right max-w-[60%]">
                    {order.notes}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3">
              Состав заказа
            </h3>
            <div className="space-y-2">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.menu_item?.name || "Позиция"} x{item.quantity}
                  </span>
                  <span className="text-foreground">
                    {item.unit_price * item.quantity} сом
                  </span>
                </div>
              ))}
              <div className="border-t border-border pt-2 mt-2">
                {order.delivery_fee && order.delivery_fee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Доставка</span>
                    <span className="text-foreground">
                      {order.delivery_fee} сом
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-semibold mt-2">
                  <span className="text-foreground">Итого</span>
                  <span className="text-foreground">
                    {order.total_amount} сом
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Back to Menu Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 bg-gradient-to-t from-background via-background to-transparent">
        <Button
          variant="outline"
          className="w-full h-14 text-lg font-medium rounded-xl bg-transparent"
          onClick={() => router.push("/")}
        >
          <Home className="mr-2 h-5 w-5" />
          Вернуться в меню
        </Button>
      </div>
    </div>
  );
}
