"use client";

import { useEffect, useState } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Revisamos qué guardó el usuario en su teléfono
    const isNightMode = localStorage.getItem('apapacho_nightMode') === 'true';
    
    // Si es true, le ponemos la clase "dark" a toda la página web/app
    if (isNightMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Un pequeño truco para evitar el parpadeo de pantalla al cargar
  if (!mounted) {
    return <div className="invisible">{children}</div>;
  }

  return <>{children}</>;
}