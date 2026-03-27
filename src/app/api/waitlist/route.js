import { addToWaitlist, getWaitlistCount } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const result = await addToWaitlist(email);

    if (!result) {
      return NextResponse.json(
        { error: "This email is already on the waitlist!" },
        { status: 409 }
      );
    }

    const count = await getWaitlistCount();

    return NextResponse.json({
      message: "You're on the list! We'll notify you when we launch. 🎉",
      count,
    });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const count = await getWaitlistCount();
  return NextResponse.json({ count });
}
