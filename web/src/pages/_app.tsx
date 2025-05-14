import { GeistSans } from "geist/font/sans";

import { api } from "~/utils/api";

import "~/styles/globals.css";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";

type Config = {
  schema: string;
  appStoreUrl: string;
  fallbackDomain: string;
  ignoreUrls: string[];
};

const config: Config = {
  schema: "webpayments", // this is to open the app with schemas like webpayments://
  appStoreUrl: "https://apps.apple.com/us/app/your-app/idxxxxxxxxxx",
  // don't use this very same page or it will create an infinite loop
  // you can ignore urls to avoid it
  fallbackDomain: "https://yourfallbackdomain.com/ignored",
  ignoreUrls: ["https://yourfallbackdomain.com/ignored"],
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const queryString = new URLSearchParams(router.query as any).toString();
  const pathname = router.pathname;
  const [hasAttemptedRedirect, setHasAttemptedRedirect] = useState(false);

  useEffect(() => {
    if (hasAttemptedRedirect) return;

    const isFallbackUrl = config.ignoreUrls.some((url) =>
      window.location.href.includes(url),
    );
    if (isFallbackUrl) return;

    const userAgent = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    const isMac = /Mac/i.test(userAgent) && !isIOS;

    const customUrl = `${config.schema}://${pathname.slice(1)}${queryString ? `?${queryString}` : ""}`;

    window.location.href = customUrl;

    const timer = setTimeout(() => {
      setHasAttemptedRedirect(true);
      if (isIOS) {
        window.location.href = `${config.appStoreUrl}${queryString ? `?${queryString}` : ""}`;
      } else {
        window.location.href = `${config.fallbackDomain}${queryString ? `?${queryString}` : ""}`;
      }
      // you can use a different fallback url for macOS here
    }, 1_000);

    return () => clearTimeout(timer);
  }, [pathname, queryString, hasAttemptedRedirect]);

  if (!hasAttemptedRedirect) {
    return (
      <div className={GeistSans.className}>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h1>Opening the app...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className={GeistSans.className}>
      <Component {...pageProps} />
    </div>
  );
}

export default api.withTRPC(MyApp);
