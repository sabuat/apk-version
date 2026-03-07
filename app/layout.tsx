"use client";

import './globals.css';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Bookmark, BookOpen, User, Menu } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import SideMenu from '@/components/SideMenu';
import Link from 'next/link';
import ThemeProvider from '@/components/ThemeProvider'; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isReadingMode = pathname?.startsWith('/leer'); 
  const showNav = pathname !== '/';

  useEffect(() => {
    if (pathname && pathname !== '/') {
      localStorage.setItem('apapacho_last_route', pathname);
    }
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  return (
    <html lang="es">
      <body className="bg-brand-bg dark:bg-[#121212] text-brand-dark dark:text-gray-200 min-h-[100dvh] flex flex-col overflow-x-hidden antialiased transition-colors duration-500">
        
        <ThemeProvider>
          {showNav && !isReadingMode && (
            <header className="fixed top-0 w-full h-16 bg-brand-bg/80 dark:bg-[#121212]/90 backdrop-blur-md z-40 px-6 flex justify-between items-center border-b border-brand-gold/10 dark:border-brand-gold/20 transition-colors duration-500">
              <Link href="/home" className="flex items-center active:scale-95 transition-transform">
                <Image src="/logo.png" alt="Logo" width={110} height={35} className="object-contain" priority />
              </Link>
              
              <button onClick={() => setIsMenuOpen(true)} className="p-2 active:scale-90 transition-transform">
                <Menu size={24} className="text-brand-dark dark:text-brand-gold transition-colors" />
              </button>
            </header>
          )}

          <AnimatePresence>
            {isMenuOpen && <SideMenu onClose={() => setIsMenuOpen(false)} />}
          </AnimatePresence>

          <main className={`flex-grow w-full overflow-x-hidden ${(!showNav || isReadingMode) ? 'pt-0' : 'pt-16'} ${!showNav || isReadingMode ? 'pb-0' : 'pb-24'}`}>
            {children}
          </main>

          {showNav && !isReadingMode && (
            <nav className="fixed bottom-0 w-full h-20 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-lg border-t border-brand-gold/10 dark:border-brand-gold/20 px-8 flex justify-between items-center z-40 pb-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.5)] transition-colors duration-500">
              <Link href="/home" className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${isActive('/home') ? 'text-brand-dark-blue dark:text-brand-gold' : 'text-gray-400 dark:text-gray-500'}`}>
                <Home size={22} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
              </Link>
              
              <Link href="/lista" className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${isActive('/lista') ? 'text-brand-dark-blue dark:text-brand-gold' : 'text-gray-400 dark:text-gray-500'}`}>
                <Bookmark size={22} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">Mi Lista</span>
              </Link>

              <Link href="/lecturas" className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${isActive('/lecturas') ? 'text-brand-dark-blue dark:text-brand-gold' : 'text-gray-400 dark:text-gray-500'}`}>
                <BookOpen size={22} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">Lecturas</span>
              </Link>

              <Link href="/cuenta" className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${isActive('/cuenta') ? 'text-brand-dark-blue dark:text-brand-gold' : 'text-gray-400 dark:text-gray-500'}`}>
                <User size={22} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">Cuenta</span>
              </Link>
            </nav>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}