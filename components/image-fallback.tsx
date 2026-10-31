'use client';

import { useState } from 'react';

export function BookCover({ src, title, className }: { src: string; title: string; className: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className={`${className} grid place-items-center bg-[var(--surface)] p-4 text-center font-bold text-[var(--text-muted)]`}>{title}</div>;
  return <img src={src} alt={title} onError={() => setFailed(true)} className={className} />;
}

export function UserAvatar({ src, name, className }: { src?: string; name: string; className: string }) {
  const [failed, setFailed] = useState(!src);
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  if (failed) return <div className={`${className} grid place-items-center rounded-full bg-[var(--primary)] font-bold text-[var(--on-primary)]`}>{initial}</div>;
  return <img src={src} alt={name} referrerPolicy="no-referrer" onError={() => setFailed(true)} className={`${className} rounded-full`} />;
}
