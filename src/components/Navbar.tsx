"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import type { ReactElement } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Navbar(): ReactElement {
  const { user, loading, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastYRef = useRef(0);

  const handleToggle = useCallback(() => setIsOpen((o) => !o), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  useEffect(() => {
    const onScroll = (): void => {
      const y = window.scrollY;
      const scrollingDown = y > lastYRef.current;

      // Do not hide while menu is open
      if (!isOpen) {
        if (y <= 8) {
          setIsHidden(false);
        } else if (scrollingDown) {
          setIsHidden(true);
        } else {
          setIsHidden(false);
        }
      }

      lastYRef.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isOpen]);

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <nav
      className={
        `sticky top-0 z-50 bg-crisc-navbar border-b rounded-bl-3xl rounded-br-3xl md:rounded-none border-crisc-primary ` +
        `transition-all duration-300 ease-out ` +
        (isHidden ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100")
      }
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex justify-between items-center h-20 md:h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              href="/"
              onClick={handleClose}
              className="text-xl font-bold text-crisc-text-light hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crisc-primary rounded-sm"
            >
              PrepMate
            </Link>
            <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-crisc-primary text-crisc-text-light">
              Demo
            </span>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="text-crisc-text-light hover:opacity-80 px-3 py-2 rounded-md text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crisc-primary"
              >
                Home
              </Link>
              <Link
                href="/domains"
                className="text-crisc-text-light hover:opacity-80 px-3 py-2 rounded-md text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crisc-primary"
              >
                Try Demo
              </Link>

              {!loading && (
                user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-crisc-text-light">
                      {user.displayName || user.email}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="text-crisc-text-light hover:opacity-80 px-4 py-2 rounded-md text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crisc-primary bg-crisc-primary"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth"
                    className="text-crisc-text-light hover:opacity-80 px-4 py-2 rounded-md text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crisc-primary bg-crisc-primary"
                  >
                    Sign In
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={handleToggle}
              className="inline-flex items-center justify-center p-3 rounded-md text-crisc-text-light hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crisc-primary"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Close main menu" : "Open main menu"}
            >
              {isOpen ? (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div id="mobile-menu" className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-4 pt-2 pb-4 space-y-1 border-t border-crisc-primary bg-crisc-navbar">
          <Link
            href="/"
            onClick={handleClose}
            className="block text-crisc-text-light hover:opacity-80 px-3 py-3 rounded-md text-base font-medium"
          >
            Home
          </Link>
          <Link
            href="/domains"
            onClick={handleClose}
            className="block text-crisc-text-light hover:opacity-80 px-3 py-3 rounded-md text-base font-medium"
          >
            Try Demo
          </Link>
          {!loading && (
            user ? (
              <button
                onClick={handleSignOut}
                className="w-full text-left text-crisc-text-light hover:opacity-80 px-3 py-3 rounded-md text-base font-medium bg-crisc-primary"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth"
                onClick={handleClose}
                className="block text-crisc-text-light hover:opacity-80 px-3 py-3 rounded-md text-base font-medium bg-crisc-primary"
              >
                Sign In for Progress
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}