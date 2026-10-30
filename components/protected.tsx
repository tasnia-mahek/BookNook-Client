'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from './app-provider';
import { Loading } from './loading';

export function Protected({ children }: { children: React.ReactNode }) {
  const { user, authLoading } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (!authLoading && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [authLoading, pathname, router, user]);
  if (authLoading || !user) return <Loading />;
  return <>{children}</>;
}
