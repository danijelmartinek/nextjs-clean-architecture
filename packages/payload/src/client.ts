import { getPayloadConfig } from './config';
import type { PayloadClient } from './types/payload';

let cachedPayload: PayloadClient | null = null;
let payloadPromise: Promise<PayloadClient> | null = null;

async function initializePayload(): Promise<PayloadClient> {
  // @ts-ignore -- payload ships type definitions incompatible with the bundler resolver
  const payloadModule = await import('payload');
  const payload = (payloadModule.default ?? payloadModule) as unknown as PayloadClient;
  const config = await getPayloadConfig();

  if (!process.env.PAYLOAD_SECRET) {
    process.env.PAYLOAD_SECRET = 'development-secret';
  }

  await payload.init({
    config,
  });

  cachedPayload = payload;

  return payload;
}

export async function getPayloadClient(): Promise<PayloadClient> {
  if (cachedPayload) {
    return cachedPayload;
  }

  if (!payloadPromise) {
    payloadPromise = initializePayload();
  }

  return payloadPromise;
}
