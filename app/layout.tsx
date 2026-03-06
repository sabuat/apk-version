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
          
          <AnimatePresence>
            {isMenuOpen && <SideMenu onClose={() => setIsMenuOpen(false)} />}
          </AnimatePresence>

          {/* CABECERA CORREGIDA: Usamos 'sticky' en lugar de 'fixed' para que NO solape el contenido de las páginas */}
          {showNav && !isReadingMode && (
            <header 
              className="sticky top-0 w-full z-40 bg-brand-bg/90 dark:bg-[#121212]/90 backdrop-blur-md border-b border-brand-gold/10 dark:border-brand-gold/20 px-6 py-4 flex justify-between items-center transition-colors duration-500" 
              style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}
            >
              <Image src="/logo.png" alt="Apapacho" width={120} height={40} className="w-auto h-8" />
              <button onClick={() => setIsMenuOpen(true)} className="p-2 text-brand-dark dark:text-brand-gold active:scale-90 transition-transform">
                <Menu size={24} />
              </button>
            </header>
          )}

          <main className="flex-grow flex flex-col relative z-10">
            {children}
          </main>

          {showNav && !isReadingMode && (
            <nav 
              className="fixed bottom-0 w-full backdrop-blur-md bg-white/80 dark:bg-[#121212]/90 border-t border-brand-gold/10 dark:border-brand-gold/20 flex justify-around items-center z-40 transition-colors duration-500"
              style={{ 
                paddingBottom: 'env(safe-area-inset-bottom)',
                height: 'calc(5rem + env(safe-area-inset-bottom))' 
              }}
            >
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