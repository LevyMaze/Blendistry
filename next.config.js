// next.config.js
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
});

const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  devIndicators: {
    buildActivity: false,
  },
  images: {
    unoptimized: true, 
  },
};

module.exports = withMDX(nextConfig);
