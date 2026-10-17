/** @type {import('next').NextConfig} */
const nextConfig = {
  // Inlined at build time so dynamic pages report the same commit as static
  // ones. COMMIT_REF is set by Netlify builds and by the Actions workflow.
  env: { BUILD_SHA: process.env.COMMIT_REF ?? "dev" },
};

export default nextConfig;
