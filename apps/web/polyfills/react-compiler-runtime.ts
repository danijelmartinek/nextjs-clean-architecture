import { useRef } from 'react';

type CacheEntry = unknown;

type MemoCache = CacheEntry[];

export function c(size: number): MemoCache {
  const cacheRef = useRef<MemoCache>(Array(size));

  if (cacheRef.current.length !== size) {
    cacheRef.current = Array(size);
  }

  return cacheRef.current;
}
