"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import type { ReactElement } from "react";

export default function ConditionalNavbar(): ReactElement | null {
  const pathname = usePathname();
  
  // Hide navbar on dashboard pages
  if (pathname.startsWith("/dashboard")) {
    return null;
  }
  
  return <Navbar />;
}
