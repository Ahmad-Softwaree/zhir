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

    const { chatId, userMessage, aiResponse } = await request.json();
    await connectDB();

    const userId = session.user.sub;

    if (chatId) {
      const chat = await Chat.findOneAndUpdate(
        { _id: chatId, userId },
        {
          $push: {
            conversations: {
              userMessage,
              aiResponse,
              createdAt: new Date(),
            },
          },
        },
        { new: true }
      );

      if (!chat) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 });
      }

      return NextResponse.json(chat);
    } else {
      const title = userMessage.slice(0, 50);
      const newChat = await Chat.create({
        userId,
        title,
        conversations: [
          {
            userMessage,
            aiResponse,
            createdAt: new Date(),
          },
        ],
      });

      return NextResponse.json(newChat);
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
