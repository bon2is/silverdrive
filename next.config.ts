import type { NextConfig } from "next";

const isAppBuild = process.env.BUILD_TARGET === "app";

const nextConfig: NextConfig = {
  ...(isAppBuild && {
    output: "export",
    trailingSlash: true,
    images: { unoptimized: true },
  }),
  turbopack: {},
};

export default nextConfig;
