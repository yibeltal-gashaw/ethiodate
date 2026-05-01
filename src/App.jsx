import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TodayWidget from './components/TodayWidget';
import DateConverter from './components/DateConverter';
import CalendarView from './components/CalendarView';
import HolidayPanel from './components/HolidayPanel';

export default function App() {
  const [lang, setLang] = useState('en');
  const [darkMode, setDarkMode] = useState(true); // default dark
  const [activeTab, setActiveTab] = useState('today');

  /* Sync dark mode with document */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.documentElement.classList.toggle('light', !darkMode);
    document.body.style.background = darkMode ? '#0f1117' : '#f8fafc';
  }, [darkMode]);

  /* Restore preferences */
  useEffect(() => {
    const savedLang = localStorage.getItem('ethiodate-lang');
    const savedDark = localStorage.getItem('ethiodate-dark');
    if (savedLang) setLang(savedLang);
    if (savedDark !== null) setDarkMode(savedDark === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('ethiodate-lang', lang);
    localStorage.setItem('ethiodate-dark', String(darkMode));
  }, [lang, darkMode]);

  const sharedProps = { lang, darkMode };

  const pageBg = darkMode ? 'bg-[#0f1117] text-slate-100' : 'bg-slate-50 text-slate-900';
  const sectionHeader = (title, subtitle) => (
    <div className="mb-6">
      <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h1>
      {subtitle && (
        <p className={`mt-1 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${pageBg}`}
      style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic', 'Inter', sans-serif" : "'Inter', sans-serif" }}
    >
      <Navbar
        {...sharedProps}
        setLang={setLang}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-28 sm:pb-12">

        {/* ── HOME / TODAY ──────────────────────────────────────────────── */}
        {activeTab === 'today' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Hero */}
            <div className="py-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="eth-stripe w-8" style={{ height: '3px', borderRadius: '2px' }} />
                <span className={`text-xs font-semibold uppercase tracking-widest ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {lang === 'am' ? 'የኢትዮጵያ ቀን አቆጣጠር' : 'Ethiopian Calendar'}
                </span>
              </div>
              <h1
                className={`text-3xl sm:text-4xl font-bold tracking-tight leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}
              >
                {lang === 'am' ? (
                  <>ዛሬ ምን ቀን ነው?</>
                ) : (
                  <>Ethiopian <span className="text-emerald-500">Date</span> &amp; Calendar</>
                )}
              </h1>
              <p className={`mt-2 text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {lang === 'am'
                  ? 'ቀን ቀይሩ፣ ቀን ይቁጠሩ፣ በዓላትን ይወቁ'
                  : 'Convert dates, explore the Ethiopian calendar, and discover holidays'}
              </p>
            </div>

            {/* Today + Converter */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <TodayWidget {...sharedProps} />
              <DateConverter {...sharedProps} />
            </div>

            {/* Holidays */}
            <HolidayPanel {...sharedProps} />
          </div>
        )}

        {/* ── CONVERTER ────────────────────────────────────────────────── */}
        {activeTab === 'converter' && (
          <div className="max-w-xl mx-auto animate-fadeIn">
            {sectionHeader(
              lang === 'am' ? 'ቀን ቀያሪ' : 'Date Converter',
              lang === 'am' ? 'ጎርጎሮሲያን ↔ ኢትዮጵያ ቀን' : 'Convert between Gregorian and Ethiopian calendars'
            )}
            <DateConverter {...sharedProps} />
            <div className={`mt-5 rounded-xl px-4 py-3 border text-sm ${
              darkMode
                ? 'bg-blue-500/[0.06] border-blue-500/20 text-blue-300'
                : 'bg-blue-50 border-blue-100 text-blue-700'
            }`}>
              <p className="font-semibold mb-1 text-xs uppercase tracking-wider opacity-70">
                {lang === 'am' ? 'ስለ ቀን አቆጣጠሩ' : 'About the Ethiopian Calendar'}
              </p>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {lang === 'am'
                  ? 'የኢትዮጵያ ቀን አቆጣጠር ከጎርጎሮሲያን ቀን አቆጣጠር 7–8 ዓመት ወደ ኋላ ይቀራል። 12 ወር ሲኖሩት እያንዳንዳቸው 30 ቀናት አሏቸው፣ 13ኛው ወር ፓጉሜ ደግሞ 5 ወይም 6 ቀናት ይኖሩታል።'
                  : 'The Ethiopian calendar is 7–8 years behind the Gregorian calendar. It has 12 months of 30 days each, plus a 13th month called Pagume with 5 or 6 days.'}
              </p>
            </div>
          </div>
        )}

        {/* ── CALENDAR ────────────────────────────────────────────────── */}
        {activeTab === 'calendar' && (
          <div className="max-w-lg mx-auto animate-fadeIn">
            {sectionHeader(
              lang === 'am' ? 'ቀን መቁጠሪያ' : 'Calendar',
              lang === 'am' ? 'ኢትዮጵያ ወይም ጎርጎሮሲያን ቀን ይምረጡ' : 'Switch between Ethiopian and Gregorian views'
            )}
            <CalendarView {...sharedProps} />
          </div>
        )}

        {/* ── HOLIDAYS ────────────────────────────────────────────────── */}
        {activeTab === 'holidays' && (
          <div className="max-w-xl mx-auto animate-fadeIn">
            {sectionHeader(
              lang === 'am' ? 'የኢትዮጵያ በዓላት' : 'Ethiopian Holidays',
              lang === 'am' ? 'ቀጣይ ብሔራዊ እና ሃይማኖታዊ በዓላት' : 'Upcoming national and religious holidays'
            )}
            <HolidayPanel {...sharedProps} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`hidden sm:block text-center py-5 text-xs border-t transition-colors duration-300 ${
        darkMode ? 'text-slate-600 border-white/[0.05]' : 'text-slate-400 border-slate-100'
      }`}>
        <div className="flex items-center justify-center gap-2">
          <div className="eth-stripe w-6" style={{ height: '2px', borderRadius: '1px' }} />
          <span>EthioDate &mdash; {lang === 'am' ? 'ቀን ቀያሪ' : 'Ethiopian Calendar Converter'} &mdash; {new Date().getFullYear()}</span>
          <div className="eth-stripe w-6" style={{ height: '2px', borderRadius: '1px' }} />
        </div>
      </footer>
    </div>
  );
}
