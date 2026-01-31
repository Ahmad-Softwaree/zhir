import { auth0 } from "@/lib/auth0";
import Blog from "@/lib/db/models/Blog";
import User from "@/lib/db/models/User";
import connectDB from "@/lib/db/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();

    let user = await User.findOne({ auth0Id: session.user.sub });
    if (!user) {
      user = await User.create({ auth0Id: session.user.sub });
    }
    if (user.coins <= 0) {
      return NextResponse.json({ error: "No coins left" }, { status: 403 });
    }

    const userId = session.user.sub;

    const blog = await Blog.create({
      userId,
      title: "New Blog",
      status: "pending",
    });

    return NextResponse.json({
      id: blog._id,
    });
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
