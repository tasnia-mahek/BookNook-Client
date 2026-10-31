import { BookOpen } from 'lucide-react';
export function Loading(){return <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 text-[var(--primary)]"><div className="book-loader"><BookOpen size={28}/></div><span className="text-sm font-bold tracking-wide text-[var(--text-muted)]">Opening the shelf…</span></div>}
