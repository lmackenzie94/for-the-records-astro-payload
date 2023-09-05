import { Field } from 'payload/types';
import formatSlug from '@/utils/formatSlug';
import deepMerge from '@/utils/deepMerge';

type Slug = (fieldToUse?: string, overrides?: Partial<Field>) => Field;

// By dynamically building fields in code configurations are reusable and concise
export const slug: Slug = (fieldToUse = 'title', overrides) =>
  deepMerge<Field, Partial<Field>>(
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      admin: {
        position: 'sidebar'
      },
      hooks: {
        beforeValidate: [formatSlug(fieldToUse)]
      }
    },
    overrides
  );
