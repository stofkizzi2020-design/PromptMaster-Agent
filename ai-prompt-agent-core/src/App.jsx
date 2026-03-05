import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatProvider } from './contexts/ChatContext';
import { I18nProvider } from './lib/i18n';

export default function App() {
  const [route, setRoute] = useState('landing');

  const navigate = (page) => {
    if (page === 'app') {
      setRoute('app');
    } else {
      setRoute(page);
    }
  };

  return (
    <I18nProvider>
      <ThemeProvider>
        <ChatProvider>
          <AnimatePresence mode="wait">
            {route === 'landing' && (
              <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <LandingPage onNavigate={navigate} />
              </motion.div>
            )}
            {route === 'login' && (
              <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <AuthPage mode="login" onNavigate={navigate} />
              </motion.div>
            )}
            {route === 'register' && (
              <motion.div key="register" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <AuthPage mode="register" onNavigate={navigate} />
              </motion.div>
            )}
            {route === 'app' && (
              <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="h-screen">
                <Layout />
              </motion.div>
            )}
          </AnimatePresence>
        </ChatProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
