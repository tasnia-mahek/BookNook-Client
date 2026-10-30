'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Book } from '@/lib/api';
import { useApp } from './app-provider';
import { useToast } from './toast';

export function BookForm({ initial, id }: { initial?: Partial<Book>; id?: string }) {
  const { user, addBook, updateBook } = useApp(); const toast = useToast(); const router = useRouter();
  const [form, setForm] = useState({ title: initial?.title ?? '', author: initial?.author ?? '', category: initial?.category ?? 'Fiction', image: initial?.image ?? '', description: initial?.description ?? '', totalCopies: String(initial?.totalCopies ?? 1) });
  if (!user) return <div className="container py-20 text-center">Please log in to continue.</div>;
  function submit(event: FormEvent) { event.preventDefault(); const copies = Number(form.totalCopies); if (!Number.isInteger(copies) || copies < 1) { toast('Total copies must be at least 1.', 'error'); return; } try { if (id) updateBook(id, { ...form, totalCopies: copies, availableCopies: Math.min(copies, initial?.availableCopies ?? copies) }); else addBook({ ...form, totalCopies: copies }); toast(id ? 'Book updated.' : 'Book added to the collection.'); router.push(id ? '/my-books' : '/books'); } catch (error) { toast((error as Error).message, 'error'); } }
  return <form onSubmit={submit} className="mt-8 grid gap-5 rounded-2xl bg-white p-7 shadow-sm md:grid-cols-2">{[['title','Book Title'],['author','Author Name'],['image','Book Image URL'],['totalCopies','Total Copies']].map(([key,label]) => <label key={key} className="font-bold text-forest">{label}<input required className="input mt-2 font-normal" type={key === 'totalCopies' ? 'number' : 'text'} min={key === 'totalCopies' ? '1' : undefined} value={form[key as keyof typeof form]} onChange={event => setForm({ ...form, [key]: event.target.value })}/></label>)}<label className="font-bold text-forest">Category<select className="input mt-2 font-normal" value={form.category} onChange={event => setForm({ ...form, category: event.target.value })}>{['Fiction','Science','History','Kids','Others'].map(item => <option key={item}>{item}</option>)}</select></label><div/><label className="font-bold text-forest md:col-span-2">Short Description<textarea required className="input mt-2 min-h-32 font-normal" value={form.description} onChange={event => setForm({ ...form, description: event.target.value })}/></label><p className="text-sm text-ink/60 md:col-span-2">Added by {user.name} ({user.email})</p><button className="btn btn-primary md:col-span-2">{id ? 'Save Changes' : 'Add Book'}</button></form>;
}
