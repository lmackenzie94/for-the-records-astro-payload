import { CollectionConfig } from 'payload/types';

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email'
  },
  access: {
    read: () => true,
    // TODO: change this to "admin" only or something...
    create: () => true
  },
  fields: [
    // Email added by default
    {
      name: 'name',
      type: 'text'
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' }
      ],
      required: true,
      defaultValue: 'user'
    }
  ]
};

export default Users;
