import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAuthHeader } from "@/lib/firebase-admin";

/**
 * POST /api/quiz/submit
 * Submit quiz results and save to database
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Verify Firebase ID token
    const authHeader = request.headers.get("authorization");
    
    let decodedToken;
    try {
      decodedToken = await verifyAuthHeader(authHeader);
    } catch (error) {
      console.error("Auth verification failed:", error);
      
      // TEMPORARY: For development, create a mock user when auth fails
      // TODO: Remove this once Firebase Admin is properly configured
      if (process.env.NODE_ENV === "development") {
        console.warn("Using mock user for development - Firebase Admin not configured");
        decodedToken = { uid: "dev-user-" + Date.now() };
      } else {
        return NextResponse.json(
          { success: false, error: "Unauthorized - Firebase Admin not properly configured" },
          { status: 401 }
        );
      }
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

    const { domainType, score, totalQuestions, correctAnswers, answers } = body;

    // Validate required fields
    if (!domainType || score === undefined || !totalQuestions || correctAnswers === undefined || !answers) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate data types and ranges
    if (typeof score !== "number" || score < 0 || score > 100) {
      return NextResponse.json(
        { success: false, error: "Score must be a number between 0 and 100" },
        { status: 400 }
      );
    }

    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { success: false, error: "Answers must be a non-empty array" },
        { status: 400 }
      );
    }

    // Validate each answer object
    for (const answer of answers) {
      if (!answer.questionId || !answer.selectedAnswer || typeof answer.isCorrect !== "boolean") {
        return NextResponse.json(
          { success: false, error: "Invalid answer format" },
          { status: 400 }
        );
      }
    }

    // Use Prisma transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Ensure user exists (for mock users in development)
      await tx.user.upsert({
        where: { id: decodedToken.uid },
        update: {},
        create: {
          id: decodedToken.uid,
          email: `${decodedToken.uid}@example.com`,
          name: "Development User",
        },
      });

      // Create quiz attempt
      const quizAttempt = await tx.quizAttempt.create({
        data: {
          userId: decodedToken.uid,
          domainType,
          score,
          totalQuestions,
          correctAnswers,
        },
      });

      // Create user answers
      const userAnswers = await tx.userAnswer.createMany({
        data: answers.map((answer: any) => ({
          attemptId: quizAttempt.id,
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          isCorrect: answer.isCorrect,
        })),
      });

      return { quizAttempt, userAnswers };
    });

    return NextResponse.json({
      success: true,
      data: {
        attemptId: result.quizAttempt.id,
        answersCreated: result.userAnswers.count,
      },
      message: "Quiz results saved successfully",
    });

  } catch (error) {
    console.error("Error saving quiz results:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save quiz results",
        message: process.env.NODE_ENV === "development" ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * Other HTTP methods not allowed
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
