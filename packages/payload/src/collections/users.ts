import type { CollectionConfig } from '../types/payload';

export const usersCollection: CollectionConfig = {
  slug: 'users',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'username',
  },
  auth: {
    disableLocalStrategy: true,
  },
  fields: [
    {
      name: 'appUserId',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'password_hash',
      type: 'text',
      required: true,
    },
  ],
};
