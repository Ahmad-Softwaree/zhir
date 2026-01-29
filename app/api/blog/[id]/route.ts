import { auth0 } from "@/lib/auth0";
import connectDB from "@/lib/db/mongodb";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Blog from "@/lib/db/models/Blog";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth0.getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid blog ID format" },
        { status: 400 }
      );
    }
    await connectDB();

    const userId = session.user.sub;
    const blog = await Blog.findOne({ _id: id, userId });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth0.getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid blog ID format" },
        { status: 400 }
      );
    }
    await connectDB();
    const userId = session.user.sub;
    const blog = await Blog.findOneAndDelete({ _id: id, userId });
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Blog deleted successfully" });
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
