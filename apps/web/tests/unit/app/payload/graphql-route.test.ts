import type { Mock } from 'vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@payloadcms/next/routes', () => ({
  GRAPHQL_PLAYGROUND_GET: vi.fn(() => 'playground-handler'),
  GRAPHQL_POST: vi.fn(() => 'post-handler'),
}));

vi.mock('@repo/payload', () => ({
  getPayloadClient: vi.fn(() => Promise.resolve({
    config: { label: 'config' },
  })),
}));

afterEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe('payload GraphQL route', () => {
  it('exposes handlers created from the Payload config', async () => {
    const routes = await import('../../../../app/api/payload/graphql/route');
    const { GRAPHQL_PLAYGROUND_GET, GRAPHQL_POST } = await import('@payloadcms/next/routes');
    const { getPayloadClient } = await import('@repo/payload');

    expect(getPayloadClient).toHaveBeenCalledTimes(1);

    const [[playgroundConfig]] = (GRAPHQL_PLAYGROUND_GET as unknown as Mock).mock.calls;
    const [[postConfig]] = (GRAPHQL_POST as unknown as Mock).mock.calls;

    expect(await playgroundConfig).toEqual({ label: 'config' });
    expect(await postConfig).toEqual({ label: 'config' });

    expect(routes.GET).toBe('playground-handler');
    expect(routes.POST).toBe('post-handler');
  });
});
