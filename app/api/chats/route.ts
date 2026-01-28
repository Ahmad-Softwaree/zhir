import { auth0 } from "@/lib/auth0";
import Chat from "@/lib/db/models/Chat";
import connectDB from "@/lib/db/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = session.user.sub;
    const chats = await Chat.find({ userId })
      .sort({ updatedAt: -1 })
      .select("_id title conversations updatedAt")
      .lean();

    const formattedChats = chats.map((chat) => ({
      id: chat._id.toString(),
      title: chat.title,
      lastMessage:
        chat.conversations[chat.conversations.length - 1]?.userMessage ||
        "No messages",
      updatedAt: chat.updatedAt,
    }));

    return NextResponse.json(formattedChats);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
