'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Book, Borrow } from '@/lib/api';
import { seedBooks } from '@/lib/mock-data';
import { authClient } from '@/lib/auth-client';
import { ToastProvider } from './toast';

export type User = { name: string; email: string; photoUrl?: string };
type Context = {
  user: User | null;
  authLoading: boolean;
  books: Book[];
  borrows: Borrow[];
  login: (email: string, password: string, next?: string) => Promise<void>;
  register: (details: { name: string; email: string; photoUrl: string; password: string }) => Promise<void>;
  loginWithGoogle: (next?: string) => Promise<void>;
  logout: () => Promise<void>;
  addBook: (book: Omit<Book, '_id' | 'addedAt' | 'addedBy' | 'availableCopies'>) => void;
  updateBook: (id: string, changes: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  borrowBook: (id: string) => void;
  returnBook: (id: string) => void;
};
const AppContext = createContext<Context | null>(null);
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
};

function read<T>(key: string, fallback: T): T {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; }
}
function persist(key: string, value: unknown) { localStorage.setItem(key, JSON.stringify(value)); }
function getUser(sessionUser: { name: string; email: string; image?: string | null }): User {
  return { name: sessionUser.name, email: sessionUser.email, photoUrl: sessionUser.image ?? undefined };
}
function authError(error: { message?: string } | null | undefined) {
  return new Error(error?.message || 'Authentication request failed.');
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const session = authClient.useSession();
  const [books, setBooks] = useState<Book[]>(seedBooks);
  const [borrows, setBorrows] = useState<Borrow[]>([]);

  useEffect(() => {
    setBooks(read('booknook-mock-books', seedBooks));
    setBorrows(read('booknook-mock-borrows', []));
  }, []);
  const user = session.data?.user ? getUser(session.data.user) : null;
  const saveBooks = (next: Book[]) => { setBooks(next); persist('booknook-mock-books', next); };
  const saveBorrows = (next: Borrow[]) => { setBorrows(next); persist('booknook-mock-borrows', next); };
  async function login(email: string, password: string, next = '/') {
    const result = await authClient.signIn.email({ email, password, callbackURL: next });
    if (result.error) throw authError(result.error);
    router.push(next);
  }
  async function register(details: { name: string; email: string; photoUrl: string; password: string }) {
    const result = await authClient.signUp.email({ name: details.name, email: details.email, password: details.password, image: details.photoUrl || undefined });
    if (result.error) throw authError(result.error);
  }
  async function loginWithGoogle(next = '/') {
    const result = await authClient.signIn.social({ provider: 'google', callbackURL: next });
    if (result.error) throw authError(result.error);
  }
  async function logout() { const result = await authClient.signOut(); if (result.error) throw authError(result.error); router.push('/'); }
  function addBook(input: Omit<Book, '_id' | 'addedAt' | 'addedBy' | 'availableCopies'>) {
    if (!user) throw new Error('Please log in first.');
    const book: Book = { ...input, _id: `book-${Date.now()}`, addedAt: new Date().toISOString(), addedBy: user, availableCopies: input.totalCopies };
    saveBooks([book, ...books]);
  }
  function updateBook(id: string, changes: Partial<Book>) { saveBooks(books.map(book => book._id === id ? { ...book, ...changes } : book)); }
  function deleteBook(id: string) { saveBooks(books.filter(book => book._id !== id)); }
  function borrowBook(id: string) {
    if (!user) throw new Error('Please log in first.');
    const book = books.find(item => item._id === id);
    if (!book || book.availableCopies < 1) throw new Error('This book is not available.');
    if (borrows.some(item => item.bookId === id && item.userEmail === user.email)) throw new Error('You already borrowed this book.');
    const borrowDate = new Date(); const returnDate = new Date(borrowDate); returnDate.setDate(returnDate.getDate() + 7);
    saveBooks(books.map(item => item._id === id ? { ...item, availableCopies: item.availableCopies - 1 } : item));
    saveBorrows([{ _id: `borrow-${Date.now()}`, bookId: id, bookTitle: book.title, bookImage: book.image, userEmail: user.email, borrowDate: borrowDate.toISOString(), returnDate: returnDate.toISOString() }, ...borrows]);
  }
  function returnBook(id: string) {
    const borrow = borrows.find(item => item._id === id);
    if (!borrow) throw new Error('Borrow not found.');
    saveBooks(books.map(item => item._id === borrow.bookId ? { ...item, availableCopies: Math.min(item.totalCopies, item.availableCopies + 1) } : item));
    saveBorrows(borrows.filter(item => item._id !== id));
  }
  const value = useMemo(() => ({ user, authLoading: session.isPending, books, borrows, login, register, loginWithGoogle, logout, addBook, updateBook, deleteBook, borrowBook, returnBook }), [user, session.isPending, books, borrows]);
  return <AppContext.Provider value={value}><ToastProvider>{children}</ToastProvider></AppContext.Provider>;
}
