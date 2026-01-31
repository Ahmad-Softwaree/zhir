import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import PaymentHistory from "@/lib/db/models/Payment";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json(
        { message: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { message: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      await connectDB();

      const userId = session.metadata?.userId;
      const coinsToAdd = parseInt(session.metadata?.coins || "10");

      if (!userId) {
        console.error("No userId found in session metadata");
        return NextResponse.json(
          { message: "Invalid metadata" },
          { status: 400 }
        );
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { $inc: { coins: coinsToAdd } },
        { new: true }
      );

      if (!user) {
        console.error("User not found:", userId);
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      // Create payment record
      await PaymentHistory.create({
        userId: user._id,
        stripePaymentId: session.payment_intent as string,
        amount: session.amount_total! / 100,
        currency: session.currency || "usd",
        status: "succeeded",
        description: `Purchase of ${coinsToAdd} credits`,
        metadata: {
          sessionId: session.id,
          customerEmail: session.customer_email,
        },
      });

      console.log(
        `✅ Payment successful for user ${userId}. Added ${coinsToAdd} coins. New balance: ${user.coins}`
      );
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      {
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
