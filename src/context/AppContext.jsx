import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('ethiodate-lang') || 'en');
  const [darkMode, setDarkMode] = useState(() => {
    const savedDark = localStorage.getItem('ethiodate-dark');
    if (savedDark !== null) {
      return savedDark === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only auto-switch if user hasn't explicitly set a preference
      if (localStorage.getItem('ethiodate-dark') === null) {
        setDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Persist + sync dark class
  useEffect(() => {
    localStorage.setItem('ethiodate-lang', lang);
    localStorage.setItem('ethiodate-dark', darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
    document.body.style.background = darkMode ? '#111827' : '#f8fafc';
  }, [lang, darkMode]);

  return (
    <AppContext.Provider value={{ lang, setLang, darkMode, setDarkMode }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
