import React from 'react';
import { Search, Bell, Plus } from 'lucide-react';

const pageTitles = {
  dashboard: 'Dashboard',
  generator: 'Prompt Studio',
  templates: 'Templates',
  history: 'History',
  saved: 'Saved Prompts',
  favorites: 'Favorites',
  collections: 'Collections',
  settings: 'Settings',
  help: 'Help & Support',
};

export default function TopBar({ activePage, onNavigate }) {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-8">
      {/* Page Title */}
      <h1 className="text-lg font-semibold text-gray-900">
        {pageTitles[activePage] || 'Dashboard'}
      </h1>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search prompts…"
          className="h-9 w-64 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-600/10"
        />
      </div>

      {/* Notification */}
      <button className="relative rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
        <Bell className="h-5 w-5" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
      </button>

      {/* CTA */}
      <button
        onClick={() => onNavigate('generator')}
        className="inline-flex items-center gap-x-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:scale-[0.98]"
      >
        <Plus className="h-4 w-4" />
        Create New Prompt
      </button>
    </header>
  );
}
