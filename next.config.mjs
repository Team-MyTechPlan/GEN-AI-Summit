import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
      copyLocales();
    }
    return config;
  },
};

async function copyLocales() {
  try {
    await fs.cp(
      join(__dirname, "src", "locales"),
      join(__dirname, "public", "locales"),
      { recursive: true }
    );
    console.log("Locales copied successfully");
  } catch (error) {
    console.error("Error copying locales:", error);
  }
}

export default nextConfig;
