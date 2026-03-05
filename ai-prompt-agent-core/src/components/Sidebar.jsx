import React, { useState } from 'react';
import {
  MessageSquare,
  FileText,
  Clock,
  Bookmark,
  Settings,
  HelpCircle,
  ChevronsUpDown,
  Plus,
  Search,
  Trash2,
  Sun,
  Moon,
} from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import { useI18n } from '../lib/i18n';
import { useTheme } from '../contexts/ThemeContext';
import GsatLogo from './GsatLogo';

/* ─── Nav item ─── */
function NavButton({ item, active, onNavigate }) {
  const Icon = item.icon;
  return (
    <button
      onClick={() => onNavigate(item.id)}
      className={`group flex w-full items-center gap-x-3 rounded-md px-3 py-[7px] text-[13px] font-medium transition-all duration-100 ${
        active
          ? 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-neon-blue'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
      }`}
    >
      <Icon
        className={`h-[18px] w-[18px] shrink-0 transition-colors duration-100 ${
          active
            ? 'text-slate-900 dark:text-neon-blue'
            : 'text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300'
        }`}
      />
      <span className="truncate">{item.label}</span>
    </button>
  );
}

/* ─── Sidebar ─── */
export default function Sidebar({ activePage, onNavigate }) {
  const { chats, activeChatId, switchChat, startNewChat, deleteChat } = useChat();
  const { t } = useI18n();
  const { resolvedTheme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const mainNav = [
    { id: 'chat', label: t('sidebar.chat'), icon: MessageSquare },
    { id: 'templates', label: t('sidebar.templates'), icon: FileText },
    { id: 'saved', label: t('sidebar.saved'), icon: Bookmark },
    { id: 'history', label: t('sidebar.history'), icon: Clock },
  ];

  const bottomNav = [
    { id: 'settings', label: t('sidebar.settings'), icon: Settings },
    { id: 'help', label: t('sidebar.help'), icon: HelpCircle },
  ];

  const handleNewChat = () => {
    startNewChat();
    onNavigate('chat');
  };

  const handleChatClick = (chatId) => {
    switchChat(chatId);
    onNavigate('chat');
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const savedChats = chats.filter((c) => c.messages.length > 0);
  const filteredChats = searchQuery
    ? savedChats.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : savedChats;

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-[#f6f8fa] border-slate-200 dark:border-slate-800 dark:bg-slate-950">
      {/* ─ Header: Brand + Theme toggle ─ */}
      <div className="flex h-14 shrink-0 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <GsatLogo className="h-7 w-7 text-slate-800 dark:text-neon-cyan" neon />
          <span className="text-[14px] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {t('sidebar.brand')}
          </span>
          <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-blue-700 dark:bg-neon-blue/10 dark:text-neon-blue">
            {t('sidebar.pro')}
          </span>
        </div>
        {/* Moon / Sun toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-neon-blue"
          aria-label="Toggle theme"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="h-[18px] w-[18px]" />
          ) : (
            <Moon className="h-[18px] w-[18px]" />
          )}
        </button>
      </div>

      {/* ─ New Chat ─ */}
      <div className="px-3 pt-3 pb-1">
        <button
          onClick={handleNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-[7px] text-[13px] font-medium text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-neon-blue/40 dark:hover:text-neon-blue"
        >
          <Plus className="h-4 w-4" />
          {t('sidebar.newChat')}
        </button>
      </div>

      {/* ─ Primary Navigation ─ */}
      <nav className="px-3 py-2">
        <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-600">
          {t('sidebar.main')}
        </p>
        <ul className="space-y-0.5">
          {mainNav.map((item) => (
            <li key={item.id}>
              <NavButton item={item} active={activePage === item.id} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      </nav>

      {/* ─ Recent Chats ─ */}
      <div className="flex-1 overflow-y-auto px-3 pt-1 pb-2 border-t border-slate-200 dark:border-slate-800">
        <p className="mb-1.5 px-3 pt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-600">
          {t('sidebar.recentChats')}
        </p>

        {savedChats.length > 3 && (
          <div className="relative mb-2 px-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('sidebar.searchChats')}
              className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-neon-blue dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:placeholder-slate-500"
            />
          </div>
        )}

        {filteredChats.length === 0 ? (
          <p className="px-3 py-4 text-center text-xs text-slate-400 dark:text-slate-600">
            {t('sidebar.noChats')}
          </p>
        ) : (
          <ul className="space-y-0.5">
            {filteredChats.map((chat) => (
              <li key={chat.id} className="group relative">
                <button
                  onClick={() => handleChatClick(chat.id)}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-[13px] transition-colors ${
                    activeChatId === chat.id && activePage === 'chat'
                      ? 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-neon-blue'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-600" />
                  <span className="truncate text-xs font-medium">{chat.title}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100 dark:text-slate-600 dark:hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ─ System nav ─ */}
      <div className="shrink-0 border-t border-slate-200 px-3 py-2 dark:border-slate-800">
        <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-600">
          {t('sidebar.system')}
        </p>
        <ul className="space-y-0.5">
          {bottomNav.map((item) => (
            <li key={item.id}>
              <NavButton item={item} active={activePage === item.id} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      </div>

      {/* ─ User Card ─ */}
      <div className="shrink-0 border-t border-slate-200 p-3 dark:border-slate-800">
        <button className="flex w-full items-center gap-x-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
          <img
            className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            src="https://ui-avatars.com/api/?name=John+Doe&background=1e293b&color=38bdf8&bold=true&size=64"
            alt="User avatar"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-slate-900 dark:text-slate-100">John Doe</p>
            <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">john@company.com</p>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-600" />
        </button>
      </div>
    </aside>
  );
}
