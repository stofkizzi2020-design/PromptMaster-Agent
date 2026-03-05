import React, { useState, useCallback } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Download,
  ChevronDown,
  X,
  FileText,
  Code,
  AlignLeft,
  Zap,
  ArrowRight,
} from 'lucide-react';

export default function PromptGenerator() {
  const [idea, setIdea] = useState('');
  const [category, setCategory] = useState('auto');
  const [tone, setTone] = useState('professional');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showExport, setShowExport] = useState(false);

  /* ── Generate ── */
  const generate = useCallback(() => {
    if (!idea.trim()) return;

    const detectedCat = category === 'auto' ? detectCategory(idea) : category;
    const role = buildRole(detectedCat, tone);
    const ctx = buildContext(idea, detectedCat);
    const tasks = buildTasks(idea);
    const cons = buildConstraints(tone);
    const outFmt = buildOutputFormat();

    const fullPrompt = [
      `**Role:** ${role}`,
      '',
      `**Context:** ${ctx}`,
      '',
      `**Tasks:**\n${tasks}`,
      '',
      `**Constraints:** ${cons}`,
      '',
      `**Output Format:** ${outFmt}`,
    ].join('\n');

    const quality = calculateQuality(fullPrompt);

    setResult({
      fullPrompt,
      quality,
      category: detectedCat,
      wordCount: fullPrompt.split(/\s+/).length,
      tokens: Math.ceil(fullPrompt.length / 4),
    });
  }, [idea, category, tone]);

  /* ── Copy ── */
  const copyPrompt = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── Clear ── */
  const clear = () => {
    setIdea('');
    setResult(null);
  };

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Prompt Studio</h1>
        <p className="mt-1 text-sm text-gray-500">
          Describe your idea and we'll craft a professional, structured prompt.
        </p>
      </div>

      {/* ── Input Card ── */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Textarea */}
        <div className="p-6 pb-0">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            rows={5}
            placeholder="Describe what you want the AI to do…&#10;&#10;e.g. Write a comprehensive blog post about sustainable living for beginners, including actionable tips and a compelling introduction."
            className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-[15px] leading-relaxed text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-indigo-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(99,102,241,0.08)]"
          />
        </div>

        {/* Options Row */}
        <div className="flex flex-wrap items-center gap-3 px-6 py-4">
          {/* Category */}
          <InlineSelect
            label="Category"
            value={category}
            onChange={setCategory}
            options={[
              { value: 'auto', label: 'Auto-detect' },
              { value: 'coding', label: 'Development' },
              { value: 'marketing', label: 'Marketing' },
              { value: 'creative', label: 'Creative Writing' },
              { value: 'academic', label: 'Academic' },
              { value: 'business', label: 'Business' },
              { value: 'seo', label: 'SEO' },
            ]}
          />

          {/* Tone */}
          <InlineSelect
            label="Tone"
            value={tone}
            onChange={setTone}
            options={[
              { value: 'professional', label: 'Professional' },
              { value: 'friendly', label: 'Friendly' },
              { value: 'formal', label: 'Formal' },
              { value: 'casual', label: 'Casual' },
              { value: 'persuasive', label: 'Persuasive' },
              { value: 'technical', label: 'Technical' },
            ]}
          />

          {/* Spacer */}
          <div className="flex-1" />

          {/* Character count */}
          <span className="text-xs text-gray-400">{idea.length} chars</span>

          {/* Generate */}
          <button
            onClick={generate}
            disabled={!idea.trim()}
            className="inline-flex items-center gap-x-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Sparkles className="h-4 w-4" />
            Generate
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Output Card ── */}
      {result && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Card header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div className="flex items-center gap-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                <Zap className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Improved Prompt</h2>
                <p className="text-xs text-gray-500">
                  {result.wordCount} words · ~{result.tokens} tokens · Quality {result.quality}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              <button
                onClick={copyPrompt}
                className={`inline-flex items-center gap-x-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium shadow-sm transition-all ${
                  copied
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={generate}
                className="inline-flex items-center gap-x-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Regenerate
              </button>
              <button
                onClick={() => setShowExport(true)}
                className="inline-flex items-center gap-x-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50"
              >
                <Download className="h-3.5 w-3.5" />
                Export
              </button>
            </div>
          </div>

          {/* Quality bar */}
          <div className="px-6 pt-5">
            <div className="flex items-center gap-x-3">
              <span className="text-xs font-medium text-gray-500">Quality</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                  style={{ width: `${result.quality}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-indigo-600">{result.quality}%</span>
            </div>
          </div>

          {/* The prompt */}
          <div className="px-6 py-5">
            <div className="rounded-xl bg-gray-50 p-5 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap ring-1 ring-gray-900/5">
              {result.fullPrompt}
            </div>
          </div>

          {/* Action footer */}
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3">
            <button
              onClick={clear}
              className="inline-flex items-center gap-x-1 text-xs font-medium text-gray-500 transition-colors hover:text-gray-700"
            >
              <RotateCcw className="h-3 w-3" />
              Start over
            </button>
            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium capitalize text-gray-500">
              {result.category}
            </span>
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {!result && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
            <Sparkles className="h-7 w-7 text-gray-400" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-gray-900">No prompt generated yet</h3>
          <p className="mt-1 text-xs text-gray-500">Type your idea above and click Generate.</p>
        </div>
      )}

      {/* ── Export Modal ── */}
      {showExport && result && (
        <ExportModal result={result} onClose={() => setShowExport(false)} />
      )}
    </div>
  );
}

