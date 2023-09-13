import { buildConfig } from 'payload/config';

import Artists from '@/collections/Artists';
import Genres from '@/collections/Genres';
import Media from '@/collections/Media';
import Records from '@/collections/Records';
import Users from '@/collections/Users';
import path from 'path';

export default buildConfig({
  serverURL: process.env.PAYLOAD_URL,
  admin: {
    user: Users.slug,
    webpack: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@': path.resolve(__dirname, './')
        }
      }
    })
  },
  collections: [Users, Media, Records, Artists, Genres],
  cors: '*', //TODO: change this
  csrf: [
    // TODO: need this?
    // whitelist of domains to allow cookie auth from
    'payload:3001',
    'http://localhost:3001',
    'http://localhost:3000'
  ].filter(Boolean),
  typescript: {
    outputFile: path.resolve('/', 'types.ts')
  }
});
