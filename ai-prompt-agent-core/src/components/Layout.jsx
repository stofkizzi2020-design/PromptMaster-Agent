import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatInterface from './ChatInterface';
import PromptGenerator from './PromptGenerator';
import TemplatesPage from './TemplatesPage';
import SettingsPage from './SettingsPage';
import HelpPage from './HelpPage';
import PlaceholderPage from './PlaceholderPage';

export default function Layout() {
  const [activePage, setActivePage] = useState('chat');

  const renderPage = () => {
    switch (activePage) {
      case 'generator':
        return <PromptGenerator />;
      case 'templates':
        return <TemplatesPage onNavigate={setActivePage} />;
      case 'settings':
        return <SettingsPage />;
      case 'help':
        return <HelpPage />;
      case 'saved':
      case 'history':
        return <PlaceholderPage pageId={activePage} />;
      default:
        return null;
    }
  };

  const isChat = activePage === 'chat';

  return (
    <div className="h-screen w-full bg-[#f6f8fa] text-slate-900 dark:bg-slate-950 dark:text-gray-100">
      {/* Fixed sidebar */}
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      {/* Main area — offset by sidebar width */}
      <div className="ml-64 flex h-full flex-col">
        {/* Chat is always mounted, but hidden when not active — preserves state */}
        <main
          className={`flex-1 flex flex-col overflow-hidden ${isChat ? '' : 'hidden'}`}
        >
          <ChatInterface />
        </main>

        {/* Standard pages: scrollable with centered container */}
        {!isChat && (
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-5xl px-8 py-8">
              {renderPage()}
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
