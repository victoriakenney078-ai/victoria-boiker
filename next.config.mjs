/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (dev) config.output.chunkLoadTimeout = 300000;
    return config;
  },
  images: {
    loader: "custom",
    loaderFile: "./lib/artworkLoader.js",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/commons/**",
      },
    ],
  },
};

export default nextConfig;
