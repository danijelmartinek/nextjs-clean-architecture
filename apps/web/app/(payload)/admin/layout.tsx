import type { ReactNode } from 'react';
import type { ServerFunctionClient } from 'payload';
import { metadata as payloadMetadata, RootLayout } from '@payloadcms/next/layouts';
import { handleServerFunctions } from '@payloadcms/next/layouts';
import { getPayloadClient, getPayloadImportMap } from '@repo/payload';

export const metadata = payloadMetadata;

export default async function PayloadAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const configPromise = getPayloadClient().then((payload) => payload.config);
  const importMap = await getPayloadImportMap();
  const serverFunction = handleServerFunctions as unknown as ServerFunctionClient;

  return RootLayout({
    children,
    config: configPromise,
    htmlProps: { lang: 'en' },
    importMap,
    serverFunction,
  });
}
