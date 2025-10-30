import path from 'node:path';

import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { buildConfig } from 'payload';

import { sessionsCollection } from './collections/sessions';
import { todosCollection } from './collections/todos';
import { usersCollection } from './collections/users';

const defaultDatabaseFile = path.resolve(process.cwd(), 'payload.sqlite');

export const payloadConfig = buildConfig({
  db: sqliteAdapter({
    url: process.env.PAYLOAD_DATABASE_URL ?? `file:${defaultDatabaseFile}`,
  }),
  collections: [usersCollection, todosCollection, sessionsCollection],
  admin: {
    disable: true,
  },
  graphQL: {
    disable: true,
  },
});
