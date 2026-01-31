import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface OrderItemInput {
  menu_item_id: string;
  quantity: number;
  price: number;
  name: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      customer_name,
      customer_phone,
      customer_address,
      order_type,
      utensils_count,
      delivery_fee,
      total_amount,
      comment,
    } = body as {
      items: OrderItemInput[];
      customer_name: string;
      customer_phone: string;
      customer_address: string | null;
      order_type: string;
      utensils_count: number;
      delivery_fee: number;
      total_amount: number;
      comment: string | null;
    };

    if (!customer_name || !customer_phone || !items?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (order_type === "delivery" && !customer_address) {
      return NextResponse.json(
        { error: "Address is required for delivery" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name,
        customer_phone,
        delivery_address: customer_address,
        order_type,
        utensils_count,
        delivery_fee,
        total_amount,
        notes: comment,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      unit_price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items creation error:", itemsError);
      // Rollback order
      await supabase.from("orders").delete().eq("id", order.id);
      return NextResponse.json(
        { error: "Failed to create order items" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: order.id }, { status: 201 });
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
