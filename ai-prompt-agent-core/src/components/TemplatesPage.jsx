import React, { useState } from 'react';
import {
  FileText,
  Search,
  Star,
  Copy,
  ArrowUpRight,
  Sparkles,
  Code,
  PenTool,
  BarChart3,
  Briefcase,
  GraduationCap,
  Globe,
  Filter,
} from 'lucide-react';

const templateData = [
  {
    id: 1,
    title: 'Blog Post Writer',
    description: 'Generate engaging, SEO-optimized blog posts on any topic.',
    category: 'Marketing',
    icon: PenTool,
    color: 'indigo',
    uses: 1240,
    featured: true,
    prompt: 'Write a comprehensive blog post about [TOPIC] with an attention-grabbing introduction, clear subheadings, and a compelling conclusion.',
  },
  {
    id: 2,
    title: 'Code Review Assistant',
    description: 'Thorough code reviews with actionable improvement suggestions.',
    category: 'Development',
    icon: Code,
    color: 'emerald',
    uses: 980,
    featured: true,
    prompt: 'Review the following code for best practices, potential bugs, performance issues, and security vulnerabilities.',
  },
  {
    id: 3,
    title: 'Marketing Copy Generator',
    description: 'Persuasive copy for campaigns, ads, and landing pages.',
    category: 'Marketing',
    icon: Sparkles,
    color: 'violet',
    uses: 870,
    featured: true,
    prompt: 'Write compelling marketing copy for [PRODUCT/SERVICE]. Include a strong headline, key benefits, and clear CTA.',
  },
  {
    id: 4,
    title: 'Data Analysis Report',
    description: 'Structured reports from data with insights and recommendations.',
    category: 'Business',
    icon: BarChart3,
    color: 'amber',
    uses: 650,
    prompt: 'Analyze the following data and generate a professional report with executive summary and key findings.',
  },
  {
    id: 5,
    title: 'Business Plan Outline',
    description: 'Comprehensive business plan outlines for any industry.',
    category: 'Business',
    icon: Briefcase,
    color: 'rose',
    uses: 520,
    prompt: 'Create a detailed business plan outline including market analysis, revenue model, and marketing strategy.',
  },
  {
    id: 6,
    title: 'Research Paper Summary',
    description: 'Summarize academic papers with key findings and methodology.',
    category: 'Academic',
    icon: GraduationCap,
    color: 'sky',
    uses: 490,
    prompt: 'Summarize the following research paper. Include the research question, methodology, and key findings.',
  },
  {
    id: 7,
    title: 'SEO Content Strategy',
    description: 'Keyword-targeted content strategies with topic clusters.',
    category: 'SEO',
    icon: Globe,
    color: 'teal',
    uses: 430,
    prompt: 'Create an SEO content strategy including keyword research, content pillars, and a 3-month calendar.',
  },
  {
    id: 8,
    title: 'API Documentation',
    description: 'Developer-friendly API documentation from endpoints.',
    category: 'Development',
    icon: Code,
    color: 'emerald',
    uses: 380,
    prompt: 'Write API documentation with request/response examples, authentication details, and error codes.',
  },
];

const categories = ['All', 'Marketing', 'Development', 'Business', 'Academic', 'SEO'];

const colorMap = {
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-600' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-600' },
};

export default function TemplatesPage({ onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = templateData.filter((t) => {
    const matchSearch =
      !searchTerm ||
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = activeCategory === 'All' || t.category === activeCategory;
    return matchSearch && matchCat;
  });

  const copyTemplate = (prompt) => navigator.clipboard.writeText(prompt);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Templates</h1>
        <p className="mt-1 text-sm text-gray-500">Ready-to-use prompt templates for every use case.</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search templates…"
            className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-600/10"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
          <Filter className="h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-900">No templates found</p>
          <p className="mt-1 text-xs text-gray-500">Try a different search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => {
            const Icon = t.icon;
            const c = colorMap[t.color] || colorMap.indigo;
            return (
              <div
                key={t.id}
                className="group relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
              >
                {t.featured && (
                  <div className="absolute right-3 top-3">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  </div>
                )}
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${c.bg}`}>
                  <Icon className={`h-5 w-5 ${c.text}`} />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {t.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-gray-500 line-clamp-2">
                  {t.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                    {t.category}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => copyTemplate(t.prompt)}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                      title="Copy prompt"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onNavigate && onNavigate('generator')}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                      title="Use template"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
