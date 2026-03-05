import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Search,
  Mail,
  Sparkles,
  Zap,
  Shield,
  Code,
  FileText,
  Settings,
} from 'lucide-react';

const faqs = [
  {
    q: 'How does PromptMaster improve my prompts?',
    a: 'PromptMaster uses structured prompt engineering techniques to transform your ideas into well-formatted prompts. It adds role definitions, context, task breakdowns, constraints, and output format specifications — the core building blocks of high-quality AI prompts.',
  },
  {
    q: 'Does it work with ChatGPT, Claude, and other models?',
    a: 'Yes! The prompts generated are model-agnostic and work with any large language model including GPT-4, Claude, Gemini, and open-source models like Llama.',
  },
  {
    q: 'Is my data stored or shared?',
    a: 'No. All prompt generation happens locally in your browser. We do not send your data to any external server. Your prompts and API keys remain on your device.',
  },
  {
    q: 'Can I connect my own API keys?',
    a: 'Yes! Go to Settings → API Keys to connect your OpenAI or Anthropic keys for direct model integration and enhanced generation capabilities.',
  },
  {
    q: 'How do I use templates?',
    a: 'Navigate to the Templates section in the sidebar. You can browse by category, copy any template to use as-is, or click "Use Template" to start with it in the Prompt Studio.',
  },
];

const guides = [
  { title: 'Getting Started', desc: 'Learn the basics of prompt engineering', icon: Sparkles },
  { title: 'Advanced Techniques', desc: 'Chain-of-thought, few-shot, and more', icon: Zap },
  { title: 'API Integration', desc: 'Connect your AI provider keys', icon: Code },
  { title: 'Templates Guide', desc: 'Create and manage custom templates', icon: FileText },
  { title: 'Privacy & Security', desc: 'How we handle your data', icon: Shield },
  { title: 'Configuration', desc: 'Customize your workspace', icon: Settings },
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const filteredFaqs = faqs.filter(
    (f) =>
      !searchTerm ||
      f.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">
          <BookOpen className="h-7 w-7 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Help & Support</h1>
        <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
          Find answers, learn techniques, and get the most out of PromptMaster.
        </p>

        {/* Search */}
        <div className="relative mt-6 max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search help articles..."
            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Quick-start Guides */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Quick-start Guides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guides.map((g) => {
            const Icon = g.icon;
            return (
              <motion.button
                key={g.title}
                whileHover={{ y: -2 }}
                className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                  <Icon className="h-4.5 w-4.5 text-indigo-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{g.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{g.desc}</p>
                </div>
                <ChevronRight className="ml-auto mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {filteredFaqs.map((faq, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-sm font-medium text-slate-900">{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                    openFaq === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-gray-100 px-5 py-4"
                >
                  <p className="text-sm leading-relaxed text-slate-600">{faq.a}</p>
                </motion.div>
              )}
            </div>
          ))}
          {filteredFaqs.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">No results found for "{searchTerm}"</p>
          )}
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
            <MessageCircle className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-900">Still need help?</h3>
            <p className="mt-1 text-sm text-slate-500">
              Can't find what you're looking for? Reach out to our support team.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="mailto:support@promptmaster.ai"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                <Mail className="h-4 w-4" />
                Email Support
              </a>
              <a
                href="#"
                className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-gray-50"
              >
                <ExternalLink className="h-4 w-4" />
                Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
