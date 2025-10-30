import type { Mock } from 'vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';

const payloadConfig = { admin: { route: '/admin' } };
const importMap = { imports: { test: '/foo.js' } };

vi.mock('@repo/payload', () => ({
  getPayloadClient: vi.fn(() => Promise.resolve({ config: payloadConfig })),
  getPayloadImportMap: vi.fn(() => Promise.resolve(importMap)),
}));

vi.mock('@payloadcms/next/views', () => ({
  generatePageMetadata: vi.fn(() => Promise.resolve({ title: 'Admin' })),
  RootPage: vi.fn(() => Promise.resolve('admin-view')),
}));

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe('Payload admin page', () => {
  it('generates metadata using the Payload configuration', async () => {
    const module = await import('../../../../app/(payload)/admin/[[...segments]]/page');
    const { getPayloadClient } = await import('@repo/payload');
    const { generatePageMetadata } = await import('@payloadcms/next/views');

    const metadata = await module.generateMetadata({ params: {}, searchParams: { locale: 'en' } });

    expect(getPayloadClient).toHaveBeenCalledTimes(1);

    const [[metadataArgs]] = (generatePageMetadata as unknown as Mock).mock.calls;

    expect(await metadataArgs.config).toBe(payloadConfig);
    expect(await metadataArgs.params).toEqual({});
    expect(await metadataArgs.searchParams).toEqual({ locale: 'en' });
    expect(metadata).toEqual({ title: 'Admin' });
  });

  it('renders the admin view with normalized params', async () => {
    const module = await import('../../../../app/(payload)/admin/[[...segments]]/page');
    const { getPayloadClient, getPayloadImportMap } = await import('@repo/payload');
    const { RootPage } = await import('@payloadcms/next/views');

    const result = await module.default({
      params: { segments: ['nested'] },
      searchParams: { locale: 'en', unset: undefined },
    });

    expect(getPayloadClient).toHaveBeenCalledTimes(1);
    expect(getPayloadImportMap).toHaveBeenCalledTimes(1);

    const [[rootArgs]] = (RootPage as unknown as Mock).mock.calls;

    expect(await rootArgs.config).toBe(payloadConfig);
    expect(await rootArgs.importMap).toBe(importMap);
    expect(await rootArgs.params).toEqual({ segments: ['nested'] });
    expect(await rootArgs.searchParams).toEqual({ locale: 'en' });
    expect(result).toEqual('admin-view');
  });
});
