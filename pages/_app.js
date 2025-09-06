// pages/_app.js
import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Loader from "../components/Loader";
import { DefaultSeo } from "next-seo";
import SEO from "../next-seo.config"; 

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
      <DefaultSeo {...SEO} /> {/* 👈 Global SEO here */}
      {loading && <Loader />}
      <Layout categories={pageProps.categories || []}>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;
