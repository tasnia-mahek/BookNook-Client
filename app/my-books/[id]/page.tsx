'use client';
import { useParams } from 'next/navigation';
import { BookForm } from '@/components/book-form';
import { useApp } from '@/components/app-provider';
import { Loading } from '@/components/loading';
import { Protected } from '@/components/protected';
export default function EditBook() { const { id } = useParams<{ id: string }>(); const { books, user } = useApp(); const book = books.find(item => item._id === id); if (!user) return <Protected><main /></Protected>; if (book && book.addedBy.email !== user.email) return <Protected><main className="container py-20 text-center">This book is not yours to edit.</main></Protected>; return <Protected><main className="container py-16"><h1 className="serif text-5xl font-bold text-forest">Edit book</h1>{book ? <BookForm initial={book} id={id}/> : <Loading/>}</main></Protected>; }
