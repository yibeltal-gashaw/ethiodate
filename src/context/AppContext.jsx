import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [lang, setLang] = useState('en');
  const [darkMode, setDarkMode] = useState(false);

  // Restore from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('ethiodate-lang');
    const savedDark = localStorage.getItem('ethiodate-dark');
    if (savedLang) setLang(savedLang);
    if (savedDark) setDarkMode(savedDark === 'true');
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
