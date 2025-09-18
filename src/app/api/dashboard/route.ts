import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAuthHeader } from "@/lib/firebase-admin";
import type { DashboardData, QuizAttempt } from "@/types";

/**
 * GET /api/dashboard
 * Fetch user dashboard data including recent attempts and scores
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Verify Firebase ID token
    const authHeader = request.headers.get("authorization");
    
    let decodedToken;
    try {
      decodedToken = await verifyAuthHeader(authHeader);
    } catch (error) {
      console.error("Auth verification failed:", error);
      
      // TEMPORARY: For development, use mock user when auth fails
      if (process.env.NODE_ENV === "development") {
        console.warn("Using mock user for development - Firebase Admin not configured");
        decodedToken = { uid: "dev-user-1736421600000" }; // Fixed mock user ID
      } else {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    // Fetch user's dashboard data
    const [recentAttempts, recentScores] = await Promise.all([
      // Last 4 attempts with detailed data (questions, answers)
      prisma.quizAttempt.findMany({
        where: { userId: decodedToken.uid },
        orderBy: { completedAt: "desc" },
        take: 4,
        include: {
          answers: {
            include: {
              question: {
                select: {
                  id: true,
                  question: true,
                  optionA: true,
                  optionB: true,
                  optionC: true,
                  optionD: true,
                  correctAnswer: true,
                  explanation: true,
                  domainType: true,
                },
              },
            },
          },
        },
      }),
      
      // Last 10 attempts with basic score data only
      prisma.quizAttempt.findMany({
        where: { userId: decodedToken.uid },
        orderBy: { completedAt: "desc" },
        take: 10,
        select: {
          id: true,
          domainType: true,
          score: true,
          completedAt: true,
        },
      }),
    ]);

    const dashboardData: DashboardData = {
      recentAttempts: recentAttempts as QuizAttempt[],
      recentScores,
    };

    return NextResponse.json({
      success: true,
      data: dashboardData,
    });

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard data",
        message: process.env.NODE_ENV === "development" ? String(error) : undefined,
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
