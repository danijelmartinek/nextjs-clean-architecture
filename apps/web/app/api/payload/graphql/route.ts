import { GRAPHQL_PLAYGROUND_GET, GRAPHQL_POST } from '@payloadcms/next/routes';
import { getPayloadClient } from '@repo/payload';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const configPromise = getPayloadClient().then((payload) => payload.config);

export const GET = GRAPHQL_PLAYGROUND_GET(configPromise);
export const POST = GRAPHQL_POST(configPromise);
