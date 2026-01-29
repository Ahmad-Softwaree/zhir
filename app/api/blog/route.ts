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

    const { blogId, userMessage, aiResponse } = await request.json();
    await connectDB();

    const userId = session.user.sub;

    let user = await User.findOne({ auth0Id: session.user.sub });
    if (!user) {
      user = await User.create({ auth0Id: session.user.sub });
    }
    if (user.coins <= 0) {
      return NextResponse.json({ error: "No coins left" }, { status: 403 });
    }

    const title = userMessage.slice(0, 50);

    let blog = await Blog.findOne({ userId, _id: blogId });
    if (blog) {
      if (blog.status === "completed") {
        return NextResponse.json(
          { error: "Blog has already been completed" },
          { status: 400 }
        );
      } else if (blog.status === "failed") {
        blog.title = title;
        blog.conversation = {
          userMessage,
          aiResponse,
          createdAt: new Date(),
        };
        blog.status = "completed";
        await blog.save();
        return NextResponse.json(blog);
      } else {
        blog.title = title;
        blog.conversation = {
          userMessage,
          aiResponse,
          createdAt: new Date(),
        };
        blog.status = "completed";
        await blog.save();
        return NextResponse.json(blog);
      }
    } else {
      const newBlog = await Blog.create({
        userId,
        title,
        status: "completed",
        conversation: {
          userMessage,
          aiResponse,
          createdAt: new Date(),
        },
      });
      return NextResponse.json(newBlog);
    }
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
