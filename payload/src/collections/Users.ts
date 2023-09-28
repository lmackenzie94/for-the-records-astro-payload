import { CollectionConfig } from 'payload/types';

// By enabling Authentication on a config, the following modifications will automatically be made to your Collection:

// 1. email as well as password salt & hash fields will be added to your Collection's schema
// 2. The Admin panel will feature a new set of corresponding UI to allow for changing password and editing email
// 3. A new set of operations will be exposed via Payload's REST, Local, and GraphQL APIs

// Once enabled, each document that is created within the Collection can be thought of as a user...
// ...who can make use of commonly required authentication functions such as logging in / out, resetting their password, and more.

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 7200 // How many seconds to keep the user logged in
    // verify: true, // Require email verification before being allowed to authenticate
    // maxLoginAttempts: 5, // Automatically lock a user out after X amount of failed logins
    // lockTime: 600 * 1000 // Time period to allow the max login attempts
    // More options are available
  },
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