/* ────────────────────────── Sub-components ────────────────────────── */

function InlineSelect({ label, value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 appearance-none rounded-xl border border-gray-200 bg-white pl-3 pr-8 text-xs font-medium text-gray-700 shadow-sm outline-none transition-all hover:border-gray-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-600/10"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {label}: {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
    </div>
  );
}

function ExportModal({ result, onClose }) {
  const doExport = (fmt) => {
    let content, filename, type;
    if (fmt === 'json') {
      content = JSON.stringify({ prompt: result.fullPrompt, quality: result.quality }, null, 2);
      filename = 'prompt.json';
      type = 'application/json';
    } else if (fmt === 'markdown') {
      content = `# Generated Prompt\n\n${result.fullPrompt}\n\n---\n*Quality: ${result.quality}%*`;
      filename = 'prompt.md';
      type = 'text/markdown';
    } else {
      content = result.fullPrompt;
      filename = 'prompt.txt';
      type = 'text/plain';
    }
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="text-base font-semibold text-gray-900">Export Prompt</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex justify-center gap-4 p-6">
          {[
            { fmt: 'json', label: 'JSON', icon: Code },
            { fmt: 'markdown', label: 'Markdown', icon: FileText },
            { fmt: 'text', label: 'Text', icon: AlignLeft },
          ].map(({ fmt, label, icon: Icon }) => (
            <button
              key={fmt}
              onClick={() => doExport(fmt)}
              className="flex flex-col items-center gap-y-2 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-md"
            >
              <Icon className="h-6 w-6 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────── Helpers ────────────────────────── */

function detectCategory(text) {
  const t = text.toLowerCase();
  if (/code|api|function|react|python|javascript|sql|database|bug|deploy/.test(t)) return 'coding';
  if (/marketing|ad|campaign|brand|sales|social media|seo|blog/.test(t)) return 'marketing';
  if (/story|poem|novel|creative|screenplay|fiction/.test(t)) return 'creative';
  if (/research|study|analysis|academic|scientific|paper/.test(t)) return 'academic';
  if (/business|strategy|company|project|budget|plan|report/.test(t)) return 'business';
  return 'general';
}

function buildRole(cat, tone) {
  const roles = {
    coding: 'You are a senior software engineer with 10+ years of experience building scalable, production-grade applications.',
    marketing: 'You are an expert digital marketing strategist and copywriter with deep expertise in engagement and conversions.',
    creative: 'You are a talented creative writer skilled in multiple genres with a deep understanding of narrative structure.',
    academic: 'You are an academic research specialist with expertise in structured analysis and scholarly communication.',
    business: 'You are a senior business consultant with expertise in strategic planning and executive communication.',
    general: 'You are a highly skilled AI assistant with deep domain expertise. You provide thorough, well-structured responses.',
  };
  return roles[cat] || roles.general;
}

function buildContext(idea, cat) {
  return `The user needs help with: "${idea}". This falls within the ${cat} domain. Provide a comprehensive, tailored response.`;
}

function buildTasks(idea) {
  return [
    `1. Analyze the request: "${idea}"`,
    '2. Break the task into clear, actionable steps',
    '3. Provide detailed, expert-level content for each step',
    '4. Include relevant examples where helpful',
    '5. Review for accuracy and completeness',
  ].join('\n');
}

function buildConstraints(tone) {
  return `Maintain a ${tone} tone throughout. Be concise yet thorough. Avoid filler. Ensure accuracy and structure the response for readability.`;
}

function buildOutputFormat() {
  return 'Present your response in clear, well-organized sections with logical flow and descriptive headings.';
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
