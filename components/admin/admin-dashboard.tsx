"use client";

import React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  RefreshCw,
  Clock,
  CheckCircle,
  ChefHat,
  Bike,
  Package,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import type { OrderWithItems, Order } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AdminDashboardProps {
  orders: OrderWithItems[];
  adminUsername: string;
}

type OrderStatus = Order["status"];

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    badgeVariant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  pending: {
    label: "Ожидает",
    icon: Clock,
    color: "text-amber-500",
    badgeVariant: "secondary",
  },
  confirmed: {
    label: "Подтверждён",
    icon: CheckCircle,
    color: "text-blue-500",
    badgeVariant: "default",
  },
  preparing: {
    label: "Готовится",
    icon: ChefHat,
    color: "text-orange-500",
    badgeVariant: "default",
  },
  delivering: {
    label: "В пути",
    icon: Bike,
    color: "text-primary",
    badgeVariant: "default",
  },
  delivered: {
    label: "Доставлен",
    icon: Package,
    color: "text-green-500",
    badgeVariant: "outline",
  },
  cancelled: {
    label: "Отменён",
    icon: XCircle,
    color: "text-destructive",
    badgeVariant: "destructive",
  },
};

const orderTypeLabels: Record<string, string> = {
  delivery: "Доставка",
  pickup: "Самовывоз",
  preorder: "Предзаказ",
};

const statusOrder: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "delivering",
  "delivered",
  "cancelled",
];

export function AdminDashboard({
  orders: initialOrders,
  adminUsername,
}: AdminDashboardProps) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  // Subscribe to realtime updates
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("admin-orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        async () => {
          // Refresh orders when any change happens
          handleRefresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/admin/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Failed to refresh orders:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    setUpdatingOrder(orderId);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  const orderCounts = orders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    },
    {} as Record<OrderStatus, number>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Панель управления
            </h1>
            <p className="text-xs text-muted-foreground">
              Вход как {adminUsername}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={cn("h-5 w-5", isRefreshing && "animate-spin")}
              />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="px-4 py-4">
        {/* Status Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {(["pending", "preparing", "delivering"] as OrderStatus[]).map(
            (status) => {
              const config = statusConfig[status];
              const Icon = config.icon;
              return (
                <Card
                  key={status}
                  className={cn(
                    "border-0 shadow-sm cursor-pointer transition-colors",
                    statusFilter === status && "ring-2 ring-primary"
                  )}
                  onClick={() =>
                    setStatusFilter(statusFilter === status ? "all" : status)
                  }
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Icon className={cn("h-4 w-4", config.color)} />
                      <span className="text-2xl font-bold text-foreground">
                        {orderCounts[status] || 0}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {config.label}
                    </p>
                  </CardContent>
                </Card>
              );
            }
          )}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-4">
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as OrderStatus | "all")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Фильтр по статусу" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все заказы</SelectItem>
              {statusOrder.map((status) => (
                <SelectItem key={status} value={status}>
                  {statusConfig[status].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {filteredOrders.length} заказ
            {filteredOrders.length === 1
              ? ""
              : filteredOrders.length >= 2 && filteredOrders.length <= 4
                ? "а"
                : "ов"}
          </span>
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {filteredOrders.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Заказов не найдено</p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => {
              const config = statusConfig[order.status];
              const Icon = config.icon;

              return (
                <Card key={order.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    {/* Order Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium text-foreground">
                            #{order.id.slice(0, 8)}
                          </span>
                          <Badge variant={config.badgeVariant}>
                            <Icon className="h-3 w-3 mr-1" />
                            {config.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <span className="font-semibold text-foreground">
                        {order.total_amount} сом
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="text-sm space-y-1 mb-3">
                      <p className="text-foreground font-medium">
                        {order.customer_name}
                      </p>
                      <p className="text-muted-foreground">
                        {order.customer_phone}
                      </p>
                      {order.order_type && (
                        <p className="text-xs text-primary">
                          {orderTypeLabels[order.order_type] || order.order_type}
                        </p>
                      )}
                      {order.delivery_address && (
                        <p className="text-muted-foreground text-xs">
                          {order.delivery_address}
                        </p>
                      )}
                      {order.utensils_count && order.utensils_count > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Приборы: {order.utensils_count}
                        </p>
                      )}
                      {order.notes && (
                        <p className="text-xs text-muted-foreground italic">
                          Комментарий: {order.notes}
                        </p>
                      )}
                    </div>

                    {/* Order Items */}
                    <div className="text-xs text-muted-foreground mb-3 bg-muted/50 rounded-md p-2">
                      {order.order_items.map((item, idx) => (
                        <span key={item.id}>
                          {item.menu_item?.name || "Позиция"} x{item.quantity}
                          {idx < order.order_items.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>

                    {/* Status Change */}
                    {order.status !== "delivered" &&
                      order.status !== "cancelled" && (
                        <div className="flex gap-2">
                          {order.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={() =>
                                  handleStatusChange(order.id, "confirmed")
                                }
                                disabled={updatingOrder === order.id}
                              >
                                Подтвердить
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleStatusChange(order.id, "cancelled")
                                }
                                disabled={updatingOrder === order.id}
                              >
                                Отменить
                              </Button>
                            </>
                          )}
                          {order.status === "confirmed" && (
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() =>
                                handleStatusChange(order.id, "preparing")
                              }
                              disabled={updatingOrder === order.id}
                            >
                              Начать готовить
                            </Button>
                          )}
                          {order.status === "preparing" && (
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() =>
                                handleStatusChange(order.id, "delivering")
                              }
                              disabled={updatingOrder === order.id}
                            >
                              Отправить курьера
                            </Button>
                          )}
                          {order.status === "delivering" && (
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() =>
                                handleStatusChange(order.id, "delivered")
                              }
                              disabled={updatingOrder === order.id}
                            >
                              Доставлено
                            </Button>
                          )}
                        </div>
                      )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
