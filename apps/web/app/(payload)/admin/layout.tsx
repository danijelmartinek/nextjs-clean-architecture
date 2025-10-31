import {
  createElement,
  type ComponentType,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
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
  const payloadPromise = getPayloadClient();
  const configPromise = payloadPromise.then((payload) => payload.config);
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
      config: configPromise,
      htmlProps: { lang: 'en' },
      importMap,
      serverFunction,
    },
    children,
  );
}
