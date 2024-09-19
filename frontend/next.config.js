const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
  });
  
  module.exports = {
    reactStrictMode: true,
    swcMinify: true,
    compiler: {
      removeConsole: process.env.NODE_ENV !== 'development'
    },
    ...withPWA,
    rewrites: async () => [
      {
        source: '/',
        destination: '/login',
      },
    ],
  };