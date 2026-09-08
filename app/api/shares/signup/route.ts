import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          message: "Please fill all the fields",
          success: false,
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "User already exists",
          success: false,
        },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        success: true,
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("User creation error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong",
        success: false,
      },
      { status: 500 }
    );
  }
}
