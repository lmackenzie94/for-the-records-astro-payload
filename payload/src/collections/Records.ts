import StatusField from '@/fields/Status';
import ContentField from '@/fields/content';
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
      type: 'text'
    },
    {
      name: 'artist',
      type: 'relationship',
      relationTo: 'artists',
      hasMany: true
    },
    {
      name: 'label',
      type: 'text'
    },
    {
      name: 'genre',
      label: 'Genre(s)',
      type: 'text',
      admin: {
        description: 'Separate multiple genres with a comma'
      }
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
    ContentField,
    StatusField
  ]
};

export default Records;
