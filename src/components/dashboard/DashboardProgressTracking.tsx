"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, Target, Award, Calendar, BarChart3 } from "lucide-react";
import type { ReactElement } from "react";
import type { DashboardData } from "@/types";

interface TrendData {
  attempt: number;
  score: number;
  date: string;
  domain: string;
  correctAnswers: number;
  totalQuestions: number;
}

interface DomainStats {
  domain: string;
  attempts: number;
  averageScore: number;
  bestScore: number;
  totalQuestions: number;
  totalCorrect: number;
}

export function DashboardProgressTracking(): ReactElement {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    });
  };

  const prepareTrendData = (scores: DashboardData["recentScores"]): TrendData[] => {
    return scores.map((score, index) => ({
      attempt: scores.length - index,
      score: score.score,
      date: formatDate(score.completedAt),
      domain: score.domainType,
      correctAnswers: 0, // Not available in recentScores
      totalQuestions: 0, // Not available in recentScores
    })).reverse();
  };

  const calculateDomainStats = (scores: DashboardData["recentScores"]): DomainStats[] => {
    const domainMap = new Map<string, { scores: number[]; attempts: number }>();
    
    scores.forEach(score => {
      if (!domainMap.has(score.domainType)) {
        domainMap.set(score.domainType, { scores: [], attempts: 0 });
      }
      const stats = domainMap.get(score.domainType)!;
      stats.scores.push(score.score);
      stats.attempts++;
    });

    return Array.from(domainMap.entries()).map(([domain, stats]) => ({
      domain,
      attempts: stats.attempts,
      averageScore: Math.round(stats.scores.reduce((sum, score) => sum + score, 0) / stats.scores.length),
      bestScore: Math.max(...stats.scores),
      totalQuestions: stats.attempts * 10, // Assuming 10 questions per quiz
      totalCorrect: Math.round(stats.scores.reduce((sum, score) => sum + (score / 100) * 10, 0)),
    }));
  };

  const calculateOverallStats = (scores: DashboardData["recentScores"]) => {
    if (scores.length === 0) return { average: 0, trend: 0, bestScore: 0, totalAttempts: 0 };

    const average = Math.round(scores.reduce((sum, score) => sum + score.score, 0) / scores.length);
    const recent = scores.slice(0, 5);
    const older = scores.slice(5);
    
    let trend = 0;
    if (older.length > 0) {
      const recentAvg = recent.reduce((sum, score) => sum + score.score, 0) / recent.length;
      const olderAvg = older.reduce((sum, score) => sum + score.score, 0) / older.length;
      trend = recentAvg - olderAvg;
    }

    return {
      average,
      trend,
      bestScore: Math.max(...scores.map(s => s.score)),
      totalAttempts: scores.length,
    };
  };

  const getDomainColors = (index: number): string => {
    const colors = ["#8b1538", "#e74c3c", "#f8bbd9", "#a8e6cf", "#f59e0b"];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-secondary">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-xl font-bold text-primary mb-2">Error Loading Data</h3>
          <p className="text-secondary">{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData?.recentScores.length) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-bold text-primary mb-2">No Progress Data Yet</h3>
          <p className="text-secondary">Complete more quizzes to see your progress trends here!</p>
        </div>
      </div>
    );
  }

  const trendData = prepareTrendData(dashboardData.recentScores);
  const domainStats = calculateDomainStats(dashboardData.recentScores);
  const overallStats = calculateOverallStats(dashboardData.recentScores);

  const domainPieData = domainStats.map((stat, index) => ({
    name: stat.domain,
    value: stat.attempts,
    color: getDomainColors(index),
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-secondary mb-2">Progress Tracking</h1>
        <p className="text-secondary-light text-lg">Performance trends and insights from your last {dashboardData.recentScores.length} quiz attempts</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-primary-dark rounded-2xl p-6 border border-border text-center">
          <div className="w-12 h-12 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-secondary mb-1">{overallStats.average}%</h3>
          <p className="text-secondary-light text-sm">Average Score</p>
        </div>

        <div className="bg-primary-dark rounded-2xl p-6 border border-border text-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
            overallStats.trend >= 0 ? "bg-success-light" : "bg-error-light"
          }`}>
            {overallStats.trend >= 0 ? (
              <TrendingUp className="w-6 h-6 text-success" />
            ) : (
              <TrendingDown className="w-6 h-6 text-error" />
            )}
          </div>
          <h3 className={`text-2xl font-bold mb-1 ${
            overallStats.trend >= 0 ? "text-success" : "text-error"
          }`}>
            {overallStats.trend >= 0 ? "+" : ""}{Math.round(overallStats.trend)}%
          </h3>
          <p className="text-secondary-light text-sm">Recent Trend</p>
        </div>

        <div className="bg-primary-dark rounded-2xl p-6 border border-border text-center">
          <div className="w-12 h-12 bg-warning-light rounded-full flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6 text-warning" />
          </div>
          <h3 className="text-2xl font-bold text-secondary mb-1">{overallStats.bestScore}%</h3>
          <p className="text-secondary-light text-sm">Best Score</p>
        </div>

        <div className="bg-primary-dark rounded-2xl p-6 border border-border text-center">
          <div className="w-12 h-12 bg-mint-light rounded-full flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6 text-mint" />
          </div>
          <h3 className="text-2xl font-bold text-secondary mb-1">{overallStats.totalAttempts}</h3>
          <p className="text-secondary-light text-sm">Total Attempts</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Score Trend Line Chart */}
        <div className="bg-primary-dark rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h3 className="text-xl font-bold text-secondary">Score Progression</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d7ccc8" />
              <XAxis dataKey="attempt" stroke="#5d4037" />
              <YAxis stroke="#5d4037" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "#fdf6e3",
                  border: "1px solid #d7ccc8",
                  borderRadius: "8px",
                  color: "#2c1810"
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#8b1538"
                fill="#f8d7da"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Domain Distribution Pie Chart */}
        <div className="bg-primary-dark rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-accent" />
            <h3 className="text-xl font-bold text-secondary">Domain Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={domainPieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {domainPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Domain Performance Table */}
      <div className="bg-primary-dark rounded-2xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-6">
          <Target className="w-5 h-5 text-accent" />
          <h3 className="text-xl font-bold text-secondary">Domain Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-secondary font-semibold">Domain</th>
                <th className="text-left py-3 px-4 text-secondary font-semibold">Attempts</th>
                <th className="text-left py-3 px-4 text-secondary font-semibold">Average Score</th>
                <th className="text-left py-3 px-4 text-secondary font-semibold">Best Score</th>
                <th className="text-left py-3 px-4 text-secondary font-semibold">Progress</th>
              </tr>
            </thead>
            <tbody>
              {domainStats.map((stat, index) => (
                <tr key={stat.domain} className="border-b border-border hover:bg-primary transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: getDomainColors(index) }}
                      ></div>
                      <span className="font-medium text-secondary">{stat.domain}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-secondary">{stat.attempts}</td>
                  <td className="py-4 px-4">
                    <span className={`font-semibold ${
                      stat.averageScore >= 80 ? "text-success" :
                      stat.averageScore >= 60 ? "text-warning" : "text-error"
                    }`}>
                      {stat.averageScore}%
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`font-semibold ${
                      stat.bestScore >= 80 ? "text-success" :
                      stat.bestScore >= 60 ? "text-warning" : "text-error"
                    }`}>
                      {stat.bestScore}%
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-full bg-secondary-lighter rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          stat.averageScore >= 80 ? "bg-success" :
                          stat.averageScore >= 60 ? "bg-warning" : "bg-error"
                        }`}
                        style={{ width: `${stat.averageScore}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Attempts Timeline */}
      <div className="bg-primary-dark rounded-2xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-accent" />
          <h3 className="text-xl font-bold text-secondary">Recent Activity</h3>
        </div>
        <div className="space-y-4">
          {dashboardData.recentScores.slice(0, 5).map((score, index) => (
            <div key={score.id} className="flex items-center justify-between p-4 bg-primary rounded-lg border border-border">
              <div className="flex items-center gap-4">
                <div className="text-secondary-light font-medium text-sm">
                  #{dashboardData.recentScores.length - index}
                </div>
                <div>
                  <p className="font-semibold text-secondary">{score.domainType}</p>
                  <p className="text-sm text-secondary-light">{formatDate(score.completedAt)}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                score.score >= 80 ? "bg-success-light text-success" :
                score.score >= 60 ? "bg-warning-light text-warning" : 
                "bg-error-light text-error"
              }`}>
                {Math.round(score.score)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}