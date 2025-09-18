"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CheckCircle, XCircle, Clock, TrendingUp, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import type { ReactElement } from "react";
import type { DashboardData, QuizAttempt, UserAnswer } from "@/types";

interface AttemptAnalytics {
  attempt: QuizAttempt;
  correctPercentage: number;
  incorrectPercentage: number;
  domainPerformance: { domain: string; score: number; total: number }[];
}

export function DashboardFullTracking(): ReactElement {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAttempt, setSelectedAttempt] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async (): Promise<void> => {
      if (!user) return;

      try {
        const idToken = await user.getIdToken();
        const response = await fetch("/api/dashboard", {
          headers: {
            "Authorization": `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          setDashboardData(result.data);
        } else {
          setError("Failed to load dashboard data");
        }
      } catch (err) {
        setError("Error loading dashboard data");
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-error";
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 80) return "bg-success-light";
    if (score >= 60) return "bg-warning-light";
    return "bg-error-light";
  };

  const prepareChartData = (attempts: QuizAttempt[]) => {
    return attempts.map((attempt, index) => ({
      name: `Attempt ${attempts.length - index}`,
      score: attempt.score,
      correct: attempt.correctAnswers,
      total: attempt.totalQuestions,
      domain: attempt.domainType,
      date: formatDate(attempt.completedAt),
    }));
  };

  const preparePieData = (attempt: QuizAttempt) => [
    {
      name: "Correct",
      value: attempt.correctAnswers,
      color: "#a8e6cf",
    },
    {
      name: "Incorrect", 
      value: attempt.totalQuestions - attempt.correctAnswers,
      color: "#e74c3c",
    },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-secondary">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <XCircle className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-xl font-bold text-primary mb-2">Error Loading Data</h3>
          <p className="text-secondary">{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData?.recentAttempts.length) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-bold text-primary mb-2">No Quiz Data Yet</h3>
          <p className="text-secondary">Complete some quizzes to see your detailed analytics here!</p>
        </div>
      </div>
    );
  }

  const chartData = prepareChartData(dashboardData.recentAttempts);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-secondary mb-2">Full Tracking Analytics</h1>
        <p className="text-secondary-light text-lg">Comprehensive analysis of your last {dashboardData.recentAttempts.length} quiz attempts</p>
      </div>

      {/* Performance Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart - Score Comparison */}
        <div className="bg-primary-dark rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-accent" />
            <h3 className="text-xl font-bold text-secondary">Score Comparison</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d7ccc8" />
              <XAxis dataKey="name" stroke="#5d4037" />
              <YAxis stroke="#5d4037" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "#fdf6e3",
                  border: "1px solid #d7ccc8",
                  borderRadius: "8px",
                  color: "#2c1810"
                }}
              />
              <Bar dataKey="score" fill="#8b1538" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Overall Performance Summary */}
        <div className="bg-primary-dark rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h3 className="text-xl font-bold text-secondary">Performance Summary</h3>
          </div>
          <div className="space-y-4">
            {dashboardData.recentAttempts.map((attempt, index) => (
              <div key={attempt.id} className="flex items-center justify-between p-3 bg-primary rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${getScoreBgColor(attempt.score)} flex items-center justify-center`}>
                    <span className={`font-bold text-sm ${getScoreColor(attempt.score)}`}>
                      {Math.round(attempt.score)}%
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-secondary">{attempt.domainType}</p>
                    <p className="text-sm text-secondary-light">{formatDate(attempt.completedAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-secondary">{attempt.correctAnswers}/{attempt.totalQuestions}</p>
                  <p className="text-sm text-secondary-light">correct</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Attempt Analysis */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-secondary">Detailed Question Analysis</h2>
        
        {dashboardData.recentAttempts.map((attempt, attemptIndex) => (
          <div key={attempt.id} className="bg-primary-dark rounded-2xl p-6 border border-border">
            {/* Attempt Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${getScoreBgColor(attempt.score)} flex items-center justify-center`}>
                  <span className={`font-bold ${getScoreColor(attempt.score)}`}>
                    {Math.round(attempt.score)}%
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-secondary">
                    Attempt {dashboardData.recentAttempts.length - attemptIndex} - {attempt.domainType}
                  </h3>
                  <p className="text-secondary-light">{formatDate(attempt.completedAt)}</p>
                </div>
              </div>
              
              {/* Mini Pie Chart */}
              <div className="w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={preparePieData(attempt)}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={40}
                      dataKey="value"
                    >
                      {preparePieData(attempt).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Questions Table */}
            {attempt.answers && attempt.answers.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-secondary font-semibold">#</th>
                      <th className="text-left py-3 px-2 text-secondary font-semibold">Question</th>
                      <th className="text-left py-3 px-2 text-secondary font-semibold">Your Answer</th>
                      <th className="text-left py-3 px-2 text-secondary font-semibold">Correct Answer</th>
                      <th className="text-left py-3 px-2 text-secondary font-semibold">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attempt.answers.map((answer, index) => (
                      <tr key={answer.id} className="border-b border-border hover:bg-primary transition-colors">
                        <td className="py-3 px-2 text-secondary-light font-medium">{index + 1}</td>
                        <td className="py-3 px-2 text-secondary max-w-md">
                          <p className="truncate" title={answer.question?.question}>
                            {answer.question?.question || "Question not found"}
                          </p>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-sm font-medium ${
                              answer.isCorrect 
                                ? "bg-success-light text-success" 
                                : "bg-error-light text-error"
                            }`}>
                              {answer.selectedAnswer}
                            </span>
                            <span className="text-secondary-light text-sm">
                              {answer.question?.[`option${answer.selectedAnswer}` as keyof typeof answer.question] as string || ""}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded text-sm font-medium bg-success-light text-success">
                              {answer.question?.correctAnswer}
                            </span>
                            <span className="text-secondary-light text-sm">
                              {answer.question?.[`option${answer.question.correctAnswer}` as keyof typeof answer.question] as string || ""}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          {answer.isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-success" />
                          ) : (
                            <XCircle className="w-5 h-5 text-error" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
