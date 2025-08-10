"use client";

import Link from "next/link";
import { memo } from "react";
import type { ReactElement, ReactNode, ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "outline";

export interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  ariaLabel?: string;
  className?: string;
}

/** Renders a themed link styled as a button */
function ButtonLinkBase({ href, children, variant = "primary", ariaLabel, className }: ButtonLinkProps): ReactElement {
  const base =
    "px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-fluid-button sm:text-lg transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crisc-primary hover:opacity-80 whitespace-normal break-words";

  const byVariant: Record<ButtonVariant, string> = {
    primary: "bg-crisc-primary text-crisc-text-light",
    outline: "border border-crisc-primary text-crisc-text-light",
  };

  return (
    <Link href={href} aria-label={ariaLabel} className={`${base} ${byVariant[variant]} ${className ?? ""}`.trim()}>
      {children}
    </Link>
  );
}

export const ButtonLink = memo(ButtonLinkBase);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

/** Renders a themed button element */
function ButtonBase({ children, variant = "primary", className, ...rest }: ButtonProps): ReactElement {
  const base =
    "px-5 sm:px-6 py-3 rounded-lg font-medium text-fluid-button sm:text-base transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crisc-primary hover:opacity-80 whitespace-normal break-words";
  const byVariant: Record<ButtonVariant, string> = {
    primary: "bg-crisc-primary text-crisc-text-light",
    outline: "border border-crisc-primary text-crisc-text-light",
  };
  return (
    <button {...rest} className={`${base} ${byVariant[variant]} ${className ?? ""}`.trim()}>
      {children}
    </button>
  );
}

export const Button = memo(ButtonBase);