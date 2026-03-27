import { NextResponse } from "next/server";
import crypto from "crypto";
import {
  getUserByEmail,
  updateUserPlanByEmail,
  downgradeUserByCreemSubscriptionId,
} from "@/lib/db";

// Creem sends raw JSON body — we need the raw text for signature verification
export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("creem-signature");

    // Verify webhook signature
    const webhookSecret = process.env.CREEM_WEBHOOK_SECRET;
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (signature !== expectedSignature) {
        console.error("Webhook signature mismatch");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    }

    const event = JSON.parse(rawBody);
    const eventType = event.eventType || event.event_type || event.type;

    console.log(`[Creem Webhook] Event: ${eventType}`, JSON.stringify(event).slice(0, 500));

    switch (eventType) {
      case "checkout.completed": {
        await handleCheckoutCompleted(event);
        break;
      }
      case "subscription.active": {
        await handleSubscriptionActive(event);
        break;
      }
      case "subscription.canceled":
      case "subscription.cancelled": {
        await handleSubscriptionCanceled(event);
        break;
      }
      default: {
        console.log(`[Creem Webhook] Unhandled event type: ${eventType}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Creem Webhook] Error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(event) {
  // Extract customer email from various possible payload structures
  const customerEmail =
    event.object?.customer?.email ||
    event.data?.customer?.email ||
    event.customer?.email ||
    event.customer_email;

  const customerId =
    event.object?.customer?.id ||
    event.data?.customer?.id ||
    event.customer?.id ||
    event.customer_id;

  const subscriptionId =
    event.object?.subscription?.id ||
    event.data?.subscription?.id ||
    event.object?.id ||
    event.data?.id ||
    event.subscription_id;

  if (!customerEmail) {
    console.error("[Creem Webhook] checkout.completed: No customer email found", event);
    return;
  }

  console.log(`[Creem Webhook] Activating plan for ${customerEmail}`);

  const user = await getUserByEmail(customerEmail);
  if (!user) {
    console.error(`[Creem Webhook] User not found for email: ${customerEmail}`);
    return;
  }

  await updateUserPlanByEmail(
    customerEmail,
    "founding",
    customerId || null,
    subscriptionId || null
  );

  console.log(`[Creem Webhook] ✅ User ${customerEmail} upgraded to founding`);
}

async function handleSubscriptionActive(event) {
  // Same logic as checkout.completed — ensure plan is active
  const customerEmail =
    event.object?.customer?.email ||
    event.data?.customer?.email ||
    event.customer?.email ||
    event.customer_email;

  const customerId =
    event.object?.customer?.id ||
    event.data?.customer?.id ||
    event.customer?.id ||
    event.customer_id;

  const subscriptionId =
    event.object?.id ||
    event.data?.id ||
    event.subscription_id;

  if (!customerEmail) {
    console.error("[Creem Webhook] subscription.active: No customer email found");
    return;
  }

  const user = await getUserByEmail(customerEmail);
  if (!user) {
    console.error(`[Creem Webhook] User not found: ${customerEmail}`);
    return;
  }

  await updateUserPlanByEmail(customerEmail, "founding", customerId, subscriptionId);
  console.log(`[Creem Webhook] ✅ Subscription active for ${customerEmail}`);
}

async function handleSubscriptionCanceled(event) {
  const subscriptionId =
    event.object?.id ||
    event.data?.id ||
    event.subscription_id;

  const customerEmail =
    event.object?.customer?.email ||
    event.data?.customer?.email ||
    event.customer?.email ||
    event.customer_email;

  if (subscriptionId) {
    await downgradeUserByCreemSubscriptionId(subscriptionId);
    console.log(`[Creem Webhook] ✅ Subscription ${subscriptionId} canceled, user downgraded`);
  } else if (customerEmail) {
    await updateUserPlanByEmail(customerEmail, "free", null, null);
    console.log(`[Creem Webhook] ✅ User ${customerEmail} downgraded to free`);
  } else {
    console.error("[Creem Webhook] subscription.canceled: No identifier found");
  }
}
