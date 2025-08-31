export default {
  title: "Blendistry – Tech Blogs",
  description: "Blendistry is a knowledge platform dedicated to clear, practical, and disciplined guidance in web development.",
  canonical: "https://blendistry.vercel.app",
  openGraph: {
    type: "website",
    url: "https://blendistry.vercel.app",
    site_name: "Blendistry",
    images: [
      {
        url: "https://blendistry.vercel.app/banner.png", 
        width: 810,
        height: 360,
        alt: "Blendistry Banner",
      },
    ],
  },
  twitter: {
    cardType: "summary_large_image",
    images: [
      "https://blendistry.vercel.app/banner.png",
      "https://blendistry.vercel.app/logo-dark.png",
    ],
  },
  additionalMetaTags: [
    { name: "robots", content: "index, follow" },
    { name: "author", content: "Blendistry" },
    { name: "theme-color", content: "#000000" },
  ],
};
