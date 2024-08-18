/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    remotePatterns: [
      { hostname: "localhost" },
      { hostname: "images.unsplash.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "drive.google.com" },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      require("fs").cpSync("src/locales", "public/locales", {
        recursive: true,
      });
    }
    return config;
  },
};
export default nextConfig;
