/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: "/feed", destination: "http://localhost:4000/feed" },
      { source: "/swipe", destination: "http://localhost:4000/swipe" },
      { source: "/matches", destination: "http://localhost:4000/matches" },
    ];
  },
};

export default nextConfig;