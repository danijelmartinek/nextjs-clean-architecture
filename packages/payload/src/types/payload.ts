import type { ImportMap, SanitizedConfig } from 'payload';

export type CollectionConfig = {
  slug: string;
  fields: Array<Record<string, unknown>>;
  access?: Record<string, (...args: unknown[]) => unknown>;
  admin?: Record<string, unknown>;
  auth?: Record<string, unknown>;
  timestamps?: boolean;
  [key: string]: unknown;
};

export type { ImportMap, SanitizedConfig };

export type PayloadClient = {
  init: (options: { config: SanitizedConfig | Promise<SanitizedConfig> }) => Promise<unknown>;
  config: SanitizedConfig;
  find: <T = unknown>(options: Record<string, unknown>) => Promise<{ docs: T[] }>;
  create: <T = unknown>(options: Record<string, unknown>) => Promise<T>;
  update: <T = unknown>(options: Record<string, unknown>) => Promise<T>;
  delete: (options: Record<string, unknown>) => Promise<unknown>;
};
