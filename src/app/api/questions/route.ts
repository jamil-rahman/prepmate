import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAuthHeader } from "@/lib/firebase-admin";
import type { Question } from "@/types";

/**
 * GET /api/questions
 * Returns all quiz questions for authenticated users
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Optional auth - for future user tracking features
    const authHeader = request.headers.get("authorization");
    let authenticatedUser = null;
    
    if (authHeader) {
      try {
        authenticatedUser = await verifyAuthHeader(authHeader);
        // TODO: In future, track user quiz attempts here
      } catch {
        // Continue without auth - demo access is allowed
        console.log("Invalid auth token provided, continuing with public access");
      }
    }

    // Fetch all questions from database
    const questions = await prisma.question.findMany({
      orderBy: { id: "asc" },
    });

    // Transform to match our type definition
    const formattedQuestions: Question[] = questions.map((q) => ({
      id: q.id,
      domainType: q.domainType,
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    }));

    return NextResponse.json({
      success: true,
      data: formattedQuestions,
      count: formattedQuestions.length,
      authenticated: !!authenticatedUser,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch questions",
        message: process.env.NODE_ENV === "development" ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * Other HTTP methods not allowed
 */
export async function POST(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
