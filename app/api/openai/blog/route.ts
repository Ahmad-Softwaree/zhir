import { auth0 } from "@/lib/auth0";
import Blog from "@/lib/db/models/Blog";
import User from "@/lib/db/models/User";
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
    const userId = session.user.sub;

    const { title, description } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { message: "Title and description are required." },
        { status: 400 }
      );
    }

    await connectDB();

    let user = await User.findOne({ auth0Id: session.user.sub });
    if (!user) {
      user = await User.create({ auth0Id: session.user.sub });
    }

    // Check if user has enough coins
    if (user.coins < 1) {
      return NextResponse.json(
        { message: "Insufficient coins. Please purchase more credits." },
        { status: 402 } // Payment Required
      );
    }

    // --- Generate blog post using OpenAI ---
    const prompt = `
You are Zhir, an expert AI blog writer created by Ahmad Software.

Write a full, professional, SEO-friendly blog post based on the following data:

Title: "${title}"
Description: "${description}"

Format the blog in rich Markdown using:

# Title (H1)
## Introduction
## Main Sections (H2)
### Subsections (H3)
- Bullet points
- Lists when needed
> Quotes when useful

Include:
- Engaging introduction
- Structured, readable sections
- Examples when relevant
- A short conclusion

Do NOT include:
- Metadata
- Disclaimers
- Author info
- HTML (ONLY Markdown)

Return ONLY the blog content in Markdown format.
`;

    const aiResult = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You create high-quality blog posts." },
        { role: "user", content: prompt },
      ],
    });

    const blogContent = aiResult.choices?.[0]?.message?.content || "";

    // --- Decrement user coins ---
    await User.findByIdAndUpdate(user._id, { $inc: { coins: -1 } });

    // --- Save blog to DB ---
    const newBlog = await Blog.create({
      userId,
      title,
      conversation: {
        userMessage: description,
        aiResponse: blogContent,
        createdAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: "Blog generated successfully.",
        id: newBlog._id,
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
