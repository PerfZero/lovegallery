import { NextResponse } from "next/server";
import { getPaymentDeliveryContent } from "@/lib/db";

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
