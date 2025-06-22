import { useRouter } from "next/router";
import { useEffect } from "react";

import * as gtag from "../utils/gtag";

export const usePageView = () => {
  const router = useRouter();

  useEffect(() => {
    if (!gtag.GA_ID) return;

    const handleRouteChange = (
      path: string,
      { shallow }: { shallow: boolean },
    ) => {
      if (!shallow) gtag.pageview(path);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
};
