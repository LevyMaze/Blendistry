import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon & Apple Touch Icon */}
        <link rel="icon" href="/logo-dark.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-dark.png" />

        {/* Theme Color */}
        <meta name="theme-color" content="#000000" />

        {/* Google Verification */}
        <meta name="google-site-verification" content="QF9j4CbqXR08yIOHz0e4uIfPUDscChqUjsQtB6IEo_c" />

        {/* Adsense */}
        <meta name="google-adsense-account" content="ca-pub-6292074442578461" />

        {/* JSON-LD Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Blendistry",
              url: "https://blendistry.vercel.app",
              publisher: {
                "@type": "Organization",
                name: "Blendistry",
                logo: {
                  "@type": "ImageObject",
                  url: "https://blendistry.vercel.app/logo-dark.png",
                  width: 512,
                  height: 512,
                },
              },
              potentialAction: {
                "@type": "SearchAction",
                target: "https://blendistry.vercel.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
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
