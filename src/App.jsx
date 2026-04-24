import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TodayWidget from './components/TodayWidget';
import DateConverter from './components/DateConverter';
import CalendarView from './components/CalendarView';
import HolidayPanel from './components/HolidayPanel';

export default function App() {
  const [lang, setLang] = useState('en');
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('today');

  // Sync dark mode with document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.body.style.background = darkMode ? '#111827' : '#f8fafc';
  }, [darkMode]);

  // Restore preferences
  useEffect(() => {
    const savedLang = localStorage.getItem('ethiodate-lang');
    const savedDark = localStorage.getItem('ethiodate-dark');
    if (savedLang) setLang(savedLang);
    if (savedDark) setDarkMode(savedDark === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('ethiodate-lang', lang);
    localStorage.setItem('ethiodate-dark', darkMode);
  }, [lang, darkMode]);

  const sharedProps = { lang, darkMode };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-slate-50 text-gray-900'
      }`}
      style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic', 'Inter', sans-serif" : "'Inter', sans-serif" }}
    >
      <Navbar
        {...sharedProps}
        setLang={setLang}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-10">

        {/* ── HOME / TODAY ──────────────────────────────────────────────── */}
        {activeTab === 'today' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Hero greeting */}
            <div className="text-center py-4">
              <h1 className={`text-3xl sm:text-4xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {lang === 'am' ? (
                  <>ዛሬ ምን ቀን ነው? <span className="text-green-500">🇪🇹</span></>
                ) : (
                  <>Ethiopian <span className="text-green-500">Date</span> & Calendar</>
                )}
              </h1>
              <p className={`mt-2 text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {lang === 'am'
                  ? 'ቀን ቀይሩ፣ ቀን ይቁጠሩ፣ በዓላትን ይወቁ'
                  : 'Convert dates, explore the Ethiopian calendar, and discover holidays'}
              </p>
            </div>

            {/* Today + Converter side by side on large screens */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <TodayWidget {...sharedProps} />
              <DateConverter {...sharedProps} />
            </div>

            {/* Upcoming holidays preview */}
            <HolidayPanel {...sharedProps} />
          </div>
        )}

        {/* ── CONVERTER ────────────────────────────────────────────────── */}
        {activeTab === 'converter' && (
          <div className="max-w-xl mx-auto animate-fadeIn">
            <div className="text-center py-4 mb-4">
              <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {lang === 'am' ? 'ቀን ቀያሪ' : 'Date Converter'}
              </h1>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {lang === 'am'
                  ? 'ጎርጎሮሲያን ↔ ኢትዮጵያ ቀን'
                  : 'Gregorian ↔ Ethiopian calendar'}
              </p>
            </div>
            <DateConverter {...sharedProps} />

            {/* Quick info */}
            <div className={`mt-5 rounded-xl p-4 text-sm ${
              darkMode ? 'bg-gray-800/50 border border-gray-700/50 text-gray-300' : 'bg-blue-50 border border-blue-100 text-blue-700'
            }`}>
              <p className="font-medium mb-1">
                {lang === 'am' ? '💡 ስለ ቀን አቆጣጠሩ' : '💡 About the Ethiopian Calendar'}
              </p>
              <p className={darkMode ? 'text-gray-400' : 'text-blue-600'}>
                {lang === 'am'
                  ? 'የኢትዮጵያ ቀን አቆጣጠር ከጎርጎሮሲያን ቀን አቆጣጠር 7–8 ዓመት ወደ ኋላ ይቀራል። 12 ወር ሲኖሩት እያንዳንዳቸው 30 ቀናት አሏቸው ፣ ፣ 13ኛው ወር ፓጉሜ ደግሞ 5 ወይም 6 ቀናት ይኖሩታል።'
                  : 'The Ethiopian calendar is 7–8 years behind the Gregorian calendar. It has 12 months of 30 days each, plus a 13th month called Pagume with 5 or 6 days.'}
              </p>
            </div>
          </div>
        )}

        {/* ── CALENDAR ────────────────────────────────────────────────── */}
        {activeTab === 'calendar' && (
          <div className="max-w-lg mx-auto animate-fadeIn">
            <div className="text-center py-4 mb-4">
              <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {lang === 'am' ? 'ቀን መቁጠሪያ' : 'Calendar'}
              </h1>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {lang === 'am' ? 'ኢትዮጵያ ወይም ጎርጎሮሲያን ቀን ይምረጡ' : 'Switch between Ethiopian and Gregorian views'}
              </p>
            </div>
            <CalendarView {...sharedProps} />
          </div>
        )}

        {/* ── HOLIDAYS ────────────────────────────────────────────────── */}
        {activeTab === 'holidays' && (
          <div className="max-w-xl mx-auto animate-fadeIn">
            <div className="text-center py-4 mb-4">
              <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {lang === 'am' ? 'የኢትዮጵያ በዓላት' : 'Ethiopian Holidays'}
              </h1>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {lang === 'am'
                  ? 'ቀጣይ ብሔራዊ እና ሃይማኖታዊ በዓላት'
                  : 'Upcoming national and religious holidays'}
              </p>
            </div>
            <HolidayPanel {...sharedProps} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`text-center py-4 text-xs border-t hidden sm:block transition-colors duration-300 ${
        darkMode ? 'text-gray-600 border-gray-800' : 'text-gray-400 border-gray-100'
      }`}>
        EthioDate &mdash; {lang === 'am' ? 'ቀን ቀያሪ' : 'Ethiopian Calendar Converter'} &mdash; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
