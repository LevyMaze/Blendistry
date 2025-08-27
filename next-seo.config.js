// next-seo.config.js
export default {
  title: "Blendistry – Tech Blogs",
  description:
    "Learn web development, Next.js, databases, and more.",
  openGraph: {
    type: "website",
    url: "https://blendistry.vercel.app",
    site_name: "Blendistry",
    images: [
      {
        url: "https://blendistry.vercel.app/banner.png", // 🔥 full URL
        width: 1200,
        height: 630,
        alt: "Blendistry Banner",
      },
    ],
  },
  twitter: {
    cardType: "summary_large_image",
    site: "@yourtwitter",
    creator: "@yourtwitter",
  },
};
