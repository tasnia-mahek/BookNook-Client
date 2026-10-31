'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Leaf, Menu, X, ChevronDown, Moon, Sun } from 'lucide-react';
import { useApp } from './app-provider';

export function Navbar() {
  const { user, authLoading, logout } = useApp();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const links = [['Home', '/'], ['All Books', '/books'], ...(user ? [['Add Book', '/add-book'], ['My Books', '/my-books'], ['My Borrows', '/my-borrows']] : [])];
  useEffect(() => { const saved = localStorage.getItem('booknook-theme') === 'dark'; setDark(saved); document.documentElement.classList.toggle('dark', saved); }, []);
  useEffect(() => { setProfileOpen(false); setOpen(false); }, [pathname]);
  useEffect(() => {
    function dismiss(event: MouseEvent) { if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false); }
    function escape(event: KeyboardEvent) { if (event.key === 'Escape') setProfileOpen(false); }
    document.addEventListener('mousedown', dismiss);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('mousedown', dismiss); document.removeEventListener('keydown', escape); };
  }, []);
  function toggleTheme() { const next = !dark; setDark(next); document.documentElement.classList.toggle('dark', next); localStorage.setItem('booknook-theme', next ? 'dark' : 'light'); }
  const initial = user?.name?.trim().charAt(0).toUpperCase() || '?';
  return <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur"><div className="container flex h-20 items-center justify-between"><Link href="/" className="serif flex items-center gap-2 text-2xl font-bold text-[var(--text)] focus-visible:outline-2"><Leaf size={25} />BookNook</Link><div className="flex items-center gap-3"><button className="rounded-full border border-[var(--border)] p-2 text-[var(--text)] transition hover:bg-[var(--surface)]" onClick={toggleTheme} aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`}>{dark ? <Sun size={19} /> : <Moon size={19} />}</button><button className="text-[var(--text)] md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button></div><nav className={`${open ? 'flex' : 'hidden'} absolute left-0 top-20 w-full flex-col gap-5 border-b border-[var(--border)] bg-[var(--bg)] p-6 md:static md:flex md:w-auto md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0`}>{links.map(([label, href]) =>   <Link key={href} href={href} onClick={() => setOpen(false)} className="glow-subtle text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text)] focus-visible:outline-2">{label}</Link>)}{authLoading ? <span className="text-sm text-[var(--text-muted)]">Checking session…</span> : user ? <div ref={profileRef} className="relative"><button className="flex items-center gap-2 text-sm font-bold text-[var(--text)]" onClick={() => setProfileOpen(!profileOpen)}><span className="relative grid h-9 w-9 place-items-center rounded-full bg-[var(--primary)] font-bold text-[var(--on-primary)]">{initial}{user.photoUrl && <img src={user.photoUrl} referrerPolicy="no-referrer" onError={event => { event.currentTarget.remove(); }} className="absolute inset-0 h-9 w-9 rounded-full" alt={user.name} />}</span><ChevronDown size={16} /></button>{profileOpen && <div className="absolute right-0 top-12 w-48 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xl"><p className="border-b border-[var(--border)] px-3 pb-3 text-sm font-bold text-[var(--text)]">{user.name}</p><Link onClick={() => setProfileOpen(false)} className="block px-3 py-3 text-sm text-[var(--text-muted)] hover:text-[var(--text)]" href="/profile">My Profile</Link><button className="w-full px-3 py-2 text-left text-sm font-bold text-[var(--primary)]" onClick={() => { setProfileOpen(false); void logout(); }}>Logout</button></div>}</div> : <div className="flex gap-2"><Link className="btn btn-secondary text-sm" href="/login">Login</Link><Link className="btn btn-primary text-sm" href="/register">Register</Link></div>}</nav></div></header>;
}
