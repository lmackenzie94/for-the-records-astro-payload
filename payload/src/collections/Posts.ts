// ! NOTE USED: KEEEPING FOR REFERENCE

import { content } from '@/fields/Content';
import { status } from '@/fields/Status';

import { CollectionConfig } from 'payload/types';

const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    // defaultColumns: ['title', 'author', 'status'],
    useAsTitle: 'title'
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true
  },
  hooks: {
    afterChange: [
      async () => {
        console.log(process.env.TOKEN);

        try {
          process.env.NODE_ENV !== 'development' &&
            console.log(
              await fetch(
                `https://api.github.com/repos/${process.env.REPOSITORY}/dispatches`,
                {
                  method: 'POST',
                  headers: {
                    Accept: 'application/vnd.github.everest-preview+json',
                    Authorization: `token ${process.env.TOKEN}`
                  },
                  body: JSON.stringify({
                    event_type: 'payload_update'
                  })
                }
              )
            );
        } catch (e) {
          console.log(e);
        }
      }
    ]
  },
  fields: [
    {
      name: 'title',
      type: 'text'
    },
    {
      name: 'hallo',
      type: 'text'
    },
    {
      name: 'publishedDate',
      type: 'date'
    },
    content,
    status
  ]
};

export default Posts;
