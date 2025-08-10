import type { ReactElement } from "react";

export default function Loading(): ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4" />
        <p className="text-white text-xl">Loading quiz...</p>
      </div>
    </div>
  );
}