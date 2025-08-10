"use client";

import { useEffect, useState } from "react";
import type { Question } from "@/types";
import type { User as FirebaseUser } from "firebase/auth";

export function useQuestions(domain: string | null, user: FirebaseUser | null) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchQuestions = async (): Promise<void> => {
      try {
        setLoading(true);
        const headers: HeadersInit = {};
        if (user) {
          try {
            const idToken = await user.getIdToken();
            headers["Authorization"] = `Bearer ${idToken}`;
          } catch {
            // ignore token issues for demo
          }
        }
        const response = await fetch("/api/questions", { headers });
        if (!response.ok) throw new Error("Failed to fetch questions");
        const data = await response.json();
        let list: Question[] = data.data || [];
        if (domain && domain !== "all") {
          list = list.filter((q) => q.domainType === domain);
        }
        if (list.length === 0) throw new Error("No questions found for the selected domain");
        // Randomize order
        const randomized = [...list].sort(() => Math.random() - 0.5);
        if (isMounted) setQuestions(randomized);
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchQuestions();
    return () => {
      isMounted = false;
    };
  }, [domain, user]);

  return { questions, loading, error } as const;
}