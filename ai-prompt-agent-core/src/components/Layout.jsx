import React, { useState } from 'react';
import Sidebar from './Sidebar';
import EmailChecker from './EmailChecker';
import SettingsPage from './SettingsPage';
import HelpPage from './HelpPage';

export default function Layout() {
  const [activePage, setActivePage] = useState('checker');

  const renderPage = () => {
    switch (activePage) {
      case 'checker':
        return <EmailChecker />;
      case 'settings':
        return <SettingsPage />;
      case 'help':
        return <HelpPage />;
      default:
        return <EmailChecker />;
    }
  };

  return (
    <div className="h-screen w-full bg-[#f6f8fa] text-slate-900 dark:bg-slate-950 dark:text-gray-100">
      {/* Fixed sidebar */}
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      {/* Main area — offset by sidebar width */}
      <div className="ml-64 flex h-full flex-col">
        <main className="flex-1 overflow-y-auto">{renderPage()}</main>
      </div>
    </div>
  );
}
