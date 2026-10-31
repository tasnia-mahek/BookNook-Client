'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Book } from '@/lib/api';
import { useApp } from './app-provider';
import { useToast } from './toast';
import { BookCover } from './image-fallback';

export function BookForm({ initial, id }: { initial?: Partial<Book>; id?: string }) {
  const { user, addBook, updateBook } = useApp(); const toast = useToast(); const router = useRouter();
  const [form, setForm] = useState({ title: initial?.title ?? '', author: initial?.author ?? '', category: initial?.category ?? 'Fiction', image: initial?.image ?? '', description: initial?.description ?? '', totalCopies: String(initial?.totalCopies ?? 1) });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  if (!user) return <div className="container py-20 text-center">Please log in to continue.</div>;
  async function uploadImage(): Promise<string> {
    if (!imageFile) return form.image;
    const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!key) throw new Error('Image upload is not configured. Add NEXT_PUBLIC_IMGBB_API_KEY to client/.env.local.');
    const body = new FormData(); body.append('image', imageFile);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(key)}`, { method: 'POST', body });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.success || typeof result.data?.display_url !== 'string') throw new Error(result?.error?.message || 'Image upload failed.');
    return result.data.display_url;
  }
  async function submit(event: FormEvent) {
    event.preventDefault(); const copies = Number(form.totalCopies);
    if (!Number.isInteger(copies) || copies < 1) { toast('Total copies must be at least 1.', 'error'); return; }
    if (!id && !imageFile) { toast('Please select a book image.', 'error'); return; }
    setUploading(true);
    try { const image = await uploadImage(); if (id) await updateBook(id, { ...form, image, totalCopies: copies }); else await addBook({ ...form, image, totalCopies: copies }); toast(id ? 'Book updated.' : 'Book added to the collection.'); router.push(id ? '/my-books' : '/books'); } catch (error) { toast((error as Error).message, 'error'); } finally { setUploading(false); }
  }
  return <form onSubmit={submit} className="mt-8 grid gap-5 rounded-2xl bg-white p-7 shadow-sm md:grid-cols-2">{[['title','Book Title'],['author','Author Name'],['totalCopies','Total Copies']].map(([key,label]) => <label key={key} className="font-bold text-forest">{label}<input required className="input mt-2 font-normal" type={key === 'totalCopies' ? 'number' : 'text'} min={key === 'totalCopies' ? '1' : undefined} value={form[key as keyof typeof form]} onChange={event => setForm({ ...form, [key]: event.target.value })}/></label>)}{!id && <><label className="font-bold text-forest">User name<input className="input mt-2 font-normal" value={user.name} readOnly /></label><label className="font-bold text-forest">User email<input className="input mt-2 font-normal" value={user.email} readOnly /></label></>}<label className="font-bold text-forest md:col-span-2">Book Image<input required={!id} className="input mt-2 font-normal" type="file" accept="image/*" onChange={event => { const file = event.target.files?.[0] ?? null; setImageFile(file); setImagePreview(file ? URL.createObjectURL(file) : null); }}/>{(imagePreview || form.image) && <BookCover src={imagePreview || form.image} title={form.title || 'Book cover'} className="mt-3 h-40 w-28 rounded-lg object-cover" />}{id && <span className="mt-1 block text-xs font-normal text-ink/60">Leave empty to keep the current image.</span>}</label><label className="font-bold text-forest">Category<select className="input mt-2 font-normal" value={form.category} onChange={event => setForm({ ...form, category: event.target.value })}>{['Fiction','Science','History','Kids','Others'].map(item => <option key={item}>{item}</option>)}</select></label><div/><label className="font-bold text-forest md:col-span-2">Short Description<textarea required className="input mt-2 min-h-32 font-normal" value={form.description} onChange={event => setForm({ ...form, description: event.target.value })}/></label><button disabled={uploading} className="btn btn-primary md:col-span-2">{uploading ? 'Uploading image…' : id ? 'Save Changes' : 'Add Book'}</button></form>;
}
