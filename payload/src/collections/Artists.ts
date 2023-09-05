import StatusField from '@/fields/Status';
import ContentField from '@/fields/content';
import { CollectionConfig } from 'payload/types';

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

export default Artists;
