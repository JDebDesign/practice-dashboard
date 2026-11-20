const isPages = process.env.DEPLOY_TARGET === 'pages';
const basePath = isPages ? (process.env.BASE_PATH ?? '') : '';

/** @type {import('next').NextConfig} */
const config = {
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...(isPages ? { output: 'export', basePath, trailingSlash: true, images: { unoptimized: true } } : {}),
};

export default config;
