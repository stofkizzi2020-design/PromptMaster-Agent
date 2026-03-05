import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Library,
  Shield,
  ArrowRight,
  Check,
  Star,
  ChevronRight,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const features = [
  {
    icon: Zap,
    title: 'Instant Generation',
    desc: 'Transform rough ideas into structured, expert-level prompts in under 2 seconds.',
    color: 'indigo',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Quality',
    desc: 'Built on prompt engineering best practices — role, context, tasks, constraints, and output format.',
    color: 'purple',
  },
  {
    icon: Library,
    title: 'Template Library',
    desc: 'Start from 50+ curated templates for development, marketing, writing, and more.',
    color: 'blue',
  },
  {
    icon: Shield,
    title: 'Privacy-First',
    desc: 'Everything runs in your browser. No data leaves your device — ever.',
    color: 'emerald',
  },
];

const colorMap = {
  indigo: 'bg-indigo-50 text-indigo-600',
  purple: 'bg-purple-50 text-purple-600',
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
};

const logos = ['Vercel', 'Supabase', 'Stripe', 'Linear', 'Raycast'];

export default function LandingPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const handleWaitlist = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setJoined(true);
      setTimeout(() => setJoined(false), 3000);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">PromptMaster</span>
          </div>
          <div className="hidden sm:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('login')}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-indigo-100 blur-3xl opacity-50" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-100 blur-3xl opacity-50" />

        <div className="relative mx-auto max-w-4xl px-6 pb-20 pt-24 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={fadeUp} custom={0} className="mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700">
                <Zap className="h-3 w-3" />
                Now in Public Beta
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Craft perfect prompts,{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                every time
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mx-auto mt-6 max-w-2xl text-lg text-slate-500"
            >
              The professional prompt engineering platform that transforms your
              ideas into structured, high-quality AI prompts — instantly.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('app')}
                className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-xl"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </button>

              <form onSubmit={handleWaitlist} className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-56 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-gray-50"
                >
                  {joined ? (
                    <span className="flex items-center gap-1 text-emerald-600">
                      <Check className="h-4 w-4" /> Joined!
                    </span>
                  ) : (
                    'Join Waitlist'
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Logos */}
      <section className="border-y border-gray-100 bg-gray-50/50 py-10">
        <div className="mx-auto max-w-4xl px-6">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
            Trusted by developers at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {logos.map((name) => (
              <span key={name} className="text-lg font-bold text-slate-300 select-none">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold tracking-tight">
              Everything you need to write better prompts
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-3 text-base text-slate-500 max-w-xl mx-auto">
              Professional prompt engineering tools, right in your browser.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  custom={i}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${colorMap[f.color]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section id="pricing" className="border-t border-gray-100 bg-gray-50 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold tracking-tight">
              Simple, transparent pricing
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-3 text-base text-slate-500">
              Start free. Upgrade when you're ready.
            </motion.p>

            <motion.div variants={fadeUp} custom={2} className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Free */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm">
                <p className="text-sm font-semibold text-slate-900">Free</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">$0<span className="text-sm font-normal text-slate-500">/mo</span></p>
                <ul className="mt-5 space-y-2.5 text-sm text-slate-600">
                  {['50 prompts/month', 'Basic templates', 'Local storage', 'Community support'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" /> {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onNavigate('app')}
                  className="mt-6 w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-gray-50"
                >
                  Get Started
                </button>
              </div>

              {/* Pro */}
              <div className="relative rounded-2xl border-2 border-indigo-500 bg-white p-6 text-left shadow-lg">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-[11px] font-bold text-white uppercase tracking-wide">
                  Popular
                </span>
                <p className="text-sm font-semibold text-slate-900">Pro</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">$12<span className="text-sm font-normal text-slate-500">/mo</span></p>
                <ul className="mt-5 space-y-2.5 text-sm text-slate-600">
                  {['Unlimited prompts', 'All templates', 'API key integration', 'Priority support', 'Export & sync'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-indigo-500" /> {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onNavigate('register')}
                  className="mt-6 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  Start Free Trial
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-700">PromptMaster</span>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} PromptMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
