import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Standalone output keeps the prod Docker image small (~150MB vs ~800MB).
  // Skip on Windows local builds — Next's standalone tracer creates symlinks
  // and Windows blocks symlink creation without admin / dev mode, which
  // breaks `next build` on the dev's laptop. The Docker build runs on Linux
  // so it gets standalone unconditionally. Set BUILD_STANDALONE=1 to force.
  output:
    process.env.BUILD_STANDALONE === '1' || process.platform !== 'win32'
      ? 'standalone'
      : undefined,
};

export default withNextIntl(nextConfig);
