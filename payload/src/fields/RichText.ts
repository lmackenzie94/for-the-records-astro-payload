import {
  HTMLConverterFeature,
  LinkFeature,
  UploadFeature,
  lexicalEditor,
  lexicalHTML
} from '@payloadcms/richtext-lexical';
import { Field } from 'payload/types';

export const richText = (
  name: string,
  addLexicalHTMLField: boolean
): Field[] => {
  const richTextField: Field = {
    name,
    type: 'richText',
    // Pass the Lexical editor here and override base settings as necessary
    editor: lexicalEditor({
      //! overwrote theme classes in _lexical.scss
      // lexical: {
      //   namespace: 'payload',
      //   theme: {
      //     // empty object seems to disable the default theme... 👍
      //     // heading: {
      //     //   h1: 'heading-1'
      //     // }
      //   }
      // },
      features: ({ defaultFeatures }) => [
        ...defaultFeatures,
        // The HTMLConverter Feature is the feature which manages the HTML serializers. If you do not pass any arguments to it, it will use the default serializers.
        HTMLConverterFeature({}),
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

  // The lexicalHTML() function creates a new field that automatically
  // converts the referenced lexical richText field into HTML through an afterRead hook.
  if (addLexicalHTMLField) {
    return [richTextField, lexicalHTML(name, { name: `${name}_html` })];
  }

  return [richTextField];
};
