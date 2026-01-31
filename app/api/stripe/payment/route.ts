import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import connectDB from "@/lib/db/mongodb";
import PaymentHistory from "@/lib/db/models/Payment";
import User from "@/lib/db/models/User";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession(request);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ auth0Id: session.user.sub });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const payments = await PaymentHistory.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(payments, { status: 200 });
  } catch (error: any) {
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

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession(request);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let user = await User.findOne({ auth0Id: session.user.sub });
    if (!user) {
      user = await User.create({ auth0Id: session.user.sub });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRODUCT_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.APP_BASE_URL}/ai/blog/chat/payment/success`,
      cancel_url: `${process.env.APP_BASE_URL}/ai/blog/chat/payment/cancelled`,
      metadata: {
        userId: user._id.toString(),
        auth0Id: session.user.sub,
        coins: "10",
      },
    });
    return NextResponse.json(
      {
        message: "Checkout session created",
        url: checkoutSession.url,
      },
      { status: 200 }
    );
  } catch (error: any) {
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
