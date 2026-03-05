import React from 'react';
import {
  Sparkles,
  FileText,
  Activity,
  Star,
  Target,
  LayoutTemplate,
  Upload,
  Settings,
  ArrowUpRight,
  Lightbulb,
  Layers,
  Wand2,
  Pen,
  Code,
  Mail,
  Search as SearchIcon,
  TrendingUp,
} from 'lucide-react';

/* ── Data ── */

const stats = [
  { label: 'Total Prompts', value: '0', icon: FileText, change: '+12%', up: true },
  { label: 'This Week', value: '0', icon: Activity, change: '+8%', up: true },
  { label: 'Favorites', value: '0', icon: Star, change: '--', up: false },
  { label: 'Avg Quality', value: '85%', icon: Target, change: '+5%', up: true },
];

const quickActions = [
  {
    id: 'generate',
    label: 'Generate Prompt',
    description: 'Transform an idea into a structured prompt',
    icon: Sparkles,
    color: 'indigo',
  },
  {
    id: 'template',
    label: 'Browse Templates',
    description: 'Start from a proven template',
    icon: LayoutTemplate,
    color: 'emerald',
  },
  {
    id: 'optimize',
    label: 'Optimize Prompt',
    description: 'Improve an existing prompt',
    icon: Settings,
    color: 'amber',
  },
  {
    id: 'import',
    label: 'Import Prompt',
    description: 'Import from file or clipboard',
    icon: Upload,
    color: 'violet',
  },
];

const templates = [
  { id: 1, name: 'Blog Post Writer', category: 'Marketing', icon: Pen, color: 'indigo' },
  { id: 2, name: 'Code Reviewer', category: 'Development', icon: Code, color: 'emerald' },
  { id: 3, name: 'Email Composer', category: 'Business', icon: Mail, color: 'violet' },
  { id: 4, name: 'SEO Optimizer', category: 'Marketing', icon: SearchIcon, color: 'amber' },
];

const tips = [
  { icon: Lightbulb, title: 'Be Specific', text: 'Include context, constraints, and desired output format for better results.' },
  { icon: Layers, title: 'Use Structure', text: 'Break complex prompts into role, context, tasks, and constraints.' },
  { icon: Wand2, title: 'Iterate', text: 'Refine prompts based on outputs. Small changes yield big improvements.' },
];

const colorMap = {
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-600/10' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-600/10' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-600/10' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600', ring: 'ring-violet-600/10' },
};

/* ── Component ── */

export default function Dashboard({ onNavigate }) {
  return (
    <div className="space-y-10">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Good morning, John
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's an overview of your prompt engineering activity.
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-x-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-50 ring-1 ring-gray-900/5">
                  <Icon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className="mt-0.5 text-2xl font-semibold text-gray-900">{s.value}</p>
                </div>
              </div>
              {s.up && (
                <div className="absolute right-4 top-4 flex items-center gap-x-1 text-xs font-medium text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  {s.change}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Quick Actions ── */}
      <section>
        <h2 className="text-base font-semibold text-gray-900">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((a) => {
            const Icon = a.icon;
            const c = colorMap[a.color];
            return (
              <button
                key={a.id}
                onClick={() => {
                  if (a.id === 'generate') onNavigate('generator');
                  if (a.id === 'template') onNavigate('templates');
                }}
                className="group flex flex-col items-start gap-y-3 rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${c.bg} ring-1 ${c.ring}`}>
                  <Icon className={`h-5 w-5 ${c.text}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {a.label}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">{a.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Two-column: Recent + Templates ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Prompts */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-sm font-semibold text-gray-900">Recent Prompts</h2>
            <button
              onClick={() => onNavigate('history')}
              className="inline-flex items-center gap-x-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              View all
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
            <p className="mt-3 text-sm font-medium text-gray-900">No prompts yet</p>
            <p className="mt-1 text-xs text-gray-500">Create your first prompt to get started.</p>
            <button
              onClick={() => onNavigate('generator')}
              className="mt-4 inline-flex items-center gap-x-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Create Prompt
            </button>
          </div>
        </div>

        {/* Popular Templates */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-sm font-semibold text-gray-900">Popular Templates</h2>
            <button
              onClick={() => onNavigate('templates')}
              className="inline-flex items-center gap-x-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Browse all
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <ul className="divide-y divide-gray-100">
            {templates.map((t) => {
              const Icon = t.icon;
              const c = colorMap[t.color];
              return (
                <li key={t.id}>
                  <button className="flex w-full items-center gap-x-4 px-6 py-4 text-left transition-colors hover:bg-gray-50">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.bg}`}>
                      <Icon className={`h-4 w-4 ${c.text}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.category}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-gray-300" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ── Pro Tips ── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Pro Tips</h2>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {tips.map((tip) => {
            const Icon = tip.icon;
            return (
              <div key={tip.title} className="flex items-start gap-x-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                  <Icon className="h-4.5 w-4.5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{tip.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{tip.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
