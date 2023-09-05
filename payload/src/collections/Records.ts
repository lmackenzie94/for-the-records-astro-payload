import { status } from '@/fields/Status';
import { content } from '@/fields/Content';
import { slug } from '@/fields/Slug';

import { CollectionConfig } from 'payload/types';

const Records: CollectionConfig = {
  slug: 'records',
  admin: {
    // defaultColumns: ["title", "author", "status"],
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
      type: 'text',
      required: true
    },
    // since configuration is in code we can call functions to define data structures dynamically in a reusable way
    slug(),
    {
      name: 'artist',
      type: 'relationship',
      relationTo: 'artists',
      hasMany: true,
      required: true
    },
    {
      name: 'label',
      type: 'text'
    },
    {
      name: 'genres',
      label: 'Genre(s)',
      relationTo: 'genres',
      type: 'relationship',
      hasMany: true,
      required: true
    },
    {
      name: 'releaseDate',
      type: 'date'
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true
    },
    content,
    status
  ]
};

export default Records;
