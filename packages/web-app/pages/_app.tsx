import "web-app/styles/globals.css";
import * as gtag from 'web-app/lib/gtag'
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import theme from "common/theme";
import { RecoilRoot } from "recoil";
import Header from "web-app/components/Common/Header";
import Footer from "web-app/components/Common/Footer";
import Script from 'next/script'
import { UserProvider } from '@auth0/nextjs-auth0'
import React from "react"

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  React.useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&language=en`}
        strategy="beforeInteractive"
      />
      <RecoilRoot>
        <UserProvider>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </UserProvider>
      </RecoilRoot>
      <style jsx global>{`
      .boaterslistContainer{
        padding: 30px;
        max-width: 700px;
        text-align: left;
        margin: auto;
        boatersListSubtitle;
      }
      .boaterslistTitle{
          font-size: ${theme.boaterslistInfo.titleFontSize}px;
          font-weight: ${theme.boaterslistInfo.titleFontWeight};
          margin-bottom: ${theme.boaterslistInfo.titleMarginBottom}px;
          margin-top: ${theme.boaterslistInfo.titleMarginTop}px;
      }
      .boatersListSubtitle{
          font-size: ${theme.boaterslistInfo.subtitleFontSize}px;
          font-weight: ${theme.boaterslistInfo.subtitleFontWeight};
          margin-top: ${theme.boaterslistInfo.subtitleMarginTop}px;
          margin-bottom: ${theme.boaterslistInfo.subtitleMarginBottom}px;
      }
      .boatersListEmailFormat{
          color: ${theme.colors.brandBlue};
          cursor: pointer;
          font-weight: 500;
          text-decoration: none;
      }
      .errorText{
        color: ${theme.colors.brandRedError};
        margin: 5px;
        display:block;
        font-size: 12px;
      }
    `}</style>
    </>
  );
}

export default MyApp;
