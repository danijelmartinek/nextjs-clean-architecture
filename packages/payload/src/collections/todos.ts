import type { CollectionConfig } from '../types/payload';

export const todosCollection: CollectionConfig = {
  slug: 'todos',
  timestamps: true,
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'todoId',
      type: 'number',
      required: true,
      unique: true,
    },
    {
      name: 'todo',
      type: 'text',
      required: true,
    },
    {
      name: 'completed',
      type: 'checkbox',
      required: true,
      defaultValue: false,
    },
    {
      name: 'userId',
      type: 'text',
      required: true,
    },
  ],
};
