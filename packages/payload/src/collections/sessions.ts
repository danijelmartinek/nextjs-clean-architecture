import type { CollectionConfig } from '../types/payload';

export const sessionsCollection: CollectionConfig = {
  slug: 'sessions',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'sessionId',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'userId',
      type: 'text',
      required: true,
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
    },
    {
      name: 'attributes',
      type: 'json',
      required: false,
    },
  ],
};
