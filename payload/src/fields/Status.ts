import { Field } from 'payload/types';

export const status: Field = {
  name: 'status',
  type: 'select',
  options: [
    {
      value: 'draft',
      label: 'Draft'
    },
    {
      value: 'published',
      label: 'Published'
    }
  ],
  defaultValue: 'draft',
  admin: {
    position: 'sidebar'
  }
};
