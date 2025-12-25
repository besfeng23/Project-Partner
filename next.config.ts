import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental:
    process.env.NODE_ENV === 'development'
      ? ({
          // This is to allow cross-origin requests in development.
          // The dev environment in Firebase Studio uses a different origin.
          allowedDevOrigins: ['https://*.cloudworkstations.dev'],
        } as any)
      : {},
};

export default nextConfig;
