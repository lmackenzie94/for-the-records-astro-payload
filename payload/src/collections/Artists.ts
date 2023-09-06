import { status } from '@/fields/Status';
import { content } from '@/fields/Content';
import { CollectionConfig } from 'payload/types';
import { slug } from '@/fields/Slug';

const Artists: CollectionConfig = {
  slug: 'artists',
  admin: {
    // TODO: not working...
    defaultColumns: ['name'],
    useAsTitle: 'name'
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
      name: 'name',
      type: 'text',
      required: true
    },
    slug('name'),
    {
      name: 'genres',
      label: 'Genre(s)',
      relationTo: 'genres',
      type: 'relationship',
      hasMany: true
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

export default Artists;
