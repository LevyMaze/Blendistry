// next-seo.config.js
const SEO = {
  title: "Blendistry – Tech Blogs",
  description: "Tech blogs, tutorials, and insights about web development, databases, and more.",
  canonical: "https://blendistry.vercel.app",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blendistry.vercel.app",
    site_name: "Blendistry",
    title: "Blendistry – Tech Blogs",
    description: "Learn web development, Next.js, databases, and more.",
    images: [
      {
        url: "/banner.png", 
        width: 1200,
        height: 630,
        alt: "Blendistry Banner",
      },
    ],
  },

  twitter: {
    handle: "@yourtwitter",
    site: "@yourtwitter",
    cardType: "summary_large_image", 
  },
};

export default SEO;
