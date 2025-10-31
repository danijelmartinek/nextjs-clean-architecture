import { sessionsCollection } from './collections/sessions';
import { todosCollection } from './collections/todos';
import { usersCollection } from './collections/users';
import type { ImportMap, SanitizedConfig } from './types/payload';

const defaultDatabaseFile = process.env.PAYLOAD_DATABASE_FILE ?? 'payload.sqlite';
const defaultAdminRoute = process.env.PAYLOAD_ADMIN_ROUTE ?? '/admin';
const defaultApiRoute = process.env.PAYLOAD_API_ROUTE ?? '/api/payload';
const defaultGraphQLRoute =
  process.env.PAYLOAD_GRAPHQL_ROUTE ?? `${defaultApiRoute}/graphql`;

type PayloadModule = typeof import('payload');
type BuildConfigInput = Parameters<PayloadModule['buildConfig']>[0];

let configPromise: Promise<SanitizedConfig> | null = null;
let adminConfigPromise: Promise<SanitizedConfig> | null = null;

function sanitizeForAdmin(
  value: unknown,
  seen = new WeakMap<object, unknown>(),
): unknown {
  if (typeof value === 'function' || typeof value === 'symbol') {
    return undefined;
  }

  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (seen.has(value as object)) {
    return seen.get(value as object);
  }

  if (Array.isArray(value)) {
    const sanitizedArray: unknown[] = [];

    seen.set(value, sanitizedArray);

    for (const item of value) {
      const sanitizedItem = sanitizeForAdmin(item, seen);

      if (typeof sanitizedItem !== 'undefined') {
        sanitizedArray.push(sanitizedItem);
      }
    }

    return sanitizedArray;
  }

  const sanitizedObject: Record<string, unknown> = {};

  seen.set(value as object, sanitizedObject);

  for (const [key, entryValue] of Object.entries(value as Record<string, unknown>)) {
    const sanitizedEntry = sanitizeForAdmin(entryValue, seen);

    if (typeof sanitizedEntry !== 'undefined') {
      sanitizedObject[key] = sanitizedEntry;
    }
  }

  return sanitizedObject;
}

async function buildPayloadConfig(): Promise<SanitizedConfig> {
  const [{ sqliteAdapter }, payloadModule] = await Promise.all([
    // @ts-ignore -- sqlite adapter ships ESM entrypoints without bundler-compatible types
    import('@payloadcms/db-sqlite'),
    // @ts-ignore -- payload ships type definitions incompatible with the bundler resolver
    import('payload'),
  ]);

  const { buildConfig } = payloadModule;

  const databaseUrl = process.env.PAYLOAD_DATABASE_URL ?? `file:${defaultDatabaseFile}`;
  const databaseToken = process.env.PAYLOAD_DATABASE_AUTH_TOKEN;

  const configInput = {
    admin: {
      user: usersCollection.slug,
    },
    collections: [usersCollection, todosCollection, sessionsCollection],
    db: sqliteAdapter({
      client: databaseToken
        ? { url: databaseUrl, authToken: databaseToken }
        : { url: databaseUrl },
    }),
    graphQL: {
      disable: false,
    },
    routes: {
      admin: defaultAdminRoute,
      api: defaultApiRoute,
      graphQL: defaultGraphQLRoute,
    },
    secret: process.env.PAYLOAD_SECRET ?? 'development-secret',
  } as unknown as BuildConfigInput;

  return buildConfig(configInput);
}

export async function getPayloadConfig(): Promise<SanitizedConfig> {
  if (!configPromise) {
    configPromise = buildPayloadConfig();
  }

  return configPromise;
}

export async function getPayloadAdminConfig(): Promise<SanitizedConfig> {
  if (!adminConfigPromise) {
    adminConfigPromise = getPayloadConfig().then((config) =>
      sanitizeForAdmin(config) as SanitizedConfig,
    );
  }

  return adminConfigPromise;
}

export async function getPayloadImportMap(): Promise<ImportMap> {
  const config = await getPayloadConfig();

  const baseImportMap = (config.admin.importMap ?? {}) as ImportMap;

  return {
    ...baseImportMap,
    imports: {
      ...(baseImportMap.imports ?? {}),
      'react/compiler-runtime': '/polyfills/react-compiler-runtime.js',
    },
  };
}
