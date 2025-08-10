import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAuthHeader } from "@/lib/firebase-admin";
import { sanitizeUserInput, isValidEmail, isValidName } from "@/lib/validation";
import type { User } from "@/types";

/**
 * POST /api/user
 * Create or update user after Firebase authentication
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Verify Firebase ID token
    const authHeader = request.headers.get("authorization");
    
    let decodedToken;
    try {
      decodedToken = await verifyAuthHeader(authHeader);
    } catch {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { email, name } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!isValidName(name)) {
      return NextResponse.json(
        { success: false, error: "Invalid name format" },
        { status: 400 }
      );
    }

    // Sanitize input to prevent XSS
    const sanitizedInput = sanitizeUserInput({ email, name });

    // Create or update user in database using Firebase UID as primary key
    const user = await prisma.user.upsert({
      where: { id: decodedToken.uid },
      update: {
        email: sanitizedInput.email,
        name: sanitizedInput.name,
      },
      create: {
        id: decodedToken.uid,
        email: sanitizedInput.email,
        name: sanitizedInput.name,
      },
    });

    // Transform to match our type definition
    const responseUser: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };

    return NextResponse.json({
      success: true,
      data: responseUser,
      message: "User created/updated successfully",
    });
  } catch (error) {
    console.error("Error creating/updating user:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create/update user",
        message: process.env.NODE_ENV === "development" ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/user
 * Get current user info (for future use)
 */
export async function GET(): Promise<NextResponse> {
  try {
    // TODO: Add Firebase ID token verification in Phase 6
    // Extract user ID from token and fetch user data
    
    return NextResponse.json(
      { success: false, error: "Not implemented yet" },
      { status: 501 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

/**
 * Other HTTP methods not allowed
 */
export async function PUT(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
