import ArtistImages, { ArtistImagesCell } from '@/components/ArtistImages';
import ColorPicker from '@/components/ColorPicker';
import { content } from '@/fields/Content';
import { slug } from '@/fields/Slug';
import { status } from '@/fields/Status';
import { CollectionConfig } from 'payload/types';

const Artists: CollectionConfig = {
  slug: 'artists',
  admin: {
    // TODO: not working...
    defaultColumns: ['name'],
    useAsTitle: 'name',
    group: 'Content'
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
      name: 'useCustomImage',
      label: 'Use Custom Artist Image?',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          '⚠️ When a custom image is used, selecting an image below will have no effect.'
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
      name: 'setImageUrl',
      type: 'ui',
      admin: {
        components: {
          Field: ArtistImages,
          Cell: ArtistImagesCell
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
      name: 'discogsBio',
      label: 'Discogs Bio',
      type: 'textarea'
    },
    content,
    status
  ]
};

export default Artists;
