// import { webpackBundler } from '@payloadcms/bundler-webpack';
import { viteBundler } from '@payloadcms/bundler-vite';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload/config';

import Artists from '@/collections/Artists';
import Genres from '@/collections/Genres';
import Media from '@/collections/Media';
import Records from '@/collections/Records';
import Users from '@/collections/Users';
import BeforeLogin from '@/components/BeforeLogin';
import DeployButton from '@/components/DeployButton';
import Icon from '@/components/Icon/Icon';
import SiteSettings from '@/globals/SiteSettings';
import dotenv from 'dotenv';
import path from 'path';

// TODO: add this?
// import seo from '@payloadcms/plugin-seo';

dotenv.config({
  path: path.resolve(__dirname, '../.env')
});

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  admin: {
    user: Users.slug,
    css: path.resolve(__dirname, './styles/custom.scss'),
    // bundler: webpackBundler(),
    bundler: viteBundler(),
    // vite: (config) => ({
    //   ...config,
    //   resolve: {
    //     ...config.resolve,
    //     alias: {
    //       ...config.resolve.alias,
    //       '@': path.resolve(__dirname, './')
    //     }
    //   }
    // }),
    // TODO: change to vite  (didn't work when I tried it)
    // this works b/c "we have implemented some "compatibility" between Webpack and Vite out-of-the-box." - Payload docs
    webpack: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@': path.resolve(__dirname, './')
        }
      }
    }),
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900
        }
      ]
    },
    autoLogin: {
      email: process.env.PAYLOAD_PUBLIC_AUTO_LOGIN_EMAIL,
      password: process.env.PAYLOAD_PUBLIC_AUTO_LOGIN_PASSWORD, // don't supply this in production
      prefillOnly: true
    },
    meta: {
      titleSuffix: '| For The Records.'
      // NOTE: /assets would work because of the config in server.ts
      // favicon: '/assets/favicon.svg',
      // ogImage: '/assets/logo.svg',
    },
    components: {
      beforeLogin: [BeforeLogin],
      afterNavLinks: [DeployButton],
      graphics: {
        // Logo, // Image component to be displayed as the logo on the Sign Up / Login view.
        Icon // Image component displayed above the Nav in the admin panel, often a condensed version of a full logo.
      }
    }
  },
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI
    }
  }),
  globals: [SiteSettings],
  collections: [Users, Media, Records, Artists, Genres],
  // plugins: [
  //   seo({
  //     collections: ['pages', 'posts'],
  //     uploadsCollection: 'media',
  //   }),
  // ],
  cors: ['http://localhost:3000'],
  csrf: [
    // TODO: need this?
    // whitelist of domains to allow cookie auth from
    'http://localhost:3001',
    'http://localhost:3000',
    'localhost',
    'localhost:3000'
  ].filter(Boolean),
  typescript: {
    outputFile: path.resolve(__dirname, 'types.ts')
  }
});
