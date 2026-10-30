'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const titles: Record<string, string> = {
  '/': 'BookNook | Home',
  '/books': 'BookNook | All Books',
  '/add-book': 'BookNook | Add Book',
  '/my-books': 'BookNook | My Books',
  '/my-borrows': 'BookNook | My Borrows',
  '/profile': 'BookNook | My Profile',
  '/login': 'BookNook | Login',
  '/register': 'BookNook | Register',
};
export function TitleManager() { const pathname = usePathname(); useEffect(() => { document.title = titles[pathname] ?? (pathname.startsWith('/books/') ? 'BookNook | Book Details' : pathname.startsWith('/my-books/') ? 'BookNook | Edit Book' : 'BookNook'); }, [pathname]); return null; }
