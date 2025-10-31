import { afterEach, describe, expect, it, vi } from 'vitest';

const payloadConfig = { admin: { route: '/admin' }, permissions: {} };
const adminConfig = { admin: { route: '/admin' } };
const importMap = { imports: { test: '/foo.js' } };

vi.mock('@repo/payload', () => ({
  getPayloadAdminConfig: vi.fn(() => Promise.resolve(adminConfig)),
  getPayloadClient: vi.fn(() => Promise.resolve({ config: payloadConfig })),
  getPayloadImportMap: vi.fn(() => Promise.resolve(importMap)),
}));

const serverFunctionMock = vi.fn(() => 'server-function');

vi.mock('@payloadcms/next/layouts', () => ({
  metadata: { title: 'Payload Admin' },
  RootLayout: vi.fn((props) => props),
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
    const { getPayloadAdminConfig, getPayloadClient, getPayloadImportMap } = await import(
      '@repo/payload'
    );
    const { RootLayout } = await import('@payloadcms/next/layouts');

    const output = await module.default({ children: 'content' });

    expect(getPayloadAdminConfig).toHaveBeenCalledTimes(1);
    expect(getPayloadClient).toHaveBeenCalledTimes(1);
    expect(getPayloadImportMap).toHaveBeenCalledTimes(1);
    expect(output?.type).toBe(RootLayout);

    const { config, importMap: resolvedImportMap, children, htmlProps, serverFunction } =
      output?.props ?? {};

    expect(typeof config?.then).toBe('function');
    expect(await config).toBe(adminConfig);
    expect(resolvedImportMap).toBe(importMap);
    expect(children).toBe('content');
    expect(htmlProps).toEqual({ lang: 'en' });
    expect(typeof serverFunction).toBe('function');
    const request = { args: { test: true }, name: 'example' };
    const result = await serverFunction(request as never);

    expect(serverFunctionMock).toHaveBeenCalledWith({
      ...request,
      config: expect.any(Promise),
      importMap,
    });
    const [[serverArgs]] = serverFunctionMock.mock.calls;

    expect(await serverArgs.config).toBe(payloadConfig);
    expect(result).toBe('server-function');
  });
});
