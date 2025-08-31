// _document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/logo-dark.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-dark.png" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="google-site-verification"
          content="QF9j4CbqXR08yIOHz0e4uIfPUDscChqUjsQtB6IEo_c"
        />
        <meta name="google-adsense-account" content="ca-pub-6292074442578461" />

        {/* JSON-LD Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Blendistry",
              "url": "https://blendistry.vercel.app",
              "logo": "https://blendistry.vercel.app/logo-dark.png"
            }),
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
