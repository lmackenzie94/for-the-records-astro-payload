import {
  LinkFeature,
  UploadFeature,
  lexicalEditor
} from '@payloadcms/richtext-lexical';
import { Field } from 'payload/types';
// import { Banner } from '../blocks/Banner'
// import { CallToAction } from '../blocks/CallToAction'

export const content: Field = {
  name: 'content',
  type: 'richText',
  // Pass the Lexical editor here and override base settings as necessary
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      LinkFeature({
        // Example showing how to customize the built-in fields
        // of the Link feature
        fields: [
          {
            name: 'rel',
            label: 'Rel Attribute',
            type: 'select',
            hasMany: true,
            options: ['noopener', 'noreferrer', 'nofollow'],
            admin: {
              description:
                'The rel attribute defines the relationship between a linked resource and the current document. This is a custom link field.'
            }
          }
        ]
      }),
      UploadFeature({
        collections: {
          uploads: {
            // Example showing how to customize the built-in fields
            // of the Upload feature
            fields: [
              {
                name: 'caption',
                type: 'richText',
                editor: lexicalEditor()
              }
            ]
          }
        }
      })
      // This is incredibly powerful. You can re-use your Payload blocks
      // directly in the Lexical editor as follows:
      // BlocksFeature({
      //   blocks: [
      //     Banner,
      //     CallToAction,
      //   ],
      // }),
    ]
  })
};
