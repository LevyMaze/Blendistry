// next-seo.config.js
export default {
  title: "Blendistry",
  description: "Your source for development guides, blogs, and resources.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blendistry.vercel.app/",
    siteName: "Blendistry",
    images: [
      {
        url: "https://blendistry.vercel.app/banner.png", 
        width: 1200,
        height: 630,
        alt: "Blendistry Banner"
      }
    ]
  },
  twitter: {
    cardType: "summary_large_image"
  }
};
