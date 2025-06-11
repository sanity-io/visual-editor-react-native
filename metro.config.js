const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  events: path.resolve(__dirname, 'node_modules/events'),
  crypto: path.resolve(__dirname, 'node_modules/crypto-browserify'),
  'node:crypto': path.resolve(__dirname, 'node_modules/crypto-browserify'),
  stream: path.resolve(__dirname, 'node_modules/stream-browserify'),
  process: path.resolve(__dirname, 'node_modules/process/browser'),
  buffer: path.resolve(__dirname, 'node_modules/buffer'),
};

module.exports = config;