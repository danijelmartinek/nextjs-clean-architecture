import { sessionsCollection } from './collections/sessions';
import { todosCollection } from './collections/todos';
import { usersCollection } from './collections/users';
import type { CollectionConfig } from './types/payload';

const defaultDatabaseFile = process.env.PAYLOAD_DATABASE_FILE ?? 'payload.sqlite';

type PayloadConfig = {
  db: unknown;
  collections: CollectionConfig[];
  admin: { disable: boolean };
  graphQL: { disable: boolean };
};

let cachedConfig: PayloadConfig | null = null;
let configPromise: Promise<PayloadConfig> | null = null;

async function buildPayloadConfig(): Promise<PayloadConfig> {
  // @ts-expect-error -- sqlite adapter ships ESM entrypoints without bundler-compatible types
  const { sqliteAdapter } = await import('@payloadcms/db-sqlite');

  const databaseUrl = process.env.PAYLOAD_DATABASE_URL ?? `file:${defaultDatabaseFile}`;
  const databaseToken = process.env.PAYLOAD_DATABASE_AUTH_TOKEN;

  cachedConfig = {
    db: sqliteAdapter({
      client: databaseToken
        ? { url: databaseUrl, authToken: databaseToken }
        : { url: databaseUrl },
    }),
    collections: [usersCollection, todosCollection, sessionsCollection],
    admin: {
      disable: true,
    },
    graphQL: {
      disable: true,
    },
  };

  return cachedConfig;
}

export async function getPayloadConfig(): Promise<PayloadConfig> {
  if (cachedConfig) {
    return cachedConfig;
  }

  if (!configPromise) {
    configPromise = buildPayloadConfig();
  }

  return configPromise;
}
