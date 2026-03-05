import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
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

/* ─── Nav item ─── */
function NavButton({ item, active, onNavigate }) {
  const Icon = item.icon;
  return (
    <button
      onClick={() => onNavigate(item.id)}
      className={`group flex w-full items-center gap-x-3 rounded-md px-3 py-[7px] text-[13px] font-medium transition-all duration-100 ${
        active
          ? 'bg-[#e8eaed] text-[#1f2328] dark:bg-[#2d333b] dark:text-[#e6edf3]'
          : 'text-[#656d76] hover:bg-[#f3f4f6] hover:text-[#1f2328] dark:text-[#7d8590] dark:hover:bg-[#2d333b] dark:hover:text-[#e6edf3]'
      }`}
    >
      <Icon
        className={`h-[18px] w-[18px] shrink-0 transition-colors duration-100 ${
          active
            ? 'text-[#1f2328] dark:text-[#e6edf3]'
            : 'text-[#656d76] group-hover:text-[#1f2328] dark:text-[#7d8590] dark:group-hover:text-[#e6edf3]'
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
    { id: 'generator', label: t('sidebar.promptStudio'), icon: Sparkles },
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
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-[#f6f8fa] border-[#d0d7de] dark:bg-[#161b22] dark:border-[#30363d]">
      {/* ─ Header: Brand + Theme toggle ─ */}
      <div className="flex h-14 shrink-0 items-center justify-between px-4 border-b border-[#d0d7de] dark:border-[#30363d]">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1f2328] dark:bg-white">
            <Sparkles className="h-3.5 w-3.5 text-white dark:text-[#1f2328]" />
          </div>
          <span className="text-[14px] font-semibold tracking-tight text-[#1f2328] dark:text-white">
            {t('sidebar.brand')}
          </span>
          <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
            {t('sidebar.pro')}
          </span>
        </div>
        {/* Moon / Sun toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-md text-[#656d76] transition-colors hover:bg-[#e8eaed] hover:text-[#1f2328] dark:text-[#7d8590] dark:hover:bg-[#2d333b] dark:hover:text-white"
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
          className="flex w-full items-center justify-center gap-2 rounded-md border border-[#d0d7de] bg-white px-4 py-[7px] text-[13px] font-medium text-[#1f2328] transition-all hover:bg-[#f3f4f6] dark:border-[#30363d] dark:bg-[#21262d] dark:text-[#e6edf3] dark:hover:bg-[#30363d] dark:hover:border-[#8b949e]"
        >
          <Plus className="h-4 w-4" />
          {t('sidebar.newChat')}
        </button>
      </div>

      {/* ─ Primary Navigation ─ */}
      <nav className="px-3 py-2">
        <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#656d76] dark:text-[#7d8590]">
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
      <div className="flex-1 overflow-y-auto px-3 pt-1 pb-2 border-t border-[#d0d7de] dark:border-[#30363d]">
        <p className="mb-1.5 px-3 pt-2 text-[11px] font-semibold uppercase tracking-wider text-[#656d76] dark:text-[#7d8590]">
          {t('sidebar.recentChats')}
        </p>

        {savedChats.length > 3 && (
          <div className="relative mb-2 px-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#656d76] dark:text-[#7d8590]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('sidebar.searchChats')}
              className="w-full rounded-md border border-[#d0d7de] bg-white py-1.5 pl-8 pr-3 text-xs text-[#1f2328] placeholder-[#656d76] focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-[#0d1117] dark:border-[#30363d] dark:text-[#e6edf3] dark:placeholder-[#7d8590]"
            />
          </div>
        )}

        {filteredChats.length === 0 ? (
          <p className="px-3 py-4 text-center text-xs text-[#656d76] dark:text-[#7d8590]">
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
                      ? 'bg-[#e8eaed] text-[#1f2328] dark:bg-[#2d333b] dark:text-[#e6edf3]'
                      : 'text-[#656d76] hover:bg-[#f3f4f6] hover:text-[#1f2328] dark:text-[#7d8590] dark:hover:bg-[#2d333b] dark:hover:text-[#e6edf3]'
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5 shrink-0 text-[#656d76] dark:text-[#7d8590]" />
                  <span className="truncate text-xs font-medium">{chat.title}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#656d76] opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100 dark:text-[#7d8590] dark:hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ─ System nav ─ */}
      <div className="shrink-0 border-t border-[#d0d7de] px-3 py-2 dark:border-[#30363d]">
        <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#656d76] dark:text-[#7d8590]">
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
      <div className="shrink-0 border-t border-[#d0d7de] p-3 dark:border-[#30363d]">
        <button className="flex w-full items-center gap-x-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-[#e8eaed] dark:hover:bg-[#2d333b]">
          <img
            className="h-7 w-7 rounded-full object-cover ring-1 ring-[#d0d7de] dark:ring-[#30363d]"
            src="https://ui-avatars.com/api/?name=John+Doe&background=1f2328&color=fff&bold=true&size=64"
            alt="User avatar"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-[#1f2328] dark:text-white">John Doe</p>
            <p className="truncate text-[11px] text-[#656d76] dark:text-[#7d8590]">john@company.com</p>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-[#656d76] dark:text-[#7d8590]" />
        </button>
      </div>
    </aside>
  );
}
