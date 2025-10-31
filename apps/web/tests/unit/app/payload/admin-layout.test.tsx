import type { Mock } from 'vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';

const payloadConfig = { admin: { route: '/admin' } };
const importMap = { imports: { test: '/foo.js' } };

vi.mock('@repo/payload', () => ({
  getPayloadClient: vi.fn(() => Promise.resolve({ config: payloadConfig })),
  getPayloadImportMap: vi.fn(() => Promise.resolve(importMap)),
}));

const serverFunctionMock = vi.fn(() => 'server-function');

vi.mock('@payloadcms/next/layouts', () => ({
  metadata: { title: 'Payload Admin' },
  RootLayout: vi.fn(() => Promise.resolve('layout-view')),
  handleServerFunctions: serverFunctionMock,
}));

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe('Payload admin layout', () => {
  it('re-exports the Payload metadata', async () => {
    const module = await import('../../../../app/(payload)/admin/layout');

    expect(module.metadata).toEqual({ title: 'Payload Admin' });
  });

  it('renders the layout with the Payload config and import map', async () => {
    const module = await import('../../../../app/(payload)/admin/layout');
    const { getPayloadClient, getPayloadImportMap } = await import('@repo/payload');
    const { RootLayout } = await import('@payloadcms/next/layouts');

    const output = await module.default({ children: 'content' });

    expect(getPayloadClient).toHaveBeenCalledTimes(1);
    expect(getPayloadImportMap).toHaveBeenCalledTimes(1);
    const [[layoutArgs]] = (RootLayout as unknown as Mock).mock.calls;
    const configPromise = layoutArgs.config;

    expect(await configPromise).toBe(payloadConfig);
    expect(await layoutArgs.importMap).toBe(importMap);
    expect(layoutArgs.children).toBe('content');
    expect(layoutArgs.htmlProps).toEqual({ lang: 'en' });
    expect(typeof layoutArgs.serverFunction).toBe('function');
    const request = { args: { test: true }, name: 'example' };
    const result = await layoutArgs.serverFunction(request as never);

    expect(serverFunctionMock).toHaveBeenCalledWith({
      ...request,
      config: configPromise,
      importMap,
    });
    expect(result).toBe('server-function');
    expect(output).toBe('layout-view');
  });
});
