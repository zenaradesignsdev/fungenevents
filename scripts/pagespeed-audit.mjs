/**
 * PageSpeed Insights Audit Script
 *
 * Usage:
 *   node scripts/pagespeed-audit.mjs
 *
 * Required env vars:
 *   PSI_URL           - The URL to audit (e.g. https://yourclientdomain.com)
 *
 * Optional env vars:
 *   PSI_API_KEY       - Google API key (omit for unauthenticated; fine for occasional runs)
 *   PSI_OUTPUT_FILE   - Output path (default: pagespeed-audit-report.md)
 *   PSI_STRATEGY      - "mobile", "desktop", or "both" (default: both)
 *
 * No API key needed for one-off runs. Free unauthenticated quota is generous
 * enough for a handful of requests per day. Get a key at:
 *   https://console.cloud.google.com/apis/library/pagespeedonline.googleapis.com
 */

import fs from 'fs';

// ─── Config ───────────────────────────────────────────────────────────────────

const URL_TO_AUDIT = process.env.PSI_URL;
const API_KEY = process.env.PSI_API_KEY ?? null;
const OUTPUT_FILE = process.env.PSI_OUTPUT_FILE || 'pagespeed-audit-report.md';
const STRATEGY_ENV = (process.env.PSI_STRATEGY || 'both').toLowerCase();

const STRATEGIES =
  STRATEGY_ENV === 'mobile' ? ['mobile']
  : STRATEGY_ENV === 'desktop' ? ['desktop']
  : ['mobile', 'desktop'];

const PSI_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

// Score thresholds (matches Lighthouse colour bands)
const SCORE_PASS = 0.9;   // ≥ 90 — green
const SCORE_WARN = 0.5;   // ≥ 50 — amber

// Lighthouse category IDs we care about
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];

