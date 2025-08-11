import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  api: {
    bodyParser: {
      sizeLimit: '500mb'
    },
    responseLimit: '500mb'
  }
};

export default nextConfig;
