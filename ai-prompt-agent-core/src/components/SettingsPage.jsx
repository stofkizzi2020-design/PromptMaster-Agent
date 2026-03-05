import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Key,
  Palette,
  Bell,
  Shield,
  Globe,
  Save,
  Check,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../lib/i18n';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('api');
  const [saved, setSaved] = useState(false);
  const { t } = useI18n();

  const tabs = [
    { id: 'api', label: t('settings.apiKeys'), icon: Key },
    { id: 'appearance', label: t('settings.appearance'), icon: Palette },
    { id: 'notifications', label: t('settings.notifications'), icon: Bell },
    { id: 'privacy', label: t('settings.privacy'), icon: Shield },
    { id: 'language', label: t('settings.language'), icon: Globe },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('settings.title')}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">{t('settings.subtitle')}</p>
      </div>

      <div className="flex gap-8">
        {/* Settings Nav */}
        <nav className="w-48 shrink-0">
          <ul className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                        : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-gray-500'}`} />
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Settings Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'api' && <APIKeysSettings />}
            {activeTab === 'appearance' && <AppearanceSettings />}
            {activeTab === 'notifications' && <NotificationsSettings />}
            {activeTab === 'privacy' && <PrivacySettings />}
            {activeTab === 'language' && <LanguageSettings />}
          </motion.div>

          {/* Save button */}
          <div className="mt-8 flex items-center gap-3 border-t border-gray-100 pt-6 dark:border-gray-700">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {saved ? t('settings.saved') : t('settings.save')}
            </button>
            <button className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
              {t('settings.cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Tab Panels ─── */

function APIKeysSettings() {
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [showOpenai, setShowOpenai] = useState(false);
  const [showAnthropic, setShowAnthropic] = useState(false);
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <SettingsCard title={t('api.title')} description={t('api.desc')}>
        <div className="space-y-4">
          <KeyInput
            label={t('api.openai')}
            value={openaiKey}
            onChange={setOpenaiKey}
            show={showOpenai}
            onToggle={() => setShowOpenai(!showOpenai)}
            placeholder="sk-..."
          />
          <KeyInput
            label={t('api.anthropic')}
            value={anthropicKey}
            onChange={setAnthropicKey}
            show={showAnthropic}
            onToggle={() => setShowAnthropic(!showAnthropic)}
            placeholder="sk-ant-..."
          />
        </div>
      </SettingsCard>

      <SettingsCard title={t('api.usage')} description={t('api.usageDesc')}>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: t('api.promptsGenerated'), value: '247', max: '1,000' },
            { label: t('api.apiCalls'), value: '89', max: '500' },
            { label: t('api.tokensUsed'), value: '32.4K', max: '100K' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-gray-100 p-4 dark:border-gray-700 dark:bg-gray-800/50">
              <p className="text-xs font-medium text-slate-500 dark:text-gray-400">{stat.label}</p>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{stat.value}</p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                <div className="h-full rounded-full bg-indigo-500" style={{ width: '35%' }} />
              </div>
              <p className="mt-1 text-[11px] text-slate-400 dark:text-gray-500">{t('api.of')} {stat.max}</p>
            </div>
          ))}
        </div>
      </SettingsCard>
    </div>
  );
}

function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();

  const themes = [
    { id: 'light', label: t('appearance.light'), icon: Sun },
    { id: 'dark', label: t('appearance.dark'), icon: Moon },
    { id: 'system', label: t('appearance.system'), icon: Monitor },
  ];

  return (
    <SettingsCard title={t('appearance.theme')} description={t('appearance.themeDesc')}>
      <div className="grid grid-cols-3 gap-3">
        {themes.map((thm) => {
          const Icon = thm.icon;
          const active = theme === thm.id;
          return (
            <button
              key={thm.id}
              onClick={() => setTheme(thm.id)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                active
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-400'
                  : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-gray-400'}`} />
              <span className={`text-sm font-medium ${active ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-gray-300'}`}>
                {thm.label}
              </span>
            </button>
          );
        })}
      </div>
    </SettingsCard>
  );
}

function NotificationsSettings() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [promptTips, setPromptTips] = useState(true);
  const [updates, setUpdates] = useState(false);
  const { t } = useI18n();

  return (
    <SettingsCard title={t('notif.title')} description={t('notif.desc')}>
      <div className="space-y-4">
        <ToggleRow label={t('notif.email')} desc={t('notif.emailDesc')} checked={emailNotifs} onChange={setEmailNotifs} />
        <ToggleRow label={t('notif.tips')} desc={t('notif.tipsDesc')} checked={promptTips} onChange={setPromptTips} />
        <ToggleRow label={t('notif.updates')} desc={t('notif.updatesDesc')} checked={updates} onChange={setUpdates} />
      </div>
    </SettingsCard>
  );
}

function PrivacySettings() {
  const [analytics, setAnalytics] = useState(true);
  const [storeHistory, setStoreHistory] = useState(true);
  const { t } = useI18n();

  return (
    <SettingsCard title={t('privacy.title')} description={t('privacy.desc')}>
      <div className="space-y-4">
        <ToggleRow label={t('privacy.analytics')} desc={t('privacy.analyticsDesc')} checked={analytics} onChange={setAnalytics} />
        <ToggleRow label={t('privacy.storeHistory')} desc={t('privacy.storeHistoryDesc')} checked={storeHistory} onChange={setStoreHistory} />
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
        <button className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors dark:text-red-400 dark:hover:text-red-300">
          {t('privacy.deleteAll')}
        </button>
      </div>
    </SettingsCard>
  );
}

function LanguageSettings() {
  const { locale, setLocale, t } = useI18n();

  return (
    <SettingsCard title={t('lang.title')} description={t('lang.desc')}>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      >
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>
    </SettingsCard>
  );
}

/* ─── Shared sub-components ─── */

function SettingsCard({ title, description, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">{description}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function KeyInput({ label, value, onChange, show, onToggle, placeholder }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-gray-300">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 pe-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, checked, onChange }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <div>
        <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
        <p className="text-xs text-slate-500 dark:text-gray-400">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-gray-600'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          } mt-0.5`}
        />
      </button>
    </label>
  );
}
