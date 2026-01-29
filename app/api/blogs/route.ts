import { auth0 } from "@/lib/auth0";
import connectDB from "@/lib/db/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Blog from "../../../lib/db/models/Blog";

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = session.user.sub;
    const blogs = await Blog.find({ userId })
      .sort({ updatedAt: -1 })
      .select("_id title conversation updatedAt")
      .lean();

    const formattedBlogs = blogs.map((blog) => ({
      id: blog._id.toString(),
      title: blog.title,
      lastMessage:
        blog.conversation[blog.conversation.length - 1]?.userMessage ||
        "No messages",
      updatedAt: blog.updatedAt,
    }));

    return NextResponse.json(formattedBlogs);
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
