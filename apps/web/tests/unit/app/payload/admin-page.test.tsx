import type { Mock } from 'vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';

const payloadConfig = { admin: { route: '/admin' } };
const importMap = { imports: { test: '/foo.js' } };

vi.mock('@repo/payload', () => ({
  getPayloadAdminConfig: vi.fn(() => Promise.resolve(payloadConfig)),
  getPayloadImportMap: vi.fn(() => Promise.resolve(importMap)),
}));

vi.mock('@payloadcms/next/views', () => ({
  generatePageMetadata: vi.fn(() => Promise.resolve({ title: 'Admin' })),
  RootPage: vi.fn((props) => props),
}));

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe('Payload admin page', () => {
  it('generates metadata using the Payload configuration', async () => {
    const module = await import('../../../../app/(payload)/admin/[[...segments]]/page');
    const { getPayloadAdminConfig } = await import('@repo/payload');
    const { generatePageMetadata } = await import('@payloadcms/next/views');

    const metadata = await module.generateMetadata({ params: {}, searchParams: { locale: 'en' } });

    expect(getPayloadAdminConfig).toHaveBeenCalledTimes(1);

    const [[metadataArgs]] = (generatePageMetadata as unknown as Mock).mock.calls;

    expect(await metadataArgs.config).toBe(payloadConfig);
    expect(await metadataArgs.params).toEqual({});
    expect(await metadataArgs.searchParams).toEqual({ locale: 'en' });
    expect(metadata).toEqual({ title: 'Admin' });
  });

  it('renders the admin view with normalized params', async () => {
    const module = await import('../../../../app/(payload)/admin/[[...segments]]/page');
    const { getPayloadAdminConfig, getPayloadImportMap } = await import('@repo/payload');
    const { RootPage } = await import('@payloadcms/next/views');

    const result = await module.default({
      params: { segments: ['nested'] },
      searchParams: { locale: 'en', unset: undefined },
    });

    expect(getPayloadAdminConfig).toHaveBeenCalledTimes(1);
    expect(getPayloadImportMap).toHaveBeenCalledTimes(1);

    expect(result?.type).toBe(RootPage);

    const { config, importMap: resolvedImportMap, params, searchParams } = result?.props ?? {};

    expect(typeof config?.then).toBe('function');
    expect(await config).toBe(payloadConfig);
    expect(resolvedImportMap).toBe(importMap);
    expect(await params).toEqual({ segments: ['nested'] });
    expect(await searchParams).toEqual({ locale: 'en' });
  });
});
