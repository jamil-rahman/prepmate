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
        `sticky top-0 z-50 bg-primary border-b rounded-bl-3xl rounded-br-3xl md:rounded-none border-default ` +
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
              className="text-xl font-bold text-primary hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded-sm transition-colors duration-200"
            >
              PrepMate
            </Link>
            <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-accent text-white">
              Demo
            </span>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center justify-end flex-1 gap-8">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-primary hover:text-accent px-3 py-2 rounded-md text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/domains"
                className="text-primary hover:text-accent px-3 py-2 rounded-md text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors duration-200"
              >
                Try Demo
              </Link>
            </div>

            {!loading && (
              user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {user.photoURL && (
                      <img
                        src={user.photoURL}
                        alt={`${user.displayName || user.email}'s profile`}
                        className="w-8 h-8 rounded-full border border-default flex-shrink-0"
                      />
                    )}
                    <span className="text-sm text-primary font-medium whitespace-nowrap">
                      {user.displayName?.split(" ")[0] || user.email?.split("@")[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-white hover:opacity-90 px-4 py-2 rounded-md text-sm font-medium bg-accent transition-colors duration-200 whitespace-nowrap"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="text-white hover:opacity-90 px-4 py-2 rounded-md text-sm font-medium bg-accent transition-colors duration-200"
                >
                  Sign In
                </Link>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={handleToggle}
              className="inline-flex items-center justify-center p-3 rounded-md text-primary hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors duration-200"
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
        <div className="px-4 pt-2 pb-4 space-y-1 border-t border-default bg-primary">
          <Link
            href="/"
            onClick={handleClose}
            className="block text-primary hover:text-accent px-3 py-3 rounded-md text-base font-medium transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            href="/domains"
            onClick={handleClose}
            className="block text-primary hover:text-accent px-3 py-3 rounded-md text-base font-medium transition-colors duration-200"
          >
            Try Demo
          </Link>
          {!loading && (
            user ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-3 px-3 py-2">
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt={`${user.displayName || user.email}'s profile`}
                      className="w-10 h-10 rounded-full border-2 border-default"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-primary font-medium">
                      {user.displayName || user.email}
                    </p>
                    <p className="text-xs text-secondary">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left text-white hover:opacity-80 px-3 py-3 rounded-md text-base font-medium bg-accent transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                onClick={handleClose}
                className="block text-white hover:opacity-80 px-3 py-3 rounded-md text-base font-medium bg-accent transition-colors duration-200"
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