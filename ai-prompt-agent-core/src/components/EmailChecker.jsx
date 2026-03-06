import React, { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Copy, MailCheck, Search, ShieldAlert, Upload } from 'lucide-react';

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  '10minutemail.com',
  'temp-mail.org',
  'guerrillamail.com',
  'yopmail.com',
]);

function normalize(email) {
  return email.trim().toLowerCase();
}

function isValidSyntax(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

async function hasResolvableDomain(domain) {
  try {
    const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`);
    if (!response.ok) return null;
    const data = await response.json();
    return Array.isArray(data.Answer) && data.Answer.length > 0;
  } catch {
    return null;
  }
}

function parseBulkInput(input) {
  return Array.from(
    new Set(
      input
        .split(/[\n,;\s]+/)
        .map(normalize)
        .filter(Boolean)
    )
  );
}

export default function EmailChecker() {
  const [singleEmail, setSingleEmail] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState([]);

  const stats = useMemo(() => {
    const valid = results.filter((r) => r.finalStatus === 'valid').length;
    const risky = results.filter((r) => r.finalStatus === 'risky').length;
    const invalid = results.filter((r) => r.finalStatus === 'invalid').length;
    return { total: results.length, valid, risky, invalid };
  }, [results]);

  const runCheck = async (emails) => {
    setChecking(true);
    try {
      const output = [];

      for (const email of emails) {
        const syntaxOk = isValidSyntax(email);
        if (!syntaxOk) {
          output.push({
            email,
            syntaxOk: false,
            disposable: false,
            mxStatus: 'invalid',
            finalStatus: 'invalid',
            reason: 'Invalid email format',
          });
          continue;
        }

        const domain = email.split('@')[1];
        const disposable = DISPOSABLE_DOMAINS.has(domain);
        const mxResult = await hasResolvableDomain(domain);

        let mxStatus = 'unknown';
        if (mxResult === true) mxStatus = 'ok';
        if (mxResult === false) mxStatus = 'invalid';

        let finalStatus = 'valid';
        let reason = 'Looks deliverable';

        if (disposable) {
          finalStatus = 'risky';
          reason = 'Disposable email domain';
        }

        if (mxStatus === 'invalid') {
          finalStatus = 'invalid';
          reason = 'Domain has no MX records';
        }

        output.push({
          email,
          syntaxOk: true,
          disposable,
          mxStatus,
          finalStatus,
          reason,
        });
      }

      setResults(output);
    } finally {
      setChecking(false);
    }
  };

  const handleSingleCheck = async () => {
    const email = normalize(singleEmail);
    if (!email) return;
    await runCheck([email]);
  };

  const handleBulkCheck = async () => {
    const emails = parseBulkInput(bulkInput);
    if (emails.length === 0) return;
    await runCheck(emails);
  };

  const copyValidEmails = async () => {
    const validEmails = results
      .filter((r) => r.finalStatus === 'valid')
      .map((r) => r.email)
      .join('\n');

    if (!validEmails) return;
    await navigator.clipboard.writeText(validEmails);
  };

  const badgeClass = (status) => {
    if (status === 'valid') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300';
    if (status === 'risky') return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300';
    return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300';
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-50 px-8 py-8 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-neon-cyan">Email Intelligence</p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Email Checker</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Validate syntax, detect disposable domains, and verify MX records in one place.
              </p>
            </div>
            <MailCheck className="h-10 w-10 text-sky-500 dark:text-neon-cyan" />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
              <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{stats.total}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">Valid</p>
              <p className="mt-1 text-lg font-semibold text-emerald-600 dark:text-emerald-300">{stats.valid}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">Risky</p>
              <p className="mt-1 text-lg font-semibold text-amber-600 dark:text-amber-300">{stats.risky}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">Invalid</p>
              <p className="mt-1 text-lg font-semibold text-red-600 dark:text-red-300">{stats.invalid}</p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-500" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Single Email Check</h2>
            </div>
            <div className="space-y-3">
              <input
                type="email"
                value={singleEmail}
                onChange={(e) => setSingleEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <button
                onClick={handleSingleCheck}
                disabled={checking}
                className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CheckCircle2 className="h-4 w-4" />
                {checking ? 'Checking...' : 'Check Email'}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-2">
              <Upload className="h-4 w-4 text-slate-500" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Bulk Email Check</h2>
            </div>
            <div className="space-y-3">
              <textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                rows={6}
                placeholder="Paste emails separated by comma, space, or new line"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <button
                onClick={handleBulkCheck}
                disabled={checking}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <MailCheck className="h-4 w-4" />
                {checking ? 'Checking...' : 'Check Bulk List'}
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Results</h2>
            <button
              onClick={copyValidEmails}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy Valid Emails
            </button>
          </div>

          {results.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">No checks yet. Run a single or bulk validation.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left dark:border-slate-700">
                    <th className="px-3 py-2 font-medium text-slate-500">Email</th>
                    <th className="px-3 py-2 font-medium text-slate-500">Syntax</th>
                    <th className="px-3 py-2 font-medium text-slate-500">Domain (MX)</th>
                    <th className="px-3 py-2 font-medium text-slate-500">Status</th>
                    <th className="px-3 py-2 font-medium text-slate-500">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row) => (
                    <tr key={row.email} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200">{row.email}</td>
                      <td className="px-3 py-2">
                        {row.syntaxOk ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-300"><CheckCircle2 className="h-3.5 w-3.5" />Valid</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-300"><AlertCircle className="h-3.5 w-3.5" />Invalid</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                        {row.mxStatus === 'ok' && 'MX Found'}
                        {row.mxStatus === 'invalid' && 'No MX'}
                        {row.mxStatus === 'unknown' && 'Unknown'}
                      </td>
                      <td className="px-3 py-2">
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${badgeClass(row.finalStatus)}`}>
                          {row.finalStatus}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                        {row.disposable ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-300">
                            <ShieldAlert className="h-3.5 w-3.5" />
                            {row.reason}
                          </span>
                        ) : (
                          row.reason
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
