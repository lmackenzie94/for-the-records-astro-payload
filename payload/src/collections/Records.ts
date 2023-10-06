import ColorPicker from '@/components/ColorPicker';
import RecordData, { RecordDataCell } from '@/components/RecordData';
import { content } from '@/fields/Content';
import { slug } from '@/fields/Slug';
import { status } from '@/fields/Status';

import { CollectionConfig } from 'payload/types';

const isAdminOrCreatedBy = ({ req: { user } }) => {
  console.log('CURRENT USER ', user);

  // TODO: comment back in to allow "admins" to view/edit/etc all records (in the CMS)
  // Scenario #1 - Check if user has the 'admin' role
  if (user && user.role === 'admin') {
    return true;
  }

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
    // TODO: doesn't work on front-end - req.user is undefined
    // read: ({ req }) => {
    //   console.log('USER: ', req.user);
    //   // any authenticated user can read (i.e. see) all records, even those created by others
    //   if (req.user) {
    //     return true;
    //   }

    //   return false;
    // },
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
        console.log('GIT HUB TOKEN: ', process.env.TOKEN);
        console.log('REPOSITORY: ', process.env.REPOSITORY);

        // try {
        //   // process.env.NODE_ENV !== 'development' &&

        //   const res = await fetch(
        //     `https://api.github.com/repos/${process.env.REPOSITORY}/dispatches`,
        //     {
        //       method: 'POST',
        //       headers: {
        //         Accept: 'application/vnd.github.everest-preview+json',
        //         Authorization: `token ${process.env.TOKEN}`
        //       },
        //       body: JSON.stringify({
        //         event_type: 'payload_update'
        //       })
        //     }
        //   );

        //   const data = await res.json();
        //   console.log('GITHUB DISPATCH RESPONSE: ', data);
        // } catch (e) {
        //   console.log(e);
        // }
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
      name: 'releaseYear',
      type: 'text',
      label: 'Release Year',
      minLength: 4,
      maxLength: 4
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

    // TODO: why is this component editable for users who didn't create the record - should be greyed out
    {
      name: 'setImageUrl',
      type: 'ui',
      admin: {
        components: {
          Field: RecordData,
          Cell: RecordDataCell
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
        readOnly: true,
        hidden: true
      }
    },
    {
      name: 'favouriteTracks',
      label: 'Favourite Tracks',
      type: 'array',
      labels: {
        singular: 'Track',
        plural: 'Tracks'
      },

      fields: [
        {
          name: 'title',
          type: 'text',
          required: true
        },
        {
          name: 'notes',
          type: 'textarea'
        }
      ]
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
    {
      name: 'themeColor',
      label: 'Theme Color',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Use the colour picker below OR enter a hex value.'
      }
    },
    {
      name: 'colorPickerRecords',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: ColorPicker
        }
      }
    },
    content,
    status
  ]
};

export default Records;
