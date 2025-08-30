// next.config.js
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/, // handle .mdx and .md
});

const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", 'ts', 'tsx', "md", "mdx"], // allow .mdx pages
  devIndicators: {
    buildActivity: false,
  },
};

module.exports = withMDX(nextConfig);
