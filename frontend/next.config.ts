import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the Next.js development client load through the current ngrok tunnel.
  allowedDevOrigins: ["a2df-222-124-76-238.ngrok-free.app"],
  // Keep API calls and auth cookies on the frontend's public origin. This avoids
  // mobile browsers rejecting cookies sent between separate ngrok subdomains.
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: "http://127.0.0.1:8000/:path*",
      },
    ];
  },
};

export default nextConfig;
