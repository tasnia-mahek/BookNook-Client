export type Book = { _id: string; title: string; author: string; category: string; image: string; description: string; addedBy: { name: string; email: string; photoUrl?: string }; totalCopies: number; availableCopies: number; addedAt: string };
export type Borrow = { _id: string; bookId: string; bookTitle: string; bookImage: string; userEmail: string; borrowDate: string; returnDate: string };

const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export async function api<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message ?? 'Something went wrong.');
  return data as T;
}

export async function getAuthToken(): Promise<string> {
  const response = await fetch('/api/auth/token', { credentials: 'include' });
  const data = await response.json().catch(() => null);
  if (!response.ok || typeof data?.token !== 'string') throw new Error('Your session token could not be loaded.');
  return data.token;
}
