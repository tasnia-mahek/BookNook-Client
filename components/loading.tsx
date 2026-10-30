import { BookOpen } from 'lucide-react';
export function Loading(){return <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 text-moss"><div className="book-loader"><BookOpen size={28}/></div><span className="text-sm font-bold tracking-wide">Opening the shelf…</span></div>}
