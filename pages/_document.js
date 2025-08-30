import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon (x-icon) */}
        <link rel="icon" href="/logo-dark.png" type="image/png" />

        {/* Optional: Apple touch icon */}
        <link rel="apple-touch-icon" href="/logo-dark.png" />

        {/* Optional: theme color */}
        <meta name="theme-color" content="#000000" />
        <meta name="google-site-verification" content="QF9j4CbqXR08yIOHz0e4uIfPUDscChqUjsQtB6IEo_c"/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
