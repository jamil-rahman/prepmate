import Link from "next/link";
import type { ReactElement } from "react";

export default function NotFound(): ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center bg-crisc-bg-dark">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-crisc-text-light mb-4">404 - Page Not Found</h1>
        <p className="text-crisc-text-light mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="text-crisc-text-light hover:opacity-80 px-6 py-3 rounded-lg font-medium bg-crisc-primary"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}