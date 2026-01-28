import { auth0 } from "@/lib/auth0";
import Chat from "@/lib/db/models/Chat";
import connectDB from "@/lib/db/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = session.user.sub;

    // Create a new empty chat with a default title
    const newChat = await Chat.create({
      userId,
      title: "New Chat",
      conversations: [],
    });

    return NextResponse.json({ chat: newChat });
  } catch (error) {
    console.error("Error creating new chat:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
