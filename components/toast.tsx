'use client';
import { createContext, useContext, useState } from 'react';
const ToastContext = createContext<(message: string, kind?: 'success'|'error') => void>(() => {});
export const useToast = () => useContext(ToastContext);
export function ToastProvider({ children }: { children: React.ReactNode }) { const [toast, setToast] = useState<{message:string;kind:string}|null>(null); function show(message:string, kind='success'){setToast({message,kind});setTimeout(()=>setToast(null),3500);} return <ToastContext.Provider value={show}>{children}{toast&&<div className={`fixed right-4 top-20 z-50 rounded-xl px-5 py-3 shadow-xl ${toast.kind==='error'?'bg-[var(--danger)] text-[var(--on-primary)]':'bg-[var(--primary)] text-[var(--on-primary)]'}`}>{toast.message}</div>}</ToastContext.Provider>; }
