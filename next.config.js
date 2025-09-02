/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const nextConfig = {
  images: {
    domains: [
      'grabhotel-v2-dev.s3.ap-southeast-1.amazonaws.com',
      's3.ap-southeast-1.amazonaws.com',
      'vtradebucket.s3.ap-southeast-1.amazonaws.com',
    ],
  },
  sassOptions: {
    includePaths: [path.resolve(__dirname, 'src/styles')],
  },
  // exclude: path.resolve(__dirname, 'src/assets/icons'),
  webpack: (config) => {
    // Resolve modules in src dir
    config.resolve.modules.push(path.resolve(__dirname, 'src'));
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        { loader: 'babel-loader' },
        {
          loader: '@svgr/webpack',
          options: {
            babel: false,
          },
        },
      ],
    });
    return config;
  },
};

module.exports = nextConfig;
