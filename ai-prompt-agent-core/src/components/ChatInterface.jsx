import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Zap,
  ChevronDown,
  Lightbulb,
  Code,
  PenTool,
  BarChart3,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import { useI18n } from '../lib/i18n';

const TONES = ['Professional', 'Friendly', 'Formal', 'Casual', 'Persuasive', 'Technical'];
const CATEGORIES = ['Auto-detect', 'Development', 'Marketing', 'Creative Writing', 'Academic', 'Business', 'SEO'];

export default function ChatInterface() {
  const { activeChat, activeChatId, updateMessages, startNewChat } = useChat();
  const { t } = useI18n();

  const messages = activeChat?.messages || [];
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [tone, setTone] = useState('Professional');
  const [category, setCategory] = useState('Auto-detect');
  const [showToneMenu, setShowToneMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const toneRef = useRef(null);
  const categoryRef = useRef(null);

  const SUGGESTIONS = [
    { label: t('chat.writeBlog'), icon: PenTool, prompt: 'Write a compelling blog post about sustainable living tips for beginners' },
    { label: t('chat.codeFeature'), icon: Code, prompt: 'Build a React hook that handles infinite scroll with loading states' },
    { label: t('chat.marketingCopy'), icon: BarChart3, prompt: 'Create a landing page headline and subtext for an AI productivity tool' },
    { label: t('chat.businessPlan'), icon: Briefcase, prompt: 'Draft an executive summary for a B2B SaaS startup in the healthcare space' },
    { label: t('chat.researchSummary'), icon: GraduationCap, prompt: 'Summarize the latest research on transformer architecture improvements in NLP' },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close menus on outside click
  useEffect(() => {
    const handler = (e) => {
      if (toneRef.current && !toneRef.current.contains(e.target)) setShowToneMenu(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setShowCategoryMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Ensure there's always an active chat
  useEffect(() => {
    if (!activeChatId) {
      startNewChat();
    }
  }, [activeChatId, startNewChat]);

  const generatePrompt = useCallback(async (userInput) => {
    if (!userInput.trim() || isGenerating) return;

    const userMsg = { id: Date.now(), role: 'user', content: userInput };
    updateMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsGenerating(true);

    // Simulate AI prompt generation
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    const detectedCategory = category === 'Auto-detect' ? detectCategory(userInput) : category;
    const enhanced = buildEnhancedPrompt(userInput, detectedCategory, tone);

    const aiMsg = {
      id: Date.now() + 1,
      role: 'assistant',
      content: enhanced,
      meta: {
        category: detectedCategory,
        tone,
        quality: calculateQuality(enhanced),
        tokens: Math.ceil(enhanced.length / 4),
      },
    };

    updateMessages((prev) => [...prev, aiMsg]);
    setIsGenerating(false);
  }, [isGenerating, tone, category, updateMessages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    generatePrompt(input);
  };

  const handleSuggestion = (prompt) => {
    setInput(prompt);
    generatePrompt(prompt);
  };

  const copyToClipboard = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const regenerate = (userContent) => {
    generatePrompt(userContent);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full flex-col bg-gray-50 dark:bg-gray-950">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          /* Empty State — Hero */
          <div className="flex h-full flex-col items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-2xl"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t('chat.title')}
              </h1>
              <p className="mt-3 text-base text-slate-500 dark:text-gray-400 max-w-lg mx-auto">
                {t('chat.subtitle')}
              </p>

              {/* Suggestion Chips */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {SUGGESTIONS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <motion.button
                      key={s.label}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSuggestion(s.prompt)}
                      className="group flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-indigo-700"
                    >
                      <Icon className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors dark:text-gray-500 dark:group-hover:text-indigo-400" />
                      {s.label}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        ) : (
          /* Message Thread */
          <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {msg.role === 'user' ? (
                    <UserMessage content={msg.content} />
                  ) : (
                    <AssistantMessage
                      msg={msg}
                      onCopy={copyToClipboard}
                      onRegenerate={regenerate}
                      copiedId={copiedId}
                      messages={messages}
                      t={t}
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="rounded-2xl bg-white border border-gray-100 px-5 py-4 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input Area — always pinned to bottom */}
      <div className="shrink-0 border-t border-gray-100 bg-white/80 backdrop-blur-xl px-4 pb-4 pt-3 dark:border-gray-800 dark:bg-gray-900/80">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="relative rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow focus-within:shadow-lg focus-within:border-indigo-300 dark:border-gray-700 dark:bg-gray-800 dark:focus-within:border-indigo-600">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              rows={1}
              placeholder={t('chat.placeholder')}
              className="block w-full resize-none rounded-2xl bg-transparent py-4 ps-5 pe-14 text-sm text-slate-900 placeholder-slate-400 focus:outline-none dark:text-white dark:placeholder-gray-500"
              style={{ maxHeight: '160px', minHeight: '52px' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isGenerating}
              className="absolute bottom-3 end-3 flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          {/* Controls row */}
          <div className="mt-2.5 flex items-center gap-2">
            {/* Tone selector */}
            <div className="relative" ref={toneRef}>
              <button
                type="button"
                onClick={() => { setShowToneMenu(!showToneMenu); setShowCategoryMenu(false); }}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Zap className="h-3.5 w-3.5 text-slate-400 dark:text-gray-500" />
                {tone}
                <ChevronDown className="h-3 w-3 text-slate-400 dark:text-gray-500" />
              </button>
              <AnimatePresence>
                {showToneMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute bottom-full start-0 mb-1 w-40 rounded-xl border border-gray-200 bg-white py-1 shadow-lg z-50 dark:border-gray-700 dark:bg-gray-800"
                  >
                    {TONES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => { setTone(t); setShowToneMenu(false); }}
                        className={`block w-full px-3 py-1.5 text-start text-xs font-medium transition-colors ${
                          tone === t ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Category selector */}
            <div className="relative" ref={categoryRef}>
              <button
                type="button"
                onClick={() => { setShowCategoryMenu(!showCategoryMenu); setShowToneMenu(false); }}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Lightbulb className="h-3.5 w-3.5 text-slate-400 dark:text-gray-500" />
                {category}
                <ChevronDown className="h-3 w-3 text-slate-400 dark:text-gray-500" />
              </button>
              <AnimatePresence>
                {showCategoryMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute bottom-full start-0 mb-1 w-44 rounded-xl border border-gray-200 bg-white py-1 shadow-lg z-50 dark:border-gray-700 dark:bg-gray-800"
                  >
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => { setCategory(c); setShowCategoryMenu(false); }}
                        className={`block w-full px-3 py-1.5 text-start text-xs font-medium transition-colors ${
                          category === c ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <span className="ms-auto text-[11px] text-slate-400 dark:text-gray-500">
              {t('chat.shiftEnter')}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function UserMessage({ content }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-indigo-600 px-5 py-3 text-sm leading-relaxed text-white shadow-sm dark:bg-indigo-500">
        {content}
      </div>
    </div>
  );
}

function AssistantMessage({ msg, onCopy, onRegenerate, copiedId, messages, t }) {
  const isCopied = copiedId === msg.id;

  // Find the previous user message for regeneration
  const prevUser = messages
    .slice(0, messages.indexOf(msg))
    .reverse()
    .find((m) => m.role === 'user');

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm">
        <Sparkles className="h-4 w-4 text-white" />
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        {/* Prompt output card */}
        <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800 font-sans dark:text-gray-200">
            {msg.content}
          </pre>
        </div>

        {/* Meta + Actions */}
        <div className="flex items-center gap-4">
          {msg.meta && (
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                {msg.meta.category}
              </span>
              <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-gray-700 dark:text-gray-400">
                {msg.meta.tone}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-gray-500">
                {t('chat.quality')}: {msg.meta.quality}% · ~{msg.meta.tokens} {t('chat.tokens')}
              </span>
            </div>
          )}

          <div className="ms-auto flex items-center gap-1">
            <button
              onClick={() => onCopy(msg.content, msg.id)}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-gray-100 hover:text-slate-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            >
              {isCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">{t('chat.copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  {t('chat.copy')}
                </>
              )}
            </button>
            {prevUser && (
              <button
                onClick={() => onRegenerate(prevUser.content)}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-gray-100 hover:text-slate-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {t('chat.regenerate')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Prompt-building helpers ─── */

function detectCategory(text) {
  const t = text.toLowerCase();
  if (/code|api|function|react|python|javascript|sql|database|bug|deploy|hook/.test(t)) return 'Development';
  if (/marketing|ad|campaign|brand|sales|social media|seo|landing page|headline/.test(t)) return 'Marketing';
  if (/story|poem|novel|creative|screenplay|fiction|blog/.test(t)) return 'Creative Writing';
  if (/research|study|analysis|academic|scientific|paper|summarize/.test(t)) return 'Academic';
  if (/business|strategy|company|project|budget|plan|report|executive/.test(t)) return 'Business';
  return 'General';
}

function buildEnhancedPrompt(idea, category, tone) {
  const roleMap = {
    Development: 'You are a senior software engineer with 10+ years of experience building scalable, production-grade applications.',
    Marketing: 'You are an expert digital marketing strategist and copywriter with a proven track record.',
    'Creative Writing': 'You are a talented creative writer skilled in multiple genres with deep understanding of narrative structure.',
    Academic: 'You are an academic research specialist with expertise in structured analysis and evidence-based reasoning.',
    Business: 'You are a senior business consultant with expertise in strategic planning and executive communication.',
    General: 'You are a highly skilled AI assistant with deep expertise in the requested domain.',
  };

  const role = roleMap[category] || roleMap.General;
  const context = `The user needs help with: "${idea}". This is a ${category.toLowerCase()} task.`;
  const tasks = [
    `1. Analyze the request carefully: "${idea}"`,
    '2. Break the task into clear, actionable steps',
    '3. Provide detailed, expert-level content',
    '4. Include relevant examples where helpful',
    '5. Review for accuracy and completeness',
  ].join('\n');
  const constraints = `Maintain a ${tone.toLowerCase()} tone. Be concise yet thorough. Avoid filler. Structure for readability.`;

  return `**Role:** ${role}\n\n**Context:** ${context}\n\n**Tasks:**\n${tasks}\n\n**Constraints:** ${constraints}\n\n**Output Format:** Present in clear, well-organized sections.`;
}

function calculateQuality(prompt) {
  let score = 40;
  if (prompt.includes('**Role:**')) score += 12;
  if (prompt.includes('**Context:**')) score += 12;
  if (prompt.includes('**Tasks:**')) score += 12;
  if (prompt.includes('**Constraints:**')) score += 12;
  if (prompt.includes('**Output Format:**')) score += 12;
  return Math.min(100, score);
}
