import React from 'react';
import {
  MailCheck,
  ListChecks,
  Settings,
  HelpCircle,
  ChevronsUpDown,
} from 'lucide-react';
import { useI18n } from '../lib/i18n';
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
  const { t } = useI18n();

  const mainNav = [
    { id: 'checker', label: 'Email Checker', icon: MailCheck },
    { id: 'help', label: 'Validation Guide', icon: ListChecks },
  ];

  const bottomNav = [
    { id: 'settings', label: t('sidebar.settings'), icon: Settings },
    { id: 'help', label: t('sidebar.help'), icon: HelpCircle },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white">
      {/* ─ Header: Brand ─ */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-4">
        <div className="flex items-center gap-2">
          <GsatLogo className="h-7 w-7 text-slate-800" neon />
          <span className="text-[14px] font-semibold tracking-tight text-slate-900">
            MailVerifier
          </span>
          <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-blue-700">
            {t('sidebar.pro')}
          </span>
        </div>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
          Light
        </span>
      </div>

      {/* ─ Primary Navigation ─ */}
      <nav className="px-3 py-2">
        <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-600">
          Main
        </p>
        <ul className="space-y-0.5">
          {mainNav.map((item) => (
            <li key={item.id}>
              <NavButton item={item} active={activePage === item.id} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex-1 overflow-y-auto border-t border-slate-200 px-4 py-4 dark:border-slate-800">
        <div className="rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          Verify deliverability before sending campaigns. Use bulk mode for lead lists and copy only valid emails.
        </div>
      </div>

      {/* ─ System nav ─ */}
      <div className="shrink-0 border-t border-slate-200 px-3 py-2 dark:border-slate-800">
        <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-600">
          System
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
