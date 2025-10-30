import type { Payload } from 'payload';

import { getPayloadConfig } from './config';

let cachedPayload: Payload | null = null;
let payloadPromise: Promise<Payload> | null = null;

async function initializePayload(): Promise<Payload> {
  const payloadModule = await import('payload');
  const payload = payloadModule.default ?? payloadModule;
  const config = await getPayloadConfig();

  if (!process.env.PAYLOAD_SECRET) {
    process.env.PAYLOAD_SECRET = 'development-secret';
  }

  await payload.init({
    config: config as any,
  });

  cachedPayload = payload;

  return payload;
}

export async function getPayloadClient(): Promise<Payload> {
  if (cachedPayload) {
    return cachedPayload;
  }

  if (!payloadPromise) {
    payloadPromise = initializePayload();
  }

  return payloadPromise;
}
