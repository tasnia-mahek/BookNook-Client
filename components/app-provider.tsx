'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Book, Borrow } from '@/lib/api';
import { demoBorrow, demoUser, seedBooks } from '@/lib/mock-data';
import { ToastProvider } from './toast';

export type User = { name: string; email: string; photoUrl?: string };
type StoredUser = User & { password: string };
type Context = {
  user: User | null;
  token: string | null;
  books: Book[];
  borrows: Borrow[];
  login: (email: string, password: string, next?: string) => void;
  register: (details: StoredUser) => void;
  logout: () => void;
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

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>(seedBooks);
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [users, setUsers] = useState<StoredUser[]>([{ ...demoUser, password: 'Reader2026' }]);

  useEffect(() => {
    const session = read<{ user: User } | null>('booknook-mock-session', null);
    setUser(session?.user ?? null);
    setToken(session ? 'mock-token' : null);
    setBooks(read('booknook-mock-books', seedBooks));
    setBorrows(read('booknook-mock-borrows', []));
    setUsers(read('booknook-mock-users', [{ ...demoUser, password: 'Reader2026' }]));
  }, []);
  const saveBooks = (next: Book[]) => { setBooks(next); persist('booknook-mock-books', next); };
  const saveBorrows = (next: Borrow[]) => { setBorrows(next); persist('booknook-mock-borrows', next); };
  function login(email: string, password: string, next = '/') {
    const account = users.find(item => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
    if (!account) throw new Error('Use a registered account or the demo credentials shown below.');
    const nextUser = { name: account.name, email: account.email, photoUrl: account.photoUrl };
    setUser(nextUser); setToken('mock-token'); persist('booknook-mock-session', { user: nextUser }); router.push(next);
  }
  function register(details: StoredUser) { const nextUsers = [...users, details]; setUsers(nextUsers); persist('booknook-mock-users', nextUsers); }
  function logout() { localStorage.removeItem('booknook-mock-session'); setUser(null); setToken(null); router.push('/'); }
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
  const value = useMemo(() => ({ user, token, books, borrows, login, register, logout, addBook, updateBook, deleteBook, borrowBook, returnBook }), [user, token, books, borrows, users]);
  return <AppContext.Provider value={value}><ToastProvider>{children}</ToastProvider></AppContext.Provider>;
}
