import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { Inter, Montserrat } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrepMate",
  description: "Practice MCQs with explanations. Demo app.",
  authors: [{ name: "Mohd Jamilur Rahman Shaan", url: "" }, { name: "Sameer Lal", url: "" }],
  creator: "Mohd Jamilur Rahman Shaan and Sameer Lal",
  publisher: "Mohd Jamilur Rahman Shaan and Sameer Lal",
  // metadataBase: new URL("https://crisc-quiz.vercel.app"),
  openGraph: {
    title: "PrepMate",
    description: "Practice MCQs with explanations. Demo app.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>): ReactElement {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="antialiased min-h-screen bg-crisc-bg-dark text-crisc-text-light">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}