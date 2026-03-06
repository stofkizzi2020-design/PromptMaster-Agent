import React from 'react';
import Layout from './components/Layout';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatProvider } from './contexts/ChatContext';
import { I18nProvider } from './lib/i18n';

export default function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <ChatProvider>
          <Layout />
        </ChatProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
