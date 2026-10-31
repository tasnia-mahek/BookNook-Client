import './globals.css';
import { AppProvider } from '@/components/app-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { TitleManager } from '@/components/title-manager';
import { DM_Serif_Display, Plus_Jakarta_Sans } from 'next/font/google';
const heading = DM_Serif_Display({ subsets: ['latin'], weight: '400', variable: '--font-heading' });
const body = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-body' });
export const metadata = { title: 'BookNook | Online Library', description: 'Discover your next good read.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.toggle('dark', localStorage.getItem('booknook-theme') === 'dark')` }} /></head><body className={`${heading.variable} ${body.variable}`}><AppProvider><TitleManager /><Navbar />{children}<Footer /></AppProvider></body></html>;
}
