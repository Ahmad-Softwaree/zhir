import { auth0 } from "@/lib/auth0";
import Chat from "@/lib/db/models/Chat";
import connectDB from "@/lib/db/mongodb";
import { NextRequest } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession(request);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { message, chatId } = await request.json();
    const userId = session.user.sub;
    const systemPrompt: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
      role: "system",
      content:
        "Your name is Zhir, an AI assistant that helps users with their questions. Created by Ahmad Software. Be polite and concise.",
    };
    const stream = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [systemPrompt, { role: "user", content: message }],
      stream: true,
    });

    let fullResponse = "";

    const encoder = new TextEncoder();
    const customStream = new TransformStream({
      async transform(chunk, controller) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          controller.enqueue(encoder.encode(content));
        }
      },
    });

    (async () => {
      const writer = customStream.writable.getWriter();
      try {
        for await (const chunk of stream) {
          await writer.write(chunk);
        }

        await connectDB();

        if (chatId) {
          await Chat.findOneAndUpdate(
            { _id: chatId, userId },
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
        } else {
          const title = message.slice(0, 50);
          await Chat.create({
            userId,
            title,
            conversations: [
              {
                userMessage: message,
                aiResponse: fullResponse,
                createdAt: new Date(),
              },
            ],
          });
        }
      } catch (error) {
        console.error("Streaming or DB error:", error);
      } finally {
        await writer.close();
      }
    })();

    // Return the readable stream
    return new Response(customStream.readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
