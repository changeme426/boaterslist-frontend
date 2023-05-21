import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";

// TODO
// smart banner info: https://developer.apple.com/documentation/webkit/promoting_apps_with_smart_app_banners
class CustomDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="apple-itunes-app" content="app-id=1605256295" />
          <meta name="facebook-domain-verification" content="u6k3hqoq3013sltgpzgusgsrxt7s3x" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-3PXLYTPMLM" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3PXLYTPMLM', {
              page_path: window.location.pathname,
            });
          `,
            }} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-PLDVL4Z');
          `,
            }}
          />

          <script
            dangerouslySetInnerHTML={{
              __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '458649201894411');
              fbq('track', 'PageView');
          `,
            }} />
          <noscript>
            <img
              height="1"
              width="1"
              // @ts-ignore
              style={{ display: "none" }}
              src="https://www.facebook.com/tr?id=458649201894411&ev=PageView&noscript=1 " />
          </noscript>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default CustomDocument
