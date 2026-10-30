'use client';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useApp } from '@/components/app-provider';
import { useToast } from '@/components/toast';

export default function Login() {
  const { login, loginWithGoogle } = useApp();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nextPath, setNextPath] = useState('/');
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => { setNextPath(new URLSearchParams(window.location.search).get('next') || '/'); }, []);
  async function submit(event: FormEvent) {
    event.preventDefault(); setSubmitting(true);
    try { await login(email, password, nextPath); } catch (error) { toast((error as Error).message, 'error'); } finally { setSubmitting(false); }
  }
  async function google() {
    setSubmitting(true);
    try { await loginWithGoogle(nextPath); } catch (error) { toast((error as Error).message, 'error'); setSubmitting(false); }
  }
  return <main className="container grid min-h-[70vh] place-items-center py-16"><form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"><p className="text-sm font-bold uppercase tracking-widest text-clay">Welcome back</p><h1 className="serif mt-2 text-4xl font-bold text-forest">Log in</h1><div className="mt-7 space-y-4"><input required type="email" className="input" placeholder="Email" value={email} onChange={event => setEmail(event.target.value)}/><input required type="password" className="input" placeholder="Password" value={password} onChange={event => setPassword(event.target.value)}/><div className="text-right text-sm text-moss">Forget password?</div><button disabled={submitting} className="btn btn-primary w-full">{submitting ? 'Logging in…' : 'Login'}</button><button disabled={submitting} type="button" className="btn btn-secondary w-full" onClick={google}>Continue with Google</button></div><p className="mt-6 text-center text-sm text-ink/60">New here? <Link className="font-bold text-moss" href="/register">Create an account</Link></p></form></main>;
}
