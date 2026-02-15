"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import * as gtag from "../utils/gtag";

export const usePageView = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!gtag.GA_ID || !pathname) return;

    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;
    gtag.pageview(path);
  }, [pathname, searchParams]);
};
