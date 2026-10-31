'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Quote, Sparkles, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useApp } from '@/components/app-provider';
import { BookCard } from '@/components/book-card';
import { Loading } from '@/components/loading';
import { api } from '@/lib/api';
import { Reveal } from '@/components/motion';

const slides = [
  ['Stories that stay with you.', 'A calm, curated online library for finding remarkable books and sharing the ones you love.', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80'],
  ['Make room for wonder.', 'Browse thoughtful nonfiction, imaginative fiction, and the books our readers are talking about.', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80'],
  ['Pass a good story on.', 'Add a favorite to the collection and help another curious reader discover their next great read.', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=700&q=80'],
];
const readerReviews = [
  { name: 'Maya Rahman', initial: 'M', review: 'The Midnight Library made me pause and appreciate all the lives hidden inside every choice.' },
  { name: 'Daniel Brooks', initial: 'D', review: 'BookNook makes borrowing feel effortless. I found a wonderful science read in minutes.' },
  { name: 'Aisha Karim', initial: 'A', review: 'The collection feels personal, calm, and full of stories I would never have found elsewhere.' },
];

export default function Home() {
  const { books } = useApp();
  const [newArrivals, setNewArrivals] = useState<typeof books>([]);
  useEffect(() => { api<typeof books>('/books?sort=newest&limit=6').then(setNewArrivals).catch(error => console.error('Unable to load new arrivals:', error)); }, []);
  return <main>
    <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 5000 }} pagination={{ clickable: true }} loop className="bg-forest text-white">
      {slides.map(([title, text, image]) => <SwiperSlide key={title}><section><div className="container grid min-h-[520px] items-center gap-10 py-20 md:grid-cols-2"><Reveal><div><p className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-[.25em] text-[#d8b27d]"><Sparkles size={16}/>Your next chapter awaits</p><h1 className="serif text-5xl font-bold leading-tight md:text-7xl">{title}</h1><p className="mt-6 max-w-lg text-lg leading-8 text-white/70">{text}</p><Link className="btn mt-8 bg-[#d8b27d] text-forest" href="/books">Browse Books <ArrowRight size={18}/></Link></div></Reveal><img className="mx-auto h-[390px] w-full max-w-sm rounded-2xl object-cover shadow-2xl" src={image} alt="BookNook featured book"/></div></section></SwiperSlide>)}
    </Swiper>
    <section className="container py-20"><div className="flex items-end justify-between"><div><p className="text-sm font-bold uppercase tracking-widest text-clay">Fresh from the shelves</p><h2 className="serif mt-2 text-4xl font-bold text-forest">New arrivals</h2></div></div>{newArrivals.length ? <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{newArrivals.map((book, index) => <Reveal key={book._id} delay={index * 0.1}><BookCard book={book}/></Reveal>)}</div> : <Loading/>}<Link href="/books" className="btn btn-primary mt-8">See All Books</Link></section>
    <Reveal><section className="bg-[#e4eadf] py-20"><div className="container grid gap-8 md:grid-cols-2"><div><BookOpen className="text-clay"/><h2 className="serif mt-4 text-3xl font-bold text-forest">Borrowing made simple</h2><p className="mt-4 leading-7 text-ink/70">Find a title, borrow it for seven days, and return it when you are ready. Your shelf and borrowing history stay neatly organized in one place.</p></div>    <div className="glow-card rounded-2xl bg-[var(--surface)] p-8"><h3 className="serif text-2xl font-bold text-forest">A community of readers</h3><p className="mt-3 leading-7 text-ink/70">Add your own favorites to the collection and help another curious reader discover their next great read.</p></div></div></section></Reveal>
    <section className="container py-20"><div className="flex items-end justify-between"><div><p className="text-sm font-bold uppercase tracking-widest text-clay">Find your next shelf</p><h2 className="serif mt-2 text-4xl font-bold text-forest">Top categories</h2></div><Link href="/books" className="font-bold text-moss">Explore all →</Link></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{['Fiction', 'Science', 'History', 'Kids', 'Others'].map(category => <Link key={category} href={`/books?category=${category}`} className="rounded-2xl bg-white p-6 text-center font-bold text-forest shadow-sm ring-1 ring-[#e2e8e0] transition hover:-translate-y-1 hover:shadow-lg">{category}<span className="mt-2 block text-sm font-normal text-ink/60">Browse titles</span></Link>)}</div></section>
    <section className="bg-[#e4eadf] py-20"><div className="container"><div className="text-center"><p className="text-sm font-bold uppercase tracking-widest text-clay">From our readers</p><h2 className="serif mt-2 text-4xl font-bold text-forest">Reader reviews</h2><p className="mx-auto mt-3 max-w-xl text-ink/70">Sample testimonials from the BookNook community.</p></div><div className="mt-10 grid gap-6 md:grid-cols-3">{readerReviews.map(review => <article key={review.name} className="flex h-full flex-col rounded-2xl bg-ivory p-6 shadow-sm"><Quote className="text-clay" size={24}/><div className="mt-5 flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-full bg-forest font-bold text-white">{review.initial}</div><div><h3 className="font-bold text-forest">{review.name}</h3><div className="mt-1 flex gap-1 text-[#d8a84e]" aria-label="5 out of 5 stars">{[1,2,3,4,5].map(star => <Star key={star} size={14} fill="currentColor"/>)}</div></div></div><p className="mt-5 flex-1 leading-7 text-ink/70">&ldquo;{review.review}&rdquo;</p></article>)}</div></div></section>
    <section className="container py-20 text-center"><p className="text-sm font-bold uppercase tracking-widest text-clay">Read widely</p><h2 className="serif mt-3 text-4xl font-bold text-forest">Every shelf has a story.</h2><p className="mx-auto mt-4 max-w-xl text-ink/70">From thoughtful history to imaginative fiction, BookNook keeps discovery feeling personal.</p></section>
  </main>;
}
