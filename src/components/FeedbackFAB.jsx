import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

export default function FeedbackFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { lang, darkMode } = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    // Send email via mailto
    const subject = encodeURIComponent('EthioDate Feedback');
    const fullFeedback = `Name: ${name || 'N/A'}\nEmail: ${email || 'N/A'}\n\nFeedback:\n${feedback}`;
    const body = encodeURIComponent(fullFeedback);
    window.location.href = `mailto:feedback@ethiodate.com?subject=${subject}&body=${body}`;
    
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
      setName('');
      setEmail('');
      setFeedback('');
    }, 2500);
  };

  const bg = darkMode ? '#1e293b' : '#ffffff';
  const textPrimary = darkMode ? '#f8fafc' : '#0f172a';
  const textSecondary = darkMode ? '#94a3b8' : '#64748b';
  const border = darkMode ? '#334155' : '#e2e8f0';
  const inputBg = darkMode ? '#0f172a' : '#f8fafc';

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'absolute',
              bottom: 70,
              right: 0,
              width: 320,
              background: bg,
              borderRadius: 16,
              padding: 24,
              boxShadow: darkMode ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.1)',
              border: `1px solid ${border}`,
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✨</div>
                <h3 style={{ color: textPrimary, fontSize: 18, fontWeight: 700, margin: '0 0 8px 0' }}>
                  {lang === 'am' ? 'እናመሰግናለን!' : 'Thank you!'}
                </h3>
                <p style={{ color: textSecondary, fontSize: 14, margin: 0, lineHeight: 1.5 }}>
                  {lang === 'am' ? 'አስተያየትዎ ለወደፊት መሻሻል ይጠቅመናል።' : 'Your feedback will help us improve EthioDate.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ color: textPrimary, fontSize: 16, fontWeight: 700, margin: 0 }}>
                    {lang === 'am' ? 'አስተያየት ይላኩ' : 'Send Feedback'}
                  </h3>
                  <button type="button" onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: textSecondary, cursor: 'pointer', padding: 4 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'am' ? 'ስምዎ (አማራጭ)' : 'Your Name (Optional)'}
                  style={{
                    width: '100%', padding: 12, borderRadius: 12, border: `1px solid ${border}`, background: inputBg, color: textPrimary, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                    marginBottom: 12
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={lang === 'am' ? 'ኢሜይል (አማራጭ)' : 'Your Email (Optional)'}
                  style={{
                    width: '100%', padding: 12, borderRadius: 12, border: `1px solid ${border}`, background: inputBg, color: textPrimary, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                    marginBottom: 12
                  }}
                />
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={lang === 'am' ? 'ምን እንድናሻሽል ይፈልጋሉ?' : 'What would you like us to improve?'}
                  style={{
                    width: '100%', minHeight: 100, maxHeight: 250, padding: 12, borderRadius: 12, border: `1px solid ${border}`, background: inputBg, color: textPrimary, fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit',
                    marginBottom: 16
                  }}
                  required
                />
                <button type="submit" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: '#16a34a', color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}>
                  {lang === 'am' ? 'ላክ' : 'Send Feedback'}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 56, height: 56, borderRadius: 28, background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(22,163,74,0.4)',
        }}
        title={lang === 'am' ? 'አስተያየት ይላኩ' : 'Send Feedback'}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        )}
      </motion.button>
    </div>
  );
}
