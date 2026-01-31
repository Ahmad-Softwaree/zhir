import { auth0 } from "@/lib/auth0";
import User from "@/lib/db/models/User";
import connectDB from "@/lib/db/mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    let session = await auth0.getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    let user = await User.findOne({ auth0Id: session.user.sub });
    if (!user) {
      await User.create({ auth0Id: session.user.sub });
    }
    return NextResponse.json(user, { status: 201 });
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
