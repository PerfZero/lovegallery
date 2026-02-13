import { NextResponse } from "next/server";
import { isPaymentDeliveryContent } from "@/lib/payment-delivery-content";
import { getPaymentDeliveryContent, savePaymentDeliveryContent } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ item: getPaymentDeliveryContent() });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load payment-delivery content" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!isPaymentDeliveryContent(body)) {
      return NextResponse.json(
        { error: "Invalid payment-delivery content payload" },
        { status: 400 },
      );
    }

    savePaymentDeliveryContent(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update payment-delivery content" },
      { status: 500 },
    );
  }
}
