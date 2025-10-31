import {
  createElement,
  type ComponentType,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import type { ServerFunctionClient } from 'payload';
import { metadata as payloadMetadata, RootLayout } from '@payloadcms/next/layouts';
import { handleServerFunctions } from '@payloadcms/next/layouts';
import {
  getPayloadAdminConfig,
  getPayloadClient,
  getPayloadImportMap,
} from '@repo/payload';

export const metadata = payloadMetadata;

export default async function PayloadAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const adminConfigPromise = getPayloadAdminConfig();
  const configPromise = getPayloadClient().then((payload) => payload.config);
  const importMap = await getPayloadImportMap();
  const serverFunction: ServerFunctionClient = async (request) => {
    'use server';

    return handleServerFunctions({
      ...request,
      config: configPromise,
      importMap,
    });
  };

  const LayoutComponent =
    RootLayout as unknown as ComponentType<PropsWithChildren<Record<string, unknown>>>;

  return createElement(
    LayoutComponent,
    {
      config: adminConfigPromise,
      htmlProps: { lang: 'en' },
      importMap,
      serverFunction,
    },
    children,
  );
}
