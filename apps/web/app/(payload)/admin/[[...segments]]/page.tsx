import type { Metadata } from 'next';
import { createElement, type JSX } from 'react';
import { generatePageMetadata, RootPage } from '@payloadcms/next/views';
import { getPayloadClient, getPayloadImportMap } from '@repo/payload';

type AdminPageParams = {
  segments?: string[];
};

type AdminPageSearchParams = Record<string, string | string[] | undefined>;

type AdminPageProps = {
  params: AdminPageParams;
  searchParams?: AdminPageSearchParams;
};

function normalizeSearchParams(
  params?: AdminPageSearchParams,
): Record<string, string | string[]> {
  const normalized: Record<string, string | string[]> = {};

  if (!params) {
    return normalized;
  }

  for (const [key, value] of Object.entries(params)) {
    if (typeof value !== 'undefined') {
      normalized[key] = value;
    }
  }

  return normalized;
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function generateMetadata({
  params,
  searchParams,
}: AdminPageProps): Promise<Metadata> {
  return generatePageMetadata({
    config: getPayloadClient().then((payload) => payload.config),
    params: Promise.resolve(params ?? {}),
    searchParams: Promise.resolve(normalizeSearchParams(searchParams)),
  });
}

export default async function PayloadAdminPage({
  params,
  searchParams,
}: AdminPageProps): Promise<JSX.Element> {
  const configPromise = getPayloadClient().then((payload) => payload.config);
  const importMap = await getPayloadImportMap();

  return createElement(RootPage, {
    config: configPromise,
    importMap,
    params: Promise.resolve({ segments: params?.segments ?? [] }),
    searchParams: Promise.resolve(normalizeSearchParams(searchParams)),
  });
}
