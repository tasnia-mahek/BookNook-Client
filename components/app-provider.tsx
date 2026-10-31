'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Book, Borrow } from '@/lib/api';
import { api, getAuthToken } from '@/lib/api';
import { authClient } from '@/lib/auth-client';
import { ToastProvider } from './toast';

export type User = { name: string; email: string; photoUrl?: string };
type Context = {
  user: User | null; authLoading: boolean; books: Book[]; booksLoading: boolean; booksError: boolean; retryBooks: () => void; borrows: Borrow[]; borrowsLoading: boolean;
  login: (email: string, password: string, next?: string) => Promise<void>;
  register: (details: { name: string; email: string; photoUrl: string; password: string }) => Promise<void>;
  loginWithGoogle: (next?: string) => Promise<void>; logout: () => Promise<void>;
  addBook: (book: Omit<Book, '_id' | 'addedAt' | 'addedBy' | 'availableCopies'>) => Promise<void>;
  updateBook: (id: string, changes: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>; borrowBook: (id: string) => Promise<void>; returnBook: (id: string) => Promise<void>;
};
const AppContext = createContext<Context | null>(null);
export const useApp = () => { const context = useContext(AppContext); if (!context) throw new Error('useApp must be used inside AppProvider'); return context; };
function getUser(sessionUser: { name: string; email: string; image?: string | null }): User { return { name: sessionUser.name, email: sessionUser.email, photoUrl: sessionUser.image ?? undefined }; }
function authError(error: { message?: string } | null | undefined) { return new Error(error?.message || 'Authentication request failed.'); }

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter(); const session = authClient.useSession();
  const [books, setBooks] = useState<Book[]>([]); const [booksLoading, setBooksLoading] = useState(true); const [booksError, setBooksError] = useState(false); const [booksRetry, setBooksRetry] = useState(0); const [borrows, setBorrows] = useState<Borrow[]>([]); const [borrowsLoading, setBorrowsLoading] = useState(false);
  useEffect(() => { setBooksLoading(true); setBooksError(false); api<Book[]>('/books').then(setBooks).catch(error => { console.error('Unable to load books:', error); setBooksError(true); }).finally(() => setBooksLoading(false)); }, [booksRetry]);
  function retryBooks() { setBooksRetry(value => value + 1); }
  useEffect(() => {
    if (!session.data?.user) { setBorrows([]); setBorrowsLoading(false); return; }
    setBorrowsLoading(true);
    getAuthToken().then(token => api<Borrow[]>('/borrows', {}, token)).then(setBorrows).catch(error => console.error('Unable to load borrows:', error)).finally(() => setBorrowsLoading(false));
  }, [session.data?.user?.email]);
  const user = session.data?.user ? getUser(session.data.user) : null;
  async function login(email: string, password: string, next = '/') { const result = await authClient.signIn.email({ email, password, callbackURL: next }); if (result.error) throw authError(result.error); router.push(next); }
  async function register(details: { name: string; email: string; photoUrl: string; password: string }) { const result = await authClient.signUp.email({ name: details.name, email: details.email, password: details.password, image: details.photoUrl || undefined }); if (result.error) throw authError(result.error); }
  async function loginWithGoogle(next = '/') { const result = await authClient.signIn.social({ provider: 'google', callbackURL: next }); if (result.error) throw authError(result.error); }
  async function logout() { const result = await authClient.signOut(); if (result.error) throw authError(result.error); router.push('/'); }
  async function addBook(input: Omit<Book, '_id' | 'addedAt' | 'addedBy' | 'availableCopies'>) { if (!user) throw new Error('Please log in first.'); const book = await api<Book>('/books', { method: 'POST', body: JSON.stringify(input) }, await getAuthToken()); setBooks(current => [book, ...current]); }
  async function updateBook(id: string, changes: Partial<Book>) { const book = await api<Book>(`/books/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }, await getAuthToken()); setBooks(current => current.map(item => item._id === id ? book : item)); }
  async function deleteBook(id: string) { await api(`/books/${id}`, { method: 'DELETE' }, await getAuthToken()); setBooks(current => current.filter(item => item._id !== id)); }
  async function borrowBook(id: string) { if (!user) throw new Error('Please log in first.'); const token = await getAuthToken(); const borrow = await api<Borrow>('/borrows', { method: 'POST', body: JSON.stringify({ bookId: id }) }, token); setBorrows(current => [borrow, ...current]); const book = await api<Book>(`/books/${id}`); setBooks(current => current.map(item => item._id === id ? book : item)); }
  async function returnBook(id: string) { const borrow = borrows.find(item => item._id === id); if (!borrow) throw new Error('Borrow not found.'); await api(`/borrows/${id}`, { method: 'DELETE' }, await getAuthToken()); setBorrows(current => current.filter(item => item._id !== id)); const book = await api<Book>(`/books/${borrow.bookId}`); setBooks(current => current.map(item => item._id === book._id ? book : item)); }
  const [authTimedOut, setAuthTimedOut] = useState(false);
  useEffect(() => { if (!session.isPending) { setAuthTimedOut(false); return; } const timer = window.setTimeout(() => setAuthTimedOut(true), 5000); return () => window.clearTimeout(timer); }, [session.isPending]);
  const value = useMemo(() => ({ user, authLoading: session.isPending && !authTimedOut, books, booksLoading, booksError, retryBooks, borrows, borrowsLoading, login, register, loginWithGoogle, logout, addBook, updateBook, deleteBook, borrowBook, returnBook }), [user, session.isPending, authTimedOut, books, booksLoading, booksError, borrows, borrowsLoading]);
  return <AppContext.Provider value={value}><ToastProvider>{children}</ToastProvider></AppContext.Provider>;
}
