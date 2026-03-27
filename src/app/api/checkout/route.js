import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { SITE_CONFIG } from "@/lib/config";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const session = await auth();

    const customerEmail = session?.user?.email || body.email;

    const apiKey = process.env.CREEM_API_KEY;
    const productId = process.env.CREEM_PRODUCT_ID;
    const isTestMode = apiKey?.startsWith("creem_test_");
    const baseUrl = isTestMode
      ? "https://test-api.creem.io"
      : "https://api.creem.io";

    const siteUrl = SITE_CONFIG.siteUrl;

    const requestBody = {
      product_id: productId,
      ...(customerEmail && { customer: { email: customerEmail } }),
      success_url: `${siteUrl}/dashboard?checkout=success`,
    };

    console.log("[Checkout] Request:", JSON.stringify(requestBody));

    const response = await fetch(`${baseUrl}/v1/checkouts`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();
    console.log("[Checkout] Response:", response.status, responseText);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to create checkout session", details: responseText },
        { status: 500 }
      );
    }

    const data = JSON.parse(responseText);
    return NextResponse.json({ checkout_url: data.checkout_url });
  } catch (error) {
    console.error("[Checkout] Exception:", error.message);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
