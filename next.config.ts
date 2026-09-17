import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Les couvertures uploadées depuis l'éditeur admin sont servies par l'API elle-même
// (/uploads/*, voir ServeStaticModule côté backend) — next/image doit connaître cet hôte pour
// accepter de les optimiser.
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const apiUrl = apiBaseUrl ? new URL(apiBaseUrl) : undefined;

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: apiUrl
    ? {
        remotePatterns: [
          {
            protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
            hostname: apiUrl.hostname,
            port: apiUrl.port,
            pathname: "/uploads/**",
          },
        ],
      }
    : undefined,
};

export default withNextIntl(nextConfig);
