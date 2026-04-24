import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import TodayWidget from './components/TodayWidget';
import DateConverter from './components/DateConverter';
import CalendarView from './components/CalendarView';
import HolidayPanel from './components/HolidayPanel';
import HolidayDetail from './pages/HolidayDetail';

// ── Main shell (all tabs live here at "/") ──────────────────────────────────
function MainShell() {
  const { lang, setLang, darkMode, setDarkMode } = useApp();
  const [activeTab, setActiveTab] = useState('today');
  const sharedProps = { lang, darkMode };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-slate-50 text-gray-900'}`}
      style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic','Inter',sans-serif" : "'Inter',sans-serif" }}
    >
      <Navbar
        lang={lang} setLang={setLang}
        darkMode={darkMode} setDarkMode={setDarkMode}
        activeTab={activeTab} setActiveTab={setActiveTab}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-10">

        {/* ── TODAY ──────────────────────────────────────────────────── */}
        {activeTab === 'today' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center py-4">
              <h1 className={`text-3xl sm:text-4xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {lang === 'am'
                  ? <>ዛሬ ምን ቀን ነው? <span className="text-green-500">🇪🇹</span></>
                  : <>Ethiopian <span className="text-green-500">Date</span> &amp; Calendar</>}
              </h1>
              <p className={`mt-2 text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {lang === 'am'
                  ? 'ቀን ቀይሩ፣ ቀን ይቁጠሩ፣ በዓላትን ይወቁ'
                  : 'Convert dates, explore the Ethiopian calendar, and discover holidays'}
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <TodayWidget {...sharedProps} />
              <DateConverter {...sharedProps} />
            </div>
            <HolidayPanel {...sharedProps} />
          </div>
        )}

        {/* ── CONVERTER ──────────────────────────────────────────────── */}
        {activeTab === 'converter' && (
          <div className="max-w-xl mx-auto animate-fadeIn">
            <div className="text-center py-4 mb-4">
              <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {lang === 'am' ? 'ቀን ቀያሪ' : 'Date Converter'}
              </h1>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {lang === 'am' ? 'ጎርጎሮሲያን ↔ ኢትዮጵያ ቀን' : 'Gregorian ↔ Ethiopian calendar'}
              </p>
            </div>
            <DateConverter {...sharedProps} />
            <div className={`mt-5 rounded-xl p-4 text-sm ${
              darkMode ? 'bg-gray-800/50 border border-gray-700/50 text-gray-300' : 'bg-blue-50 border border-blue-100 text-blue-700'
            }`}>
              <p className="font-medium mb-1">
                {lang === 'am' ? '💡 ስለ ቀን አቆጣጠሩ' : '💡 About the Ethiopian Calendar'}
              </p>
              <p className={darkMode ? 'text-gray-400' : 'text-blue-600'}>
                {lang === 'am'
                  ? 'የኢትዮጵያ ቀን አቆጣጠር ከጎርጎሮሲያን ቀን አቆጣጠር 7–8 ዓመት ወደ ኋላ ይቀራል። 12 ወር ሲኖሩት እያንዳንዳቸው 30 ቀናት አሏቸው፣ 13ኛው ወር ፓጉሜ ደግሞ 5 ወይም 6 ቀናት ይኖሩታል።'
                  : 'The Ethiopian calendar is 7–8 years behind the Gregorian calendar. It has 12 months of 30 days each, plus a 13th month called Pagume with 5 or 6 days.'}
              </p>
            </div>
          </div>
        )}

        {/* ── CALENDAR ───────────────────────────────────────────────── */}
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

        {/* ── HOLIDAYS ───────────────────────────────────────────────── */}
        {activeTab === 'holidays' && (
          <div className="max-w-3xl mx-auto animate-fadeIn">
            <div className="text-center py-4 mb-4">
              <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {lang === 'am' ? 'የኢትዮጵያ በዓላት' : 'Ethiopian Holidays'}
              </h1>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {lang === 'am' ? 'ቀጣይ ብሔራዊ እና ሃይማኖታዊ በዓላት' : 'National and religious holidays — tap a card for details'}
              </p>
            </div>
            <HolidayPanel {...sharedProps} />
          </div>
        )}
      </main>

      <footer className={`text-center py-4 text-xs border-t hidden sm:block transition-colors duration-300 ${
        darkMode ? 'text-gray-600 border-gray-800' : 'text-gray-400 border-gray-100'
      }`}>
        EthioDate &mdash; {lang === 'am' ? 'ቀን ቀያሪ' : 'Ethiopian Calendar Converter'} &mdash; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

// ── Root with routing ───────────────────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainShell />} />
      <Route path="/holidays/:key" element={<HolidayDetail />} />
    </Routes>
  );
}
