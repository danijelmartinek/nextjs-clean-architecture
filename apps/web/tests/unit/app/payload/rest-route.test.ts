import type { Mock } from 'vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@payloadcms/next/routes', () => ({
  REST_DELETE: vi.fn(() => 'delete-handler'),
  REST_GET: vi.fn(() => 'get-handler'),
  REST_OPTIONS: vi.fn(() => 'options-handler'),
  REST_PATCH: vi.fn(() => 'patch-handler'),
  REST_POST: vi.fn(() => 'post-handler'),
  REST_PUT: vi.fn(() => 'put-handler'),
}));

vi.mock('@repo/payload', () => ({
  getPayloadClient: vi.fn(() => Promise.resolve({
    config: { api: true },
  })),
}));

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe('payload REST route', () => {
  it('reuses the same Payload config for every handler', async () => {
    const routes = await import('../../../../app/api/payload/[[...slug]]/route');
    const {
      REST_DELETE,
      REST_GET,
      REST_OPTIONS,
      REST_PATCH,
      REST_POST,
      REST_PUT,
    } = await import('@payloadcms/next/routes');
    const { getPayloadClient } = await import('@repo/payload');

    expect(getPayloadClient).toHaveBeenCalledTimes(1);

    const [[optionsConfig]] = (REST_OPTIONS as unknown as Mock).mock.calls;
    const [[getConfig]] = (REST_GET as unknown as Mock).mock.calls;
    const [[postConfig]] = (REST_POST as unknown as Mock).mock.calls;
    const [[deleteConfig]] = (REST_DELETE as unknown as Mock).mock.calls;
    const [[patchConfig]] = (REST_PATCH as unknown as Mock).mock.calls;
    const [[putConfig]] = (REST_PUT as unknown as Mock).mock.calls;

    const configs = await Promise.all([
      optionsConfig,
      getConfig,
      postConfig,
      deleteConfig,
      patchConfig,
      putConfig,
    ]);

    configs.forEach((value) => {
      expect(value).toEqual({ api: true });
    });

    expect(routes.OPTIONS).toBe('options-handler');
    expect(routes.GET).toBe('get-handler');
    expect(routes.POST).toBe('post-handler');
    expect(routes.DELETE).toBe('delete-handler');
    expect(routes.PATCH).toBe('patch-handler');
    expect(routes.PUT).toBe('put-handler');
  });
});
