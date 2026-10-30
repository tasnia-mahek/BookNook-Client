import './globals.css';
import { AppProvider } from '@/components/app-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { TitleManager } from '@/components/title-manager';
export const metadata = { title: 'BookNook | Online Library', description: 'Discover your next good read.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AppProvider><TitleManager /><Navbar />{children}<Footer /></AppProvider></body></html>;
}
