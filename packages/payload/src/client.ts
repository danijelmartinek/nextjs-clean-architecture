import payload, { type Payload } from 'payload';

import { payloadConfig } from './config';

let cachedPayload: Payload | null = null;

export async function getPayloadClient(): Promise<Payload> {
  if (cachedPayload) {
    return cachedPayload;
  }

  await payload.init({
    config: payloadConfig,
    secret: process.env.PAYLOAD_SECRET ?? 'development-secret',
    local: true,
  });

  cachedPayload = payload;

  return cachedPayload;
}
