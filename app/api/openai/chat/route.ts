import { auth0 } from "@/lib/auth0";
import Chat from "@/lib/db/models/Chat";
import connectDB from "@/lib/db/mongodb";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession(request);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { message, chatId } = await request.json();

    if (typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 }
      );
    }
    if (message.length > 200) {
      return NextResponse.json(
        { message: "Message too long" },
        { status: 400 }
      );
    }

    const userId = session.user.sub;

    await connectDB();

    let currentChatId = chatId;
    let existingChat = null;

    if (chatId) {
      existingChat = await Chat.findOne({ _id: chatId, userId });
    }

    if (!existingChat) {
      const title = message.slice(0, 50);
      const newChat = await Chat.create({
        userId,
        title,
        conversations: [],
      });
      currentChatId = newChat._id.toString();
    }

    const messageHistory: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      [];
    const systemPrompt: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
      role: "system",
      content:
        "Your name is Zhir, an AI assistant that helps users with their questions. Created by Ahmad Software. Be polite and concise.",
    };
    messageHistory.push(systemPrompt);

    if (existingChat && existingChat.conversations.length > 0) {
      const conversations = [...existingChat.conversations].reverse();

      const maxChars = 36000;
      let totalChars = 0;
      const historyMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
        [];

      for (const conversation of conversations) {
        const userMsgLength = conversation.userMessage.length;
        const aiMsgLength = conversation.aiResponse.length;
        const pairLength = userMsgLength + aiMsgLength;

        if (totalChars + pairLength > maxChars) {
          break;
        }

        historyMessages.push(
          { role: "user", content: conversation.userMessage },
          { role: "assistant", content: conversation.aiResponse }
        );
        totalChars += pairLength;
      }

      messageHistory.push(...historyMessages.reverse());
    }

    messageHistory.push({ role: "user", content: message });

    const stream = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messageHistory,
      stream: true,
    });

    let fullResponse = "";
    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          const startMessage = JSON.stringify({
            type: "start",
            chatId: currentChatId,
          });
          controller.enqueue(
            encoder.encode(`__START__${startMessage}__START__\n`)
          );

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              fullResponse += content;
              controller.enqueue(encoder.encode(content));
            }
          }

          const endMessage = JSON.stringify({ type: "end" });
          controller.enqueue(encoder.encode(`\n__END__${endMessage}__END__`));

          controller.close();

          await Chat.findOneAndUpdate(
            { _id: currentChatId, userId },
            {
              title: message.slice(0, 50),
              $push: {
                conversations: {
                  userMessage: message,
                  aiResponse: fullResponse,
                  createdAt: new Date(),
                },
              },
            }
          );
        } catch (error) {
          console.error("Streaming or DB error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
