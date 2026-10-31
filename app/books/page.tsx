'use client';
import { useEffect, useMemo, useState } from 'react';
import { useApp } from '@/components/app-provider';
import { BookCard } from '@/components/book-card';
import { Loading } from '@/components/loading';

export default function BooksPage() {
  const { books, booksLoading, booksError, retryBooks } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  useEffect(() => { const selected = new URLSearchParams(window.location.search).get('category'); if (selected) setCategory(selected); }, []);
  const filtered = useMemo(() => books.filter(book => (category === 'All' || book.category === category) && `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : sort === 'author' ? a.author.localeCompare(b.author) : new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()), [books, category, query, sort]);
  const categories = ['All', 'Fiction', 'Science', 'History', 'Kids', 'Others'];
  if (booksLoading) return <Loading />;
  if (booksError) return <main className="container py-16 text-center"><p className="text-[var(--text-muted)]">Couldn't load books. Try again.</p><button className="btn btn-primary mt-5" onClick={retryBooks}>Retry</button></main>;
  return <main className="container py-16"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-sm font-bold uppercase tracking-widest text-clay">The collection</p><h1 className="serif mt-2 text-5xl font-bold text-forest">All books</h1><p className="mt-3 text-ink/60">{filtered.length} titles to discover</p></div><div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row"><input className="input min-w-0 px-4" placeholder="Search books" value={query} onChange={event => setQuery(event.target.value)} /><select className="input w-full sm:w-auto" aria-label="Sort books" value={sort} onChange={event => setSort(event.target.value)}><option value="newest">Newest</option><option value="title">Title</option><option value="author">Author</option></select></div></div><div className="mt-8 flex flex-wrap gap-2">{categories.map(item => <button key={item} onClick={() => setCategory(item)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${category === item ? 'bg-[var(--primary)] text-[var(--on-primary)]' : 'bg-white text-forest ring-1 ring-[#dfe5dc] hover:bg-[#e4eadf]'}`}>{item}</button>)}</div><div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(book => <BookCard key={book._id} book={book} />)}</div>{!filtered.length && <p className="mt-10 text-center text-ink/60">No books match that search.</p>}</main>;
}
