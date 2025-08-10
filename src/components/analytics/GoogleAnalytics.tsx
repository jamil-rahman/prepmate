"use client";

import type { ReactElement } from "react";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

export type GoogleAnalyticsProps = {
  measurementId: string;
};

/** Google Analytics loader and route change tracker for Next.js App Router */
export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps): ReactElement | null {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!measurementId || typeof window === "undefined" || typeof window.gtag !== "function") {
      return;
    }
    const url = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
    window.gtag("config", measurementId, { page_path: url });
  }, [measurementId, pathname, searchParams]);

  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}


