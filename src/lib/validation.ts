/**
 * Input validation and sanitization utilities
 * Helps prevent XSS and injection attacks
 */

/**
 * Sanitize string input by removing potentially dangerous characters
 */
export function sanitizeString(input: string): string {
  if (typeof input !== "string") return "";
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .replace(/javascript:/gi, "") // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, "") // Remove event handlers like onclick=
    .slice(0, 1000); // Limit length to prevent DoS
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (typeof email !== "string" || email.length > 254) return false;
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validate user name (optional field)
 */
export function isValidName(name: string | null | undefined): boolean {
  if (!name) return true; // Name is optional
  if (typeof name !== "string") return false;
  if (name.length < 1 || name.length > 100) return false;
  
  // Only allow letters, spaces, hyphens, apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  return nameRegex.test(name);
}

/**
 * Sanitize user input for database storage
 */
export function sanitizeUserInput(input: {
  email?: string;
  name?: string | null;
}): { email: string; name: string | null } {
  return {
    email: sanitizeString(input.email || ""),
    name: input.name ? sanitizeString(input.name) : null,
  };
}