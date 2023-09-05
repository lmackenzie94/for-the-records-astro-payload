import { Field } from 'payload/types';

export const content: Field = {
  name: 'content',
  type: 'richText',
  admin: {
    elements: ['h2', 'h3', 'h4', 'link', 'ol', 'ul', 'upload'],
    leaves: ['bold', 'italic', 'underline'],
    upload: {
      collections: {
        media: {
          fields: [
            {
              name: 'imagel',
              type: 'upload',
              relationTo: 'media',
              required: true
            }
          ]
        }
      }
    }
  }
};
