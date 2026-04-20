import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../"),
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'backend.findonrent.com',
        pathname: '/uploads/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200], /** 640, 750, 828, 1080, 1200 */
    formats: ['image/avif', 'image/webp'],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/category-model-location-:page.xml",
        destination: "/category-model-location/:page",
      },
      {
        source: "/category-model-:page.xml",
        destination: "/category-model/:page",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/services/vehicles/cars",
        destination: "/cars",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/Vehicle/bhopal",
        destination: "/bhopal",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/Vehicle/patna",
        destination: "/patna",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/Vehicle/jammu",
        destination: "/jammu",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/Vehicle/manali",
        destination: "/manali",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/Vehicle/pune",
        destination: "/pune",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/Vehicle/gurugram",
        destination: "/gurugram",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/Vehicle/delhi",
        destination: "/delhi",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/Vehicle/noida",
        destination: "/noida",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/Vehicle/jaipur",
        destination: "/jaipur",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/Vehicle/goa",
        destination: "/goa",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/Vehicle/ahmedabad",
        destination: "/ahmedabad",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/Vehicle/shimla",
        destination: "/shimla",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/Vehicle/hyderabad",
        destination: "/hyderabad",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/Vehicle/bangalore",
        destination: "/bangalore",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/scooters/jammu",
        destination: "/scooty-scooters/jammu",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/scooters",
        destination: "/scooty-scooters",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/scooters/goa",
        destination: "/scooty-scooters/goa",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/scooters/dehradun",
        destination: "/scooty-scooters/dehradun",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/scooters/hyderabad",
        destination: "/scooty-scooters/hyderabad",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/scooters/rishikesh",
        destination: "/scooty-scooters/rishikesh",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/scooters/gurugram",
        destination: "/scooty-scooters/gurugram",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/scooters/pune",
        destination: "/scooty-scooters/pune",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/scooters/patna",
        destination: "/scooty-scooters/patna",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/scooters/agra",
        destination: "/scooty-scooters/agra",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/scooters/ahmedabad",
        destination: "/scooty-scooters/ahmedabad",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/scooters/bangalore",
        destination: "/scooty-scooters/bangalore",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/scooters/bhopal",
        destination: "/scooty-scooters/bhopal",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/scooters/delhi",
        destination: "/scooty-scooters/delhi",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/scooters/dharamsala",
        destination: "/scooty-scooters/dharamsala",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/scooters/jaipur",
        destination: "/scooty-scooters/jaipur",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/scooters/jaisalmer",
        destination: "/scooty-scooters/jaisalmer",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/scooters/manali",
        destination: "/scooty-scooters/manali",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/scooters/meerut",
        destination: "/scooty-scooters/meerut",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/scooters/noida",
        destination: "/scooty-scooters/noida",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/scooters/shimla",
        destination: "/scooty-scooters/shimla",
        statusCode: 301, /** 301 Permanent redirect */
      },
      {
        source: "/scooters/udaipur-rajasthan",
        destination: "/scooty-scooters/udaipur-rajasthan",
        statusCode: 301, /** 301 Permanent redirect */
      },
    ];
  },
};

export default nextConfig;
