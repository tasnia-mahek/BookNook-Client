'use client';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/app-provider';
import { useToast } from '@/components/toast';

export default function Register() {
  const router = useRouter(); const toast = useToast(); const { register, loginWithGoogle } = useApp();
  const [form, setForm] = useState({ name: '', email: '', photoUrl: '', password: '' }); const [submitting, setSubmitting] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password) || form.password.length < 6) { toast('Password needs uppercase, lowercase, and at least 6 characters.', 'error'); return; }
    setSubmitting(true); try { await register(form); toast('Registration successful. Please log in.'); router.push('/login'); } catch (error) { toast((error as Error).message, 'error'); } finally { setSubmitting(false); }
  }
  async function google() { setSubmitting(true); try { await loginWithGoogle('/'); } catch (error) { toast((error as Error).message, 'error'); setSubmitting(false); } }
  return <main className="container grid min-h-[70vh] place-items-center py-16"><form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"><p className="text-sm font-bold uppercase tracking-widest text-clay">Join the shelf</p><h1 className="serif mt-2 text-4xl font-bold text-forest">Create account</h1><div className="mt-7 space-y-4">{[['name','Name','text'],['email','Email','email'],['photoUrl','Photo URL (optional)','url'],['password','Password','password']].map(([key,label,type]) => <input key={key} required={key !== 'photoUrl'} type={type} className="input" placeholder={label} value={form[key as keyof typeof form]} onChange={event => setForm({ ...form, [key]: event.target.value })}/>)}<p className="text-xs text-ink/60">Password: at least 6 characters, with uppercase and lowercase letters.</p><button disabled={submitting} className="btn btn-primary w-full">{submitting ? 'Creating account…' : 'Register'}</button><button disabled={submitting} type="button" className="btn btn-secondary w-full" onClick={google}>Register with Google</button></div><p className="mt-6 text-center text-sm text-ink/60">Already registered? <Link className="font-bold text-moss" href="/login">Log in</Link></p></form></main>;
}
