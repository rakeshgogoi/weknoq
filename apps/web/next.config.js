/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "vimeo.com" },
      { protocol: "https", hostname: "*.vimeocdn.com" },
      { protocol: "https", hostname: "pi.tedcdn.com" },
    ],
  },
  experimental: {
    // allow importing from the shared packages
    externalDir: true,
  },
};

module.exports = nextConfig;