const CATEGORY_LABELS = {
  performance: 'Performance',
  accessibility: 'Accessibility',
  'best-practices': 'Best Practices',
  seo: 'SEO',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreIcon(score) {
  if (score === null || score === undefined) return '⚪';
  if (score >= SCORE_PASS) return '🟢';
  if (score >= SCORE_WARN) return '🟡';
  return '🔴';
}

function scoreBand(score) {
  if (score === null || score === undefined) return 'N/A';
  const pct = Math.round(score * 100);
  if (score >= SCORE_PASS) return `${pct} 🟢`;
  if (score >= SCORE_WARN) return `${pct} 🟡`;
  return `${pct} 🔴`;
}

// Strip markdown/HTML from Lighthouse description strings
function cleanText(str) {
  if (!str) return '';
  return str
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [text](url) → text
    .replace(/<[^>]+>/g, '')                   // strip HTML tags
    .replace(/\s+/g, ' ')
    .trim();
}

function mdTable(rows, cols) {
  if (!rows.length) return '_None._\n';
  const header = `| ${cols.map((c) => c.label).join(' | ')} |`;
  const divider = `| ${cols.map(() => '---').join(' | ')} |`;
  const body = rows
    .map((r) => `| ${cols.map((c) => String(c.fn ? c.fn(r) : (r[c.key] ?? '—'))).join(' | ')} |`)
    .join('\n');
  return `${header}\n${divider}\n${body}\n`;
}

const fmt = {
  ms: (n) => (n ? `${Math.round(n)} ms` : '—'),
  bytes: (n) => {
    if (!n) return '—';
    if (n >= 1_048_576) return `${(n / 1_048_576).toFixed(1)} MB`;
    if (n >= 1_024) return `${(n / 1_024).toFixed(0)} KB`;
    return `${n} B`;
  },
  date: () => new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' }),
  time: () => new Date().toLocaleTimeString('en-CA'),
};

// ─── API ──────────────────────────────────────────────────────────────────────

async function fetchPSI(url, strategy) {
  const params = new URLSearchParams({ url, strategy });
  for (const cat of CATEGORIES) params.append('category', cat);
  if (API_KEY) params.append('key', API_KEY);

  const endpoint = `${PSI_ENDPOINT}?${params.toString()}`;

  console.log(`  → Fetching ${strategy}…`);
  const res = await fetch(endpoint);

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PSI API error ${res.status}: ${body.slice(0, 200)}`);
  }

  return res.json();
}

// ─── Parsers ──────────────────────────────────────────────────────────────────

function extractIssues(psiResult) {
  const lhr = psiResult.lighthouseResult;
  if (!lhr) return { categoryScores: {}, issuesByCategory: {} };

  const categoryScores = {};
  for (const id of CATEGORIES) {
    const cat = lhr.categories?.[id];
    categoryScores[id] = cat?.score ?? null;
  }

  const issuesByCategory = {};

  for (const id of CATEGORIES) {
    const cat = lhr.categories?.[id];
    if (!cat) continue;

    const failing = [];

    for (const ref of cat.auditRefs ?? []) {
      const audit = lhr.audits?.[ref.id];
      if (!audit) continue;

      const score = audit.score;
      if (score === 1) continue;
      if (score === null && audit.scoreDisplayMode === 'notApplicable') continue;

      failing.push({
        id: ref.id,
        weight: ref.weight ?? 0,
        score,
        scoreDisplayMode: audit.scoreDisplayMode,
        title: audit.title ?? ref.id,
        description: cleanText(audit.description),
        displayValue: audit.displayValue ?? null,
        details: audit.details ?? null,
        numericValue: audit.numericValue ?? null,
        numericUnit: audit.numericUnit ?? null,
      });
    }

    failing.sort((a, b) => {
      const aTier = a.score === null ? 1 : a.score < 0.5 ? 0 : a.score < 0.9 ? 1 : 2;
      const bTier = b.score === null ? 1 : b.score < 0.5 ? 0 : b.score < 0.9 ? 1 : 2;
      if (aTier !== bTier) return aTier - bTier;
      return (b.weight ?? 0) - (a.weight ?? 0);
    });

    issuesByCategory[id] = failing;
  }

  return { categoryScores, issuesByCategory };
}

function buildFixDetails(audit) {
  const details = audit.details;
  if (!details) return null;

  if (details.type === 'opportunity' && details.items?.length) {
    const rows = details.items.slice(0, 8).map((item) => {
      const label = item.url ?? item.source ?? item.label ?? item.node?.snippet ?? '';
      const savings = item.wastedBytes != null
        ? fmt.bytes(item.wastedBytes)
        : item.wastedMs != null
        ? fmt.ms(item.wastedMs)
        : null;
      return { label: truncate(label, 80), savings };
    });

    const hasSavings = rows.some((r) => r.savings);
    return mdTable(
      rows,
      hasSavings
        ? [{ key: 'label', label: 'Resource' }, { key: 'savings', label: 'Potential Saving' }]
        : [{ key: 'label', label: 'Resource' }]
    );
  }

  if (details.type === 'table' && details.items?.length) {
    const items = details.items.slice(0, 8);
    const rows = items.map((item) => {
      const text =
        item.url ?? item.source?.value ?? item.node?.snippet ?? item.label ?? item.description ?? JSON.stringify(item);
      return { text: truncate(String(text), 120) };
    });
    return mdTable(rows, [{ key: 'text', label: 'Item' }]);
  }

  if (details.type === 'list' && details.items?.length) {
    return details.items
      .slice(0, 8)
      .map((item) => `- ${truncate(String(item.value ?? item), 120)}`)
      .join('\n') + '\n';
  }

  if (details.type === 'debugdata' && details.items?.length) {
    const lines = [];
    for (const inner of details.items) {
      if (inner.type === 'table' && inner.items?.length) {
        const rows = inner.items.slice(0, 8).map((item) => {
          const src = item.source;
          const location = src
            ? `${truncate(src.url ?? '', 70)}:${src.line ?? '?'}:${src.column ?? '?'}`
            : item.nodeLabel ?? JSON.stringify(item);
          return { location: truncate(String(location), 120) };
        });
        lines.push(mdTable(rows, [{ key: 'location', label: 'Source location' }]));
      } else if (inner.type === 'list' && inner.items?.length) {
        lines.push(
          inner.items.slice(0, 8).map((i) => `- ${truncate(String(i.value ?? i), 120)}`).join('\n') + '\n'
        );
      }
    }
    return lines.length ? lines.join('\n') : null;
  }

  if (details.type === 'criticalrequestchains') {
    const rows = [];
    const walk = (chains, depth) => {
      for (const chain of Object.values(chains ?? {})) {
        const req = chain.request ?? {};
        const url = truncate(req.url ?? '(unknown)', 80);
        const transferSize = req.transferSize ? fmt.bytes(req.transferSize) : '—';
        rows.push({ url: '  '.repeat(depth) + url, transferSize });
        walk(chain.children, depth + 1);
      }
    };
    walk(details.chains, 0);
    if (!rows.length) return null;
    return mdTable(rows, [{ key: 'url', label: 'Request chain' }, { key: 'transferSize', label: 'Size' }]);
  }

  return null;
}

function truncate(str, max) {
  if (!str || str.length <= max) return str;
  return str.slice(0, max - 1) + '…';
}

// ─── Fix Guidance ─────────────────────────────────────────────────────────────

const FIX_GUIDANCE = {
  'render-blocking-resources':
    'In Next.js, use `next/script` with `strategy="lazyOnload"` or `"afterInteractive"` for non-critical scripts. Defer non-critical CSS by loading it asynchronously.',
  'unused-javascript':
    'Use `dynamic(() => import(\'...\'), { ssr: false })` for components not needed on first paint. Check your bundle with `ANALYZE=true npm run build`.',
  'unused-css-rules':
    'Tailwind purges unused classes at build time — ensure `content` paths in `tailwind.config.ts` cover all template files. Remove any unused global CSS in `globals.css`.',
  'uses-optimized-images':
    'Use `next/image` with a proper `sizes` prop. Set `quality={75}` or lower for large hero images. Prefer WebP/AVIF by configuring `formats` in `next.config.ts`.',
  'uses-responsive-images':
    'Always set `sizes` on `next/image` to match your layout breakpoints (e.g. `sizes="(max-width: 768px) 100vw, 50vw"`).',
  'modern-image-formats':
    'Add `formats: ["image/avif", "image/webp"]` to the `images` key in `next.config.ts`. `next/image` will serve modern formats automatically.',
  'uses-text-compression':
    'Enable Gzip/Brotli in your Vercel project settings or `next.config.ts` (`compress: true` is the default — verify it hasn\'t been disabled).',
  'uses-long-cache-ttl':
    'Static assets under `/_next/static/` are cache-busted by Next.js automatically. For public assets in `/public`, add `Cache-Control` headers via `next.config.ts` headers config.',
  'total-byte-weight':
    'Audit your largest JS chunks with `@next/bundle-analyzer`. Lazy-load heavy third-party libraries and images below the fold.',
  'server-response-time':
    'Ensure your Vercel region matches your users. Move heavy data fetching to `generateStaticParams` / ISR where possible to avoid SSR latency.',
  'redirects-http':
    'Vercel redirects HTTP → HTTPS automatically. If this fires, check for hard-coded `http://` URLs in your code.',
  'efficient-animated-content':
    'Replace animated GIFs with `<video autoPlay muted loop playsInline>` or use Lottie/CSS animations.',
  'uses-rel-preconnect':
    'Add `<link rel="preconnect">` tags in your root layout for third-party origins (fonts, analytics, CDN).',
  'font-display':
    'Add `font-display: swap` (or `optional`) to your `next/font` config: `{ display: "swap" }`.',
  'largest-contentful-paint-element':
    'Add `priority` prop to the `next/image` that is your LCP element (typically the hero image). Also add `fetchPriority="high"` if using a plain `<img>`.',
  'layout-shift-elements':
    'Reserve space for images (`width` + `height` or `aspect-ratio`), ads, and late-loading embeds to prevent layout shift.',
  'long-tasks':
    'Break up long JS tasks with `scheduler.postTask()` or `requestIdleCallback`. Move heavy work off the main thread with Web Workers.',
  'bootup-time':
    'Reduce main-thread JS execution time. Code-split with `dynamic()`, tree-shake libraries, and avoid synchronous parsing on load.',
  'mainthread-work-breakdown':
    'Profile with Chrome DevTools Performance tab. Common culprits: large React trees re-rendering, synchronous third-party scripts, heavy CSS selectors.',
  'third-party-summary':
    'Defer third-party scripts with `next/script strategy="lazyOnload"`. Facade heavy embeds (chat widgets, video players) behind click-to-load patterns.',
  'dom-size':
    'Aim for < 1,500 DOM nodes. Use windowing/virtualisation (`react-window`) for long lists, and lazy-render off-screen sections.',
  'color-contrast':
    'Check all text against WCAG AA (4.5:1 for body, 3:1 for large text). Use the Chrome DevTools accessibility panel or axe browser extension.',
  'image-alt':
    'Every `next/image` and `<img>` must have a descriptive `alt` prop. Empty `alt=""` is correct only for decorative images.',
  'label': 'Every `<input>`, `<select>`, and `<textarea>` must have a corresponding `<label htmlFor>` or `aria-label`.',
  'button-name':
    'Icon-only buttons need `aria-label`. Example: `<button aria-label="Close menu"><XIcon /></button>`.',
  'link-name':
    'Anchor tags need descriptive text or `aria-label`. Avoid "click here" or "read more" without context.',
  'document-title': 'Export a `metadata` object (or `generateMetadata`) from every `page.tsx` with a unique `title`.',
  'meta-description':
    'Add `description` to the `metadata` export on every page. Aim for 120–160 characters.',
  'viewport':
    'Ensure `<meta name="viewport" content="width=device-width, initial-scale=1">` is present in your root layout.',
  'crawlable-anchors':
    'All navigation links should use `<Link href="...">` with real URL paths — not `href="#"` or `javascript:void(0)`.',
  'is-crawlable':
    'Check your `robots.txt` and any `noindex` meta tags. Pages that should be indexed must not have `<meta name="robots" content="noindex">`.',
  'hreflang': 'Add `<link rel="alternate" hreflang="...">` tags if you serve multiple languages/regions.',
  'canonical': 'Set a canonical URL via `alternates.canonical` in your `metadata` export to prevent duplicate-content penalties.',
  'structured-data':
    'Add JSON-LD structured data (`LocalBusiness`, `Organization`, `WebPage`, etc.) via a `<script type="application/ld+json">` in your page or layout.',
  'content-security-policy':
    'Add a `Content-Security-Policy` header in `next.config.ts` under `headers()`. Start with a restrictive policy and loosen as needed.',
  'js-libraries':
    'Audit vulnerable/outdated dependencies with `npm audit`. Update or replace libraries flagged by Lighthouse.',
};

// ─── Report builders ──────────────────────────────────────────────────────────

function buildStrategyReport(strategyLabel, data) {
  const { categoryScores, issuesByCategory } = data;
  let out = `## ${strategyLabel === 'mobile' ? '📱 Mobile' : '🖥 Desktop'} Results\n\n`;

  out += `| Category | Score |\n| --- | --- |\n`;
  for (const id of CATEGORIES) {
    const score = categoryScores[id];
    out += `| ${CATEGORY_LABELS[id]} | ${score !== null ? scoreBand(score) : 'N/A'} |\n`;
  }
  out += '\n';

  for (const id of CATEGORIES) {
    const audits = issuesByCategory[id] ?? [];
    const catScore = categoryScores[id];
    const icon = catScore !== null ? scoreIcon(catScore) : '⚪';
    out += `---\n\n### ${icon} ${CATEGORY_LABELS[id]}\n\n`;

    if (!audits.length) {
      out += `_All audits passed._ 🎉\n\n`;
      continue;
    }

    for (const audit of audits) {
      const aIcon = audit.score === null ? '⚪' : audit.score < 0.5 ? '🔴' : audit.score < 0.9 ? '🟡' : '🟢';
      const scoreStr = audit.score !== null ? ` (score: ${Math.round(audit.score * 100)})` : '';
      const valueStr = audit.displayValue ? ` — _${audit.displayValue}_` : '';

      out += `#### ${aIcon} ${audit.title}${valueStr}${scoreStr}\n\n`;

      if (audit.description) {
        out += `**What it means:** ${audit.description}\n\n`;
      }

      const guidance = FIX_GUIDANCE[audit.id];
      if (guidance) {
        out += `**How to fix (Next.js):** ${guidance}\n\n`;
      }

      const fixDetails = buildFixDetails(audit);
      if (fixDetails) {
        out += `**Affected resources:**\n\n${fixDetails}\n`;
      }
    }
  }

  return out;
}

// ─── Action items ─────────────────────────────────────────────────────────────

function buildActionItems(allData) {
  const actions = [];

  for (const { strategy, issuesByCategory } of allData) {
    for (const id of CATEGORIES) {
      for (const audit of issuesByCategory[id] ?? []) {
        if (audit.score === 1) continue;
        const priority =
          audit.score === null ? 'LOW'
          : audit.score < 0.5 ? 'HIGH'
          : audit.score < 0.9 ? 'MEDIUM'
          : 'LOW';

        actions.push({
          priority,
          strategy,
          category: CATEGORY_LABELS[id],
          title: audit.title,
          value: audit.displayValue ?? (audit.score !== null ? `score ${Math.round(audit.score * 100)}` : 'informational'),
        });
      }
    }
  }

  const seen = new Map();
  const deduped = [];
  for (const a of actions) {
    const key = `${a.title}:${a.category}`;
    if (!seen.has(key)) {
      seen.set(key, { ...a, strategies: [a.strategy] });
      deduped.push(seen.get(key));
    } else {
      seen.get(key).strategies.push(a.strategy);
    }
  }

  const high = deduped.filter((a) => a.priority === 'HIGH');
  const medium = deduped.filter((a) => a.priority === 'MEDIUM');
  const low = deduped.filter((a) => a.priority === 'LOW');

  let out = `## 🎯 Action Items\n\n`;

  if (high.length) {
    out += `### 🔴 High Priority (${high.length})\n\n`;
    for (const a of high) {
      const tag = a.strategies.length > 1 ? 'mobile + desktop' : a.strategies[0];
      out += `- **[${a.category} · ${tag}]** ${a.title} — _${a.value}_\n`;
    }
    out += '\n';
  }

  if (medium.length) {
    out += `### 🟡 Medium Priority (${medium.length})\n\n`;
    for (const a of medium) {
      const tag = a.strategies.length > 1 ? 'mobile + desktop' : a.strategies[0];
      out += `- **[${a.category} · ${tag}]** ${a.title} — _${a.value}_\n`;
    }
    out += '\n';
  }

  if (low.length) {
    out += `### 🟢 Low Priority / Informational (${low.length})\n\n`;
    for (const a of low) {
      const tag = a.strategies.length > 1 ? 'mobile + desktop' : a.strategies[0];
      out += `- **[${a.category} · ${tag}]** ${a.title} — _${a.value}_\n`;
    }
    out += '\n';
  }

  if (!deduped.length) {
    out += '_No issues detected. All audited categories passed._ 🎉\n';
  }

  return { out, counts: { high: high.length, medium: medium.length, low: low.length } };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!URL_TO_AUDIT) {
    console.error('❌  PSI_URL is required.\n    Set it in .env.local or pass inline:\n    PSI_URL=https://yourclientdomain.com node scripts/pagespeed-audit.mjs');
    process.exit(1);
  }

  console.log('⚡ PageSpeed Insights Audit');
  console.log(`   URL:      ${URL_TO_AUDIT}`);
  console.log(`   Strategy: ${STRATEGIES.join(', ')}`);
  console.log(`   API key:  ${API_KEY ? 'set ✓' : 'not set (unauthenticated — fine for occasional runs)'}`);
  console.log(`   Output:   ${OUTPUT_FILE}\n`);

  const allData = [];

  for (const strategy of STRATEGIES) {
    try {
      const result = await fetchPSI(URL_TO_AUDIT, strategy);
      const parsed = extractIssues(result);
      allData.push({ strategy, ...parsed, raw: result });
    } catch (err) {
      console.error(`  ❌ Failed to fetch ${strategy}: ${err.message}`);
      process.exit(1);
    }
  }

  let summaryTable = `| Category |`;
  for (const { strategy } of allData) summaryTable += ` ${strategy === 'mobile' ? '📱 Mobile' : '🖥 Desktop'} |`;
  summaryTable += '\n| --- |' + allData.map(() => ' --- |').join('') + '\n';

  for (const id of CATEGORIES) {
    summaryTable += `| ${CATEGORY_LABELS[id]} |`;
    for (const d of allData) {
      const score = d.categoryScores[id];
      summaryTable += ` ${score !== null ? scoreBand(score) : 'N/A'} |`;
    }
    summaryTable += '\n';
  }

  const { out: actionsSection, counts } = buildActionItems(allData);
  const strategySections = allData.map((d) => buildStrategyReport(d.strategy, d));

  const runAt = new Date().toISOString();

  const report = [
    `# PageSpeed Insights Audit Report`,
    ``,
    `> **URL:** ${URL_TO_AUDIT}  `,
    `> **Generated:** ${fmt.date()} at ${fmt.time()}  `,
    `> **Strategy:** ${STRATEGIES.join(', ')}  `,
    `> **API key:** ${API_KEY ? 'yes' : 'no (unauthenticated)'}  `,
    ``,
    `---`,
    ``,
    `## 📋 Score Summary`,
    ``,
    summaryTable,
    ``,
    `> **Total action items:** ${counts.high + counts.medium + counts.low} (${counts.high} high · ${counts.medium} medium · ${counts.low} low)`,
    ``,
    `---`,
    ``,
    actionsSection,
    `---`,
    ``,
    ...strategySections,
    `---`,
    ``,
    `_Report generated by \`scripts/pagespeed-audit.mjs\` — ${runAt}_`,
  ].join('\n');

  fs.writeFileSync(OUTPUT_FILE, report, 'utf-8');

  console.log('\n─────────────────────────────────────────');
  console.log(`✅ Report written to: ${OUTPUT_FILE}`);
  console.log(`   High:   ${counts.high}`);
  console.log(`   Medium: ${counts.medium}`);
  console.log(`   Low:    ${counts.low}`);
  console.log(`   Total:  ${counts.high + counts.medium + counts.low}`);
  console.log('─────────────────────────────────────────\n');
}

main().catch((err) => {
  console.error('\n❌ Fatal error:', err.message ?? err);
  process.exit(1);
});
