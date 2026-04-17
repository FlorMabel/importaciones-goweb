import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemTheme)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="fixed bottom-20 right-6 lg:bottom-10 lg:right-10 z-[60] hidden lg:block">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className="relative flex items-center gap-3 bg-white dark:bg-surface-soft p-1.5 rounded-full shadow-strong border border-border-light dark:border-border-strong group transition-all duration-300 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80"
      >
        <div className="flex items-center gap-1.5 px-2 py-1">
          {/* Light Icon */}
          <span className={`material-symbols-outlined text-[20px] transition-colors duration-300 ${!isDark ? 'text-primary' : 'text-text-muted opacity-40'}`}>
            light_mode
          </span>
          
          {/* Apple-style switch track */}
          <div className="relative w-10 h-6 bg-border-light dark:bg-border-strong rounded-full overflow-hidden transition-colors">
            <motion.div
              animate={{ x: isDark ? 16 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute top-1 left-1 w-4 h-4 bg-white dark:bg-primary rounded-full shadow-sm flex items-center justify-center"
            />
          </div>

          {/* Dark Icon */}
          <span className={`material-symbols-outlined text-[20px] transition-colors duration-300 ${isDark ? 'text-accent' : 'text-text-muted opacity-40'}`}>
            dark_mode
          </span>
        </div>

        {/* Tooltip hint */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-text-main text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity uppercase tracking-widest whitespace-nowrap hidden lg:block">
          Modo {isDark ? 'Claro' : 'Oscuro'}
        </span>
      </motion.button>
    </div>
  );
}
