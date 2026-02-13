"use client";

import Script from "next/script";

interface AnalyticsProps {
  yandexMetrikaId?: string;
  googleAnalyticsId?: string;
}

type WindowWithAnalytics = Window & {
  ym?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
};

/**
 * Analytics component for Yandex.Metrika and Google Analytics
 *
 * Usage in layout.tsx:
 * <Analytics
 *   yandexMetrikaId="12345678"
 *   googleAnalyticsId="G-XXXXXXXXXX"
 * />
 */
export function Analytics({
  yandexMetrikaId = "",
  googleAnalyticsId = "",
}: AnalyticsProps) {
  // Don't render anything in development or if no IDs provided
  if (process.env.NODE_ENV === "development") {
    return null;
  }

  return (
    <>
      {/* Yandex.Metrika */}
      {yandexMetrikaId && (
        <>
          <Script id="yandex-metrika" strategy="afterInteractive">
            {`
                            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                            m[i].l=1*new Date();
                            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

                            ym(${yandexMetrikaId}, "init", {
                                ssr:true,
                                clickmap:true,
                                trackLinks:true,
                                accurateTrackBounce:true,
                                webvisor:true,
                                ecommerce:"dataLayer",
                                referrer: document.referrer,
                                url: location.href
                            });
                        `}
          </Script>
          <noscript>
            <div>
              <img
                src={`https://mc.yandex.ru/watch/${yandexMetrikaId}`}
                style={{ position: "absolute", left: "-9999px" }}
                alt=""
              />
            </div>
          </noscript>
        </>
      )}

      {/* Google Analytics */}
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${googleAnalyticsId}', {
                                page_title: document.title,
                                page_location: window.location.href,
                            });
                        `}
          </Script>
        </>
      )}
    </>
  );
}

/**
 * Helper function to track custom events
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, unknown>,
) {
  const analyticsWindow =
    typeof window !== "undefined" ? (window as WindowWithAnalytics) : undefined;

  // Yandex.Metrika
  if (analyticsWindow?.ym) {
    analyticsWindow.ym("reachGoal", eventName, eventParams);
  }

  // Google Analytics
  if (analyticsWindow?.gtag) {
    analyticsWindow.gtag("event", eventName, eventParams);
  }
}
