'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastProvider } from './toast';
export type User = { name: string; email: string; photoUrl?: string };
type Context = { user: User | null; token: string | null; login: (u: User, t: string, next?: string) => void; logout: () => void };
const AppContext = createContext<Context>({ user: null, token: null, login: () => {}, logout: () => {} });
export const useApp = () => useContext(AppContext);
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null); const [token, setToken] = useState<string | null>(null); const router = useRouter();
  useEffect(() => { const raw = localStorage.getItem('booknook-session'); if (raw) { const data = JSON.parse(raw); setUser(data.user); setToken(data.token); } }, []);
  function login(nextUser: User, nextToken: string, next = '/') { localStorage.setItem('booknook-session', JSON.stringify({ user: nextUser, token: nextToken })); setUser(nextUser); setToken(nextToken); router.push(next); }
  function logout() { localStorage.removeItem('booknook-session'); setUser(null); setToken(null); router.push('/'); }
  return <AppContext.Provider value={{ user, token, login, logout }}><ToastProvider>{children}</ToastProvider></AppContext.Provider>;
}
