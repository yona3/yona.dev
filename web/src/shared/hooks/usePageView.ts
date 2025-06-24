import { useRouter } from "next/router";
import { useEffect } from "react";

import { gtagProvider } from "@/infrastructure/analytics/gtag";

export const usePageView = () => {
  const router = useRouter();

  useEffect(() => {
    if (!gtagProvider.isEnabled()) return;

    const handleRouteChange = (
      path: string,
      { shallow }: { shallow: boolean },
    ) => {
      if (!shallow) gtagProvider.trackPageView(path);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
};
