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

  useEffect(() => {
    const handler = (e) => {
      if (toneRef.current && !toneRef.current.contains(e.target)) setShowToneMenu(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setShowCategoryMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
    <div className="flex h-full flex-col bg-white dark:bg-[#0d1117]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          /* ── Empty state ── */
          <div className="flex h-full flex-col items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-2xl"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#1f2328] dark:bg-white">
                <Sparkles className="h-7 w-7 text-white dark:text-[#1f2328]" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#1f2328] dark:text-white">
                {t('chat.title')}
              </h1>
              <p className="mt-2 text-[14px] text-[#656d76] dark:text-[#7d8590] max-w-md mx-auto leading-relaxed">
                {t('chat.subtitle')}
              </p>

              {/* Suggestion chips */}
              <div className="mt-8 flex flex-wrap justify-center gap-2.5">
                {SUGGESTIONS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <motion.button
                      key={s.label}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSuggestion(s.prompt)}
                      className="group flex items-center gap-2 rounded-lg border border-[#d0d7de] bg-white px-3.5 py-2 text-[13px] font-medium text-[#1f2328] transition-all hover:border-[#0969da] hover:text-[#0969da] dark:border-[#30363d] dark:bg-[#161b22] dark:text-[#e6edf3] dark:hover:border-[#2f81f7] dark:hover:text-[#2f81f7]"
                    >
                      <Icon className="h-4 w-4 text-[#656d76] group-hover:text-[#0969da] transition-colors dark:text-[#7d8590] dark:group-hover:text-[#2f81f7]" />
                      {s.label}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        ) : (
          /* ── Message thread ── */
          <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
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
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1f2328] dark:bg-white">
                  <Sparkles className="h-3.5 w-3.5 text-white dark:text-[#1f2328]" />
                </div>
                <div className="pt-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#656d76] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-[#656d76] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-[#656d76] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* ── Input area ── */}
      <div className="shrink-0 border-t border-[#d0d7de] bg-[#f6f8fa] px-4 pb-4 pt-3 dark:border-[#30363d] dark:bg-[#161b22]">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="relative rounded-lg border border-[#d0d7de] bg-white shadow-sm transition-shadow focus-within:shadow-md focus-within:border-[#0969da] dark:border-[#30363d] dark:bg-[#0d1117] dark:focus-within:border-[#2f81f7]">
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
              className="block w-full resize-none rounded-lg bg-transparent py-3 pl-4 pr-12 text-[14px] text-[#1f2328] placeholder-[#656d76] focus:outline-none dark:text-[#e6edf3] dark:placeholder-[#7d8590]"
              style={{ maxHeight: '160px', minHeight: '44px' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isGenerating}
              className="absolute bottom-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-md bg-[#1f2328] text-white transition-all hover:bg-[#32383f] disabled:opacity-30 disabled:cursor-not-allowed dark:bg-white dark:text-[#1f2328] dark:hover:bg-[#d0d7de]"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Controls */}
          <div className="mt-2 flex items-center gap-2">
            <div className="relative" ref={toneRef}>
              <button
                type="button"
                onClick={() => { setShowToneMenu(!showToneMenu); setShowCategoryMenu(false); }}
                className="flex items-center gap-1.5 rounded-md border border-[#d0d7de] bg-white px-2.5 py-1 text-xs font-medium text-[#656d76] transition-colors hover:bg-[#f3f4f6] hover:text-[#1f2328] dark:border-[#30363d] dark:bg-[#21262d] dark:text-[#7d8590] dark:hover:bg-[#30363d] dark:hover:text-[#e6edf3]"
              >
                <Zap className="h-3 w-3" />
                {tone}
                <ChevronDown className="h-3 w-3" />
              </button>
              <AnimatePresence>
                {showToneMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute bottom-full left-0 mb-1 w-40 rounded-lg border border-[#d0d7de] bg-white py-1 shadow-lg z-50 dark:border-[#30363d] dark:bg-[#161b22]"
                  >
                    {TONES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => { setTone(t); setShowToneMenu(false); }}
                        className={`block w-full px-3 py-1.5 text-left text-xs font-medium transition-colors ${
                          tone === t
                            ? 'bg-[#ddf4ff] text-[#0969da] dark:bg-[#0d2d4a] dark:text-[#2f81f7]'
                            : 'text-[#1f2328] hover:bg-[#f3f4f6] dark:text-[#e6edf3] dark:hover:bg-[#2d333b]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative" ref={categoryRef}>
              <button
                type="button"
                onClick={() => { setShowCategoryMenu(!showCategoryMenu); setShowToneMenu(false); }}
                className="flex items-center gap-1.5 rounded-md border border-[#d0d7de] bg-white px-2.5 py-1 text-xs font-medium text-[#656d76] transition-colors hover:bg-[#f3f4f6] hover:text-[#1f2328] dark:border-[#30363d] dark:bg-[#21262d] dark:text-[#7d8590] dark:hover:bg-[#30363d] dark:hover:text-[#e6edf3]"
              >
                <Lightbulb className="h-3 w-3" />
                {category}
                <ChevronDown className="h-3 w-3" />
              </button>
              <AnimatePresence>
                {showCategoryMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute bottom-full left-0 mb-1 w-44 rounded-lg border border-[#d0d7de] bg-white py-1 shadow-lg z-50 dark:border-[#30363d] dark:bg-[#161b22]"
                  >
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => { setCategory(c); setShowCategoryMenu(false); }}
                        className={`block w-full px-3 py-1.5 text-left text-xs font-medium transition-colors ${
                          category === c
                            ? 'bg-[#ddf4ff] text-[#0969da] dark:bg-[#0d2d4a] dark:text-[#2f81f7]'
                            : 'text-[#1f2328] hover:bg-[#f3f4f6] dark:text-[#e6edf3] dark:hover:bg-[#2d333b]'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <span className="ml-auto text-[11px] text-[#656d76] dark:text-[#7d8590]">
              {t('chat.shiftEnter')}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Sub-components (Copilot-style: both left-aligned with avatars) ─── */

function UserMessage({ content }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1f2328] text-[11px] font-bold text-white dark:bg-[#e6edf3] dark:text-[#1f2328]">
        JD
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="mb-1 text-[13px] font-semibold text-[#1f2328] dark:text-white">You</p>
        <div className="text-[14px] leading-relaxed text-[#1f2328] dark:text-[#e6edf3]">
          {content}
        </div>
      </div>
    </div>
  );
}

function AssistantMessage({ msg, onCopy, onRegenerate, copiedId, messages, t }) {
  const isCopied = copiedId === msg.id;

  const prevUser = messages
    .slice(0, messages.indexOf(msg))
    .reverse()
    .find((m) => m.role === 'user');

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1f2328] dark:bg-white">
        <Sparkles className="h-3.5 w-3.5 text-white dark:text-[#1f2328]" />
      </div>
      <div className="min-w-0 flex-1 space-y-2 pt-0.5">
        <p className="mb-1 text-[13px] font-semibold text-[#1f2328] dark:text-white">PromptMaster</p>

        {/* Output card */}
        <div className="rounded-lg border border-[#d0d7de] bg-[#f6f8fa] px-4 py-3 dark:border-[#30363d] dark:bg-[#161b22]">
          <pre className="whitespace-pre-wrap text-[14px] leading-relaxed text-[#1f2328] font-sans dark:text-[#e6edf3]">
            {msg.content}
          </pre>
        </div>

        {/* Meta + actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {msg.meta && (
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#ddf4ff] px-2 py-0.5 text-[11px] font-semibold text-[#0969da] dark:bg-[#0d2d4a] dark:text-[#2f81f7]">
                {msg.meta.category}
              </span>
              <span className="rounded-full bg-[#f6f8fa] px-2 py-0.5 text-[11px] font-medium text-[#656d76] border border-[#d0d7de] dark:bg-[#21262d] dark:text-[#7d8590] dark:border-[#30363d]">
                {msg.meta.tone}
              </span>
              <span className="text-[11px] text-[#656d76] dark:text-[#7d8590]">
                {t('chat.quality')}: {msg.meta.quality}% · ~{msg.meta.tokens} {t('chat.tokens')}
              </span>
            </div>
          )}

          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => onCopy(msg.content, msg.id)}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[#656d76] transition-colors hover:bg-[#f3f4f6] hover:text-[#1f2328] dark:text-[#7d8590] dark:hover:bg-[#2d333b] dark:hover:text-[#e6edf3]"
            >
              {isCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#1a7f37] dark:text-[#3fb950]" />
                  <span className="text-[#1a7f37] dark:text-[#3fb950]">{t('chat.copied')}</span>
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
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[#656d76] transition-colors hover:bg-[#f3f4f6] hover:text-[#1f2328] dark:text-[#7d8590] dark:hover:bg-[#2d333b] dark:hover:text-[#e6edf3]"
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
