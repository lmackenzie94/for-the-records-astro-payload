import RecordImages, { RecordImagesCell } from '@/components/RecordImages';
import { content } from '@/fields/Content';
import { slug } from '@/fields/Slug';
import { status } from '@/fields/Status';

import { CollectionConfig } from 'payload/types';

const isAdminOrCreatedBy = ({ req: { user } }) => {
  console.log('USER ', user);

  // TODO: comment back in to allow "admins" to view/edit/etc all records
  // Scenario #1 - Check if user has the 'admin' role
  // if (user && user.role === 'admin') {
  //   return true;
  // }

  // Scenario #2 - Allow only documents with the current user set to the 'createdBy' field
  if (user) {
    // Will return access for only documents that were created by the current user
    return {
      createdBy: {
        equals: user.id
      }
    };
  }

  // Scenario #3 - Disallow all others
  return false;
};

const Records: CollectionConfig = {
  slug: 'records',
  admin: {
    defaultColumns: ['title', 'artist', 'createdBy', 'status'],
    useAsTitle: 'title',
    group: 'Content'
  },
  access: {
    read: () => true,
    // read: isAdminOrCreatedBy, // TODO: doesn't work unless JWT is set in header (see utils/payload/records.ts)
    update: isAdminOrCreatedBy,
    delete: isAdminOrCreatedBy
  },
  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        if (operation === 'create') {
          if (req.user) {
            data.createdBy = req.user.id;
            return data;
          }
        }
      },
      async ({ req, operation, data }) => {
        if (operation === 'create') {
          // confirm "title" + "artist" combo is unique
          const { title, artist } = data;

          const existingRecord = await req.payload.find({
            collection: 'records',
            where: {
              title,
              artist,
              and: [
                {
                  title: {
                    equals: title
                  },
                  artist: {
                    equals: artist
                  }
                }
              ]
            }
          });

          if (existingRecord?.totalDocs > 0) {
            throw new Error(
              `A record with the same title and artist already exists.`
            );
          }

          return data;
        }
      }
    ],
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
      name: 'useCustomImage',
      label: 'Use Custom Record Image?',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          '⚠️ When a custom image is used, selecting an image below will have no effect.'
      }
    },
    {
      name: 'image',
      label: 'Record Image (Custom)',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData.useCustomImage
      }
    },
    {
      name: 'setImageUrl',
      type: 'ui',
      admin: {
        components: {
          Field: RecordImages,
          Cell: RecordImagesCell
        }
      }
    },

    // TODO: shouldn't actually need this - save the image url to the setImageUrl field
    {
      name: 'imageUrl',
      label: 'Image URL',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true
      }
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      access: {
        update: () => false
      },
      admin: {
        readOnly: true,
        position: 'sidebar',
        // hide from admin UI until there's a value...
        condition: (data) => Boolean(data?.createdBy)
      }
    },
    content,
    status
  ]
};

export default Records;
