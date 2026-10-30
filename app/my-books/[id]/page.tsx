'use client';
import { useParams, useRouter } from 'next/navigation';
import { BookForm } from '@/components/book-form';
import { useApp } from '@/components/app-provider';
import { Loading } from '@/components/loading';
export default function EditBook() { const { id } = useParams<{ id: string }>(); const router = useRouter(); const { books, user } = useApp(); const book = books.find(item => item._id === id); if (!user || (book && book.addedBy.email !== user.email)) { router.push('/my-books'); return null; } return <main className="container py-16"><h1 className="serif text-5xl font-bold text-forest">Edit book</h1>{book ? <BookForm initial={book} id={id}/> : <Loading/>}</main>; }
