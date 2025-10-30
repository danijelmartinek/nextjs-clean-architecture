export type CollectionConfig = {
  slug: string;
  fields: Array<Record<string, unknown>>;
  access?: Record<string, (...args: unknown[]) => unknown>;
  [key: string]: unknown;
};

export type PayloadClient = {
  init: (options: { config: unknown }) => Promise<void>;
  find: <T = unknown>(options: Record<string, unknown>) => Promise<{ docs: T[] }>;
  create: <T = unknown>(options: Record<string, unknown>) => Promise<T>;
  update: <T = unknown>(options: Record<string, unknown>) => Promise<T>;
  delete: (options: Record<string, unknown>) => Promise<unknown>;
};
