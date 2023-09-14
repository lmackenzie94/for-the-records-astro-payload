import { GlobalConfig } from 'payload/types';

const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true
  },
  fields: [
    {
      name: 'title',
      label: 'Site Title',
      type: 'text',
      required: true
    },
    {
      name: 'description',
      label: 'Site Description',
      type: 'textarea',
      required: true
    },
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
      required: true
    }
  ]
};

export default SiteSettings;
