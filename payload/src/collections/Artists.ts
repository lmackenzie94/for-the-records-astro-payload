import ArtistData, { ArtistDataCell } from '@/components/ArtistData';
import ColorPicker from '@/components/ColorPicker';
import { content } from '@/fields/Content';
import { slug } from '@/fields/Slug';
import { status } from '@/fields/Status';
import { CollectionConfig } from 'payload/types';

const isAdminOrCreatedBy = ({ req: { user } }) => {
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

const Artists: CollectionConfig = {
  slug: 'artists',
  admin: {
    // TODO: not working...
    defaultColumns: ['name'],
    useAsTitle: 'name',
    group: 'Content',
    livePreview: {
      url: ({ data }) =>
        // `${process.env.PAYLOAD_PUBLIC_SITE_URL}/artists/${data.slug}` .env var wasn't working on prod
        process.env.NODE_ENV === 'development'
          ? `http://localhost:3000/artists/${data.slug}`
          : `https://for-the-records.com/artists/${data.slug}`
    }
  },
  access: {
    // TODO: doesn't work on front-end - req.user is undefined
    // read: ({ req }) => {
    //   // any authenticated user can read (i.e. see) all artists, even those created by others
    //   if (req.user) {
    //     return true;
    //   }

    //   return false;
    // },
    read: () => true,
    update: isAdminOrCreatedBy,
    delete: isAdminOrCreatedBy
  },
  hooks: {
    // afterChange: [
    //   async () => {
    //     console.log(process.env.TOKEN);
    //     try {
    //       process.env.NODE_ENV !== 'development' &&
    //         console.log(
    //           await fetch(
    //             `https://api.github.com/repos/${process.env.REPOSITORY}/dispatches`,
    //             {
    //               method: 'POST',
    //               headers: {
    //                 Accept: 'application/vnd.github.everest-preview+json',
    //                 Authorization: `token ${process.env.TOKEN}`
    //               },
    //               body: JSON.stringify({
    //                 event_type: 'payload_update'
    //               })
    //             }
    //           )
    //         );
    //     } catch (e) {
    //       console.log(e);
    //     }
    //   }
    // ]
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
      name: 'setImageUrl',
      type: 'ui',
      admin: {
        components: {
          Field: ArtistData,
          Cell: ArtistDataCell
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
      name: 'themeColor',
      label: 'Theme Color',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Use the colour picker below OR enter a hex value.'
      }
    },
    {
      name: 'colorPickerArtists',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: ColorPicker
        }
      }
    },
    {
      name: 'useCustomImage',
      label: 'Use Custom Artist Image',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'When a custom image is used, selecting an image below will have no effect.'
      }
    },
    {
      name: 'image',
      label: 'Artist Image (Custom)',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData.useCustomImage
      }
    },
    {
      name: 'discogsBio',
      label: 'Discogs Bio',
      type: 'textarea'
    },
    {
      name: 'hideDiscogsBio',
      label: 'Hide Discogs Bio?',
      type: 'checkbox',
      defaultValue: false
    },
    content,
    status
  ]
};

export default Artists;
