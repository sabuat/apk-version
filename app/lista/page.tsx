"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BookOpen, X, Filter, FilterX } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import BookDetailSheet from '@/components/BookDetailSheet';

const GENRES = [
  'Cuentos', 'Ensayos', 'Literatura Fantástica', 
  'Literatura Romántica', 'Microrelatos', 'Novela', 
  'Novela Corta', 'Poesia'
];
const LANGUAGES = ['EN', 'ES', 'IT', 'PT'];

export default function MiListaPage() {
  const [savedBooks, setSavedBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<any>(null);

  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');

  useEffect(() => {
    async function fetchMyList() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('my_list')
        .select(`
          id,
          book_id,
          books (*) 
        `) 
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setSavedBooks(data);
      setLoading(false);
    }
    fetchMyList();
  }, []);

  const authors = Array.from(new Set(savedBooks.map((item) => {
    const book = Array.isArray(item.books) ? item.books[0] : item.books;
    return book?.author;
  }).filter(Boolean))) as string[];

  const filteredBooks = savedBooks.filter((item) => {
    const book = Array.isArray(item.books) ? item.books[0] : item.books;
    if (!book) return false;

    const matchGenre = selectedGenre ? book.genre === selectedGenre : true;
    const matchLanguage = selectedLanguage ? book.language === selectedLanguage : true;
    const matchAuthor = selectedAuthor ? book.author === selectedAuthor : true;

    return matchGenre && matchLanguage && matchAuthor;
  });

  const hasActiveFilters = selectedGenre || selectedLanguage || selectedAuthor;

  if (loading) return <div className="p-20 text-center font-bold text-[11px] uppercase tracking-widest text-brand-gold">Cargando...</div>;

  return (
    <div className="min-h-[100dvh] bg-brand-bg dark:bg-[#121212] transition-colors duration-500 px-6 pb-24 overflow-x-hidden relative">
      <header className="pt-10 pb-6 border-b border-brand-gold/10 dark:border-brand-gold/20 mb-6 flex justify-between items-end transition-colors">
        <h1 className="text-xl font-serif italic text-brand-dark dark:text-brand-gold transition-colors">Mi Lista</h1>
        <button 
          onClick={() => setShowFilterPanel(true)}
          className={`relative p-3 rounded-full transition-colors ${hasActiveFilters ? 'bg-brand-dark-blue/10 dark:bg-brand-gold/20' : 'bg-transparent active:bg-brand-gold/5'}`}
        >
          <Filter size={22} className="text-brand-dark-blue dark:text-brand-gold transition-colors" />
          {hasActiveFilters && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-gold rounded-full border-2 border-brand-bg dark:border-[#121212]"></span>
          )}
        </button>
      </header>

      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6 items-start">
          {filteredBooks.map((item) => {
            const book = Array.isArray(item.books) ? item.books[0] : item.books;

            return (
              <div 
                key={item.id} 
                onClick={() => setSelectedBook(book)}
                className="relative aspect-[5/8] rounded-md overflow-hidden shadow-lg active:scale-95 transition-transform block bg-brand-blue-bg dark:bg-black/50 border border-brand-gold/5 dark:border-brand-gold/20 cursor-pointer group"
              >
                {book.cover_url ? (
                  <img src={book.cover_url} alt={book.title} className={`w-full h-full object-cover ${!book.published ? 'opacity-[0.45]' : ''}`} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="text-brand-dark/20 dark:text-gray-600" size={24} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-dark/40 dark:text-gray-400 mb-2 transition-colors">Lista vacía</p>
          <p className="text-[10px] text-brand-dark/30 dark:text-gray-500 transition-colors">Los libros que guardes aparecerán aquí.</p>
        </div>
      )}

      <AnimatePresence>
        {showFilterPanel && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            onClick={() => setShowFilterPanel(false)} 
            className="fixed inset-0 z-[70] bg-black/40 dark:bg-black/70 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: '0%' }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-y-0 right-0 w-[85%] max-w-sm bg-brand-bg dark:bg-[#121212] transition-colors duration-500 shadow-2xl flex flex-col border-l border-brand-gold/10 dark:border-brand-gold/20"
              style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              <div className="p-6 flex justify-between items-center border-b border-brand-gold/5 dark:border-brand-gold/10 shrink-0">
                <h2 className="text-2xl font-serif italic text-brand-dark-blue dark:text-brand-gold transition-colors">Filtros</h2>
                <button onClick={() => setShowFilterPanel(false)} className="p-2 active:scale-90 transition-transform">
                  <X size={26} className="text-brand-dark-blue dark:text-gray-300 transition-colors" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-8 scrollbar-hide">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold mb-3 block">Género</label>
                  <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full bg-white dark:bg-[#1A1A1A] border border-brand-gold/20 dark:border-brand-gold/30 text-brand-dark-blue dark:text-gray-200 text-xs font-bold uppercase tracking-widest rounded-full px-5 py-3.5 outline-none transition-colors appearance-none shadow-sm"
                  >
                    <option value="">Todos los géneros</option>
                    {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold mb-3 block">Idioma</label>
                  <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full bg-white dark:bg-[#1A1A1A] border border-brand-gold/20 dark:border-brand-gold/30 text-brand-dark-blue dark:text-gray-200 text-xs font-bold uppercase tracking-widest rounded-full px-5 py-3.5 outline-none transition-colors appearance-none shadow-sm"
                  >
                    <option value="">Todos los idiomas</option>
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold mb-3 block">Autor</label>
                  <select value={selectedAuthor} onChange={(e) => setSelectedAuthor(e.target.value)}
                    className="w-full bg-white dark:bg-[#1A1A1A] border border-brand-gold/20 dark:border-brand-gold/30 text-brand-dark-blue dark:text-gray-200 text-xs font-bold uppercase tracking-widest rounded-full px-5 py-3.5 outline-none transition-colors appearance-none shadow-sm"
                  >
                    <option value="">Todos los autores</option>
                    {authors.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              <div className="p-6 border-t border-brand-gold/5 dark:border-brand-gold/10 shrink-0 space-y-3">
                <button 
                  onClick={() => setShowFilterPanel(false)}
                  className="w-full bg-brand-dark-blue dark:bg-brand-gold text-white dark:text-[#121212] py-4 rounded-full font-bold text-[11px] uppercase tracking-widest active:scale-95 transition-all shadow-lg"
                >
                  Aplicar Filtros
                </button>
                {hasActiveFilters && (
                  <button 
                    onClick={() => {
                      setSelectedGenre('');
                      setSelectedLanguage('');
                      setSelectedAuthor('');
                    }}
                    className="w-full flex items-center justify-center gap-2.5 bg-red-50 dark:bg-red-900/20 text-brand-red border border-red-100 dark:border-red-900/50 py-4 rounded-full font-bold text-[11px] uppercase tracking-widest active:scale-95 transition-all shadow-sm"
                  >
                    <FilterX size={16} /> Limpiar Filtros
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedBook && (
          <BookDetailSheet 
            book={selectedBook} 
            onClose={() => {
              setSelectedBook(null);
              window.location.reload(); 
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}