import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.openverse.org",
        pathname: "/v1/images/*/thumb/",
      },
    ],
  },
};

export default nextConfig;
