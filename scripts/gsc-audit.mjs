/**
 * Google Search Console Audit Script
 *
 * Usage:
 *   node scripts/gsc-audit.mjs
 *
 * Required env vars:
 *   GSC_SITE_URL                  - Your GSC property URL (e.g. https://yourclientdomain.com/)
 *   GOOGLE_APPLICATION_CREDENTIALS - Path to a service account JSON key file
 *                                    (see scripts/GSC_SETUP.md for setup instructions)
 *
 * Optional env vars:
 *   GSC_OUTPUT_FILE               - Output path (default: gsc-audit-report.md)
 *   GSC_MAX_URLS                  - Max URLs to inspect individually (default: 100)
 *   GSC_DAYS                      - Days of search analytics history (default: 28)
 */

import { google } from 'googleapis';
import fs from 'fs';

// ─── Config ───────────────────────────────────────────────────────────────────

const SITE_URL = process.env.GSC_SITE_URL;
const OUTPUT_FILE = process.env.GSC_OUTPUT_FILE || 'gsc-audit-report.md';
const MAX_URLS = parseInt(process.env.GSC_MAX_URLS || '100', 10);
const DAYS = parseInt(process.env.GSC_DAYS || '28', 10);
const RATE_LIMIT_MS = 300; // ms between URL inspection calls (~200 req/min, well under 600 QPM limit)
// NOTE: The binding constraint is 2,000 inspections/day/property (QPD), not QPM.
// At MAX_URLS=100 you consume 5% of the daily quota per run. Keep MAX_URLS ≤ 200 to stay safe.

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const today = new Date();
const endDate = today.toISOString().split('T')[0];
const startDate = new Date(today - DAYS * 86400000).toISOString().split('T')[0];

const fmt = {
  date: (d) => new Date(d).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' }),
  pct: (n) => `${(n * 100).toFixed(1)}%`,
  num: (n) => n?.toLocaleString() ?? '—',
  pos: (n) => n?.toFixed(1) ?? '—',
  bool: (v) => (v ? '✅' : '❌'),
};

function severityIcon(s) {
  if (!s) return '⚪';
  const l = s.toLowerCase();
  if (l.includes('error')) return '🔴';
  if (l.includes('warn')) return '🟡';
  if (l.includes('valid') || l.includes('pass') || l.includes('good')) return '🟢';
  return '⚪';
}

function coverageIcon(state) {
  const map = {
    PASS: '🟢 Valid',
    PARTIAL: '🟡 Valid (warnings)',
    FAIL: '🔴 Error',
    NEUTRAL: '⚪ Excluded / Not indexed',
  };
  return map[state] ?? `⚪ ${state ?? 'Unknown'}`;
}

function mdTable(rows, cols) {
  if (!rows.length) return '_No data._\n';
  const header = `| ${cols.map((c) => c.label).join(' | ')} |`;
  const divider = `| ${cols.map(() => '---').join(' | ')} |`;
  const body = rows
    .map((r) => `| ${cols.map((c) => String(c.fn ? c.fn(r) : (r[c.key] ?? '—'))).join(' | ')} |`)
    .join('\n');
  return `${header}\n${divider}\n${body}\n`;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

function buildAuth() {
  // Uses Application Default Credentials.
  // Set GOOGLE_APPLICATION_CREDENTIALS to the path of your service account JSON key file.
  // See scripts/GSC_SETUP.md for full setup instructions.
  return new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
}

// ─── GSC API calls ────────────────────────────────────────────────────────────

async function listSitemaps(wm, siteUrl) {
  try {
    const res = await wm.sitemaps.list({ siteUrl });
    return res.data.sitemap ?? [];
  } catch (e) {
    console.warn(`  ⚠ Could not fetch sitemaps: ${e.message}`);
    return [];
  }
}

async function getSitemap(wm, siteUrl, feedpath) {
  try {
    const res = await wm.sitemaps.get({ siteUrl, feedpath });
    return res.data;
  } catch (e) {
    console.warn(`  ⚠ Could not fetch sitemap ${feedpath}: ${e.message}`);
    return null;
  }
}

async function getSearchAnalytics(wm, siteUrl, dimensions, rowLimit = 100) {
  try {
    const res = await wm.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions,
        rowLimit,
        dataState: 'all',
      },
    });
    return res.data.rows ?? [];
  } catch (e) {
    console.warn(`  ⚠ Search analytics (${dimensions.join(',')}): ${e.message}`);
    return [];
  }
}

async function inspectUrl(sc, inspectionUrl, siteUrl) {
  try {
    const res = await sc.urlInspection.index.inspect({
      requestBody: { inspectionUrl, siteUrl, languageCode: 'en-US' },
    });
    return res.data.inspectionResult ?? null;
  } catch (e) {
    return { _error: e.message };
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!SITE_URL) {
    console.error('❌ GSC_SITE_URL is required.\n   Set it in .env.local or pass inline:\n   GSC_SITE_URL=https://yourclientdomain.com/ node scripts/gsc-audit.mjs');
    process.exit(1);
  }

  const isDomainProperty = SITE_URL.startsWith('sc-domain:');
  const siteUrl = isDomainProperty
    ? SITE_URL.replace(/\/$/, '')
    : SITE_URL.endsWith('/') ? SITE_URL : `${SITE_URL}/`;

  // For URL-prefix properties, baseUrl is the site URL itself.
  // For domain properties (sc-domain:), derive the https URL from the domain.
  const baseUrl = isDomainProperty
    ? `https://${SITE_URL.replace('sc-domain:', '').replace(/\/$/, '')}/`
    : siteUrl;

  console.log('🔍 Google Search Console Audit');
  console.log(`   Site:    ${siteUrl}`);
  console.log(`   Period:  ${startDate} → ${endDate} (${DAYS} days)`);
  console.log(`   Output:  ${OUTPUT_FILE}\n`);

  const auth = buildAuth();
  const authClient = await auth.getClient();
  google.options({ auth: authClient });

  const wm = google.webmasters({ version: 'v3' });
  const sc = google.searchconsole({ version: 'v1' });

  const sections = [];
  const runAt = new Date().toISOString();

  // ── 1. Sitemaps ─────────────────────────────────────────────────────────────
  console.log('📋 Fetching sitemaps…');
  const sitemapList = await listSitemaps(wm, siteUrl);
  const sitemapDetails = await Promise.all(
    sitemapList.map((s) => getSitemap(wm, siteUrl, s.path))
  );

  let sitemapSection = `## 🗺 Sitemaps (${sitemapList.length} submitted)\n\n`;

  const sitemapErrors = [];
  const sitemapWarnings = [];

  sitemapDetails.forEach((sm, i) => {
    if (!sm) return;
    const path_ = sitemapList[i]?.path ?? '—';
    const urls = sm.contents?.reduce((acc, c) => acc + (c.submitted ?? 0), 0) ?? 0;
    const indexed = sm.contents?.reduce((acc, c) => acc + (c.indexed ?? 0), 0) ?? null;
    const errors_ = sm.errors ?? 0;
    const warnings_ = sm.warnings ?? 0;
    const lastDl = sm.lastDownloaded ? fmt.date(sm.lastDownloaded) : '—';
    const isPending = sm.isPending ?? false;
    const isSitemapIndex = sm.isSitemapsIndex ?? false;

    sitemapSection += `### ${severityIcon(errors_ > 0 ? 'error' : warnings_ > 0 ? 'warn' : 'pass')} \`${path_}\`\n\n`;
    sitemapSection += `| Field | Value |\n| --- | --- |\n`;
    sitemapSection += `| Type | ${isSitemapIndex ? 'Sitemap Index' : 'Sitemap'} |\n`;
    sitemapSection += `| Last downloaded | ${lastDl} |\n`;
    sitemapSection += `| URLs submitted | ${fmt.num(urls)} |\n`;
    sitemapSection += `| URLs indexed | ${indexed !== null ? fmt.num(indexed) : '_(deprecated — use URL Inspection)_'} |\n`;
    sitemapSection += `| Errors | ${errors_ > 0 ? `🔴 ${errors_}` : '🟢 0'} |\n`;
    sitemapSection += `| Warnings | ${warnings_ > 0 ? `🟡 ${warnings_}` : '🟢 0'} |\n`;
    sitemapSection += `| Pending | ${isPending ? '⏳ Yes' : 'No'} |\n\n`;

    if (errors_ > 0) sitemapErrors.push({ path: path_, count: errors_ });
    if (warnings_ > 0) sitemapWarnings.push({ path: path_, count: warnings_ });
  });

  if (!sitemapList.length) {
    sitemapSection += '_No sitemaps found. Submit your sitemap at https://search.google.com/search-console/_\n\n';
  }

  sections.push(sitemapSection);

  // ── 2. Search Analytics ─────────────────────────────────────────────────────
  console.log('📊 Fetching search analytics…');

  const overallRows = await getSearchAnalytics(wm, siteUrl, ['date'], 90);
  const totalClicks = overallRows.reduce((a, r) => a + (r.clicks ?? 0), 0);
  const totalImpressions = overallRows.reduce((a, r) => a + (r.impressions ?? 0), 0);
  const avgCTR = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
  const avgPos = overallRows.length
    ? overallRows.reduce((a, r) => a + (r.position ?? 0), 0) / overallRows.length
    : 0;

  const pageRows = await getSearchAnalytics(wm, siteUrl, ['page'], 100);
  const queryRows = await getSearchAnalytics(wm, siteUrl, ['query'], 50);

  const lowCTRPages = pageRows
    .filter((r) => (r.impressions ?? 0) >= 10 && (r.ctr ?? 0) < 0.02)
    .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0));

  const poorPosPages = pageRows
    .filter((r) => (r.position ?? 999) > 30)
    .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0));

  let analyticsSection = `## 📊 Search Performance (Last ${DAYS} Days)\n\n`;
  analyticsSection += `| Metric | Value |\n| --- | --- |\n`;
  analyticsSection += `| Total Clicks | ${fmt.num(totalClicks)} |\n`;
  analyticsSection += `| Total Impressions | ${fmt.num(totalImpressions)} |\n`;
  analyticsSection += `| Average CTR | ${fmt.pct(avgCTR)} |\n`;
  analyticsSection += `| Average Position | ${fmt.pos(avgPos)} |\n\n`;

  analyticsSection += `### Top 20 Pages by Impressions\n\n`;
  analyticsSection += mdTable(
    pageRows.slice(0, 20).map((r) => ({
      url: r.keys?.[0]?.replace(baseUrl.replace(/\/$/, ''), '') || '/',
      clicks: fmt.num(r.clicks),
      impressions: fmt.num(r.impressions),
      ctr: fmt.pct(r.ctr ?? 0),
      pos: fmt.pos(r.position),
    })),
    [
      { key: 'url', label: 'Page' },
      { key: 'clicks', label: 'Clicks' },
      { key: 'impressions', label: 'Impressions' },
      { key: 'ctr', label: 'CTR' },
      { key: 'pos', label: 'Avg Position' },
    ]
  );

  analyticsSection += `\n### Top 20 Queries\n\n`;
  analyticsSection += mdTable(
    queryRows.slice(0, 20).map((r) => ({
      query: r.keys?.[0] ?? '—',
      clicks: fmt.num(r.clicks),
      impressions: fmt.num(r.impressions),
      ctr: fmt.pct(r.ctr ?? 0),
      pos: fmt.pos(r.position),
    })),
    [
      { key: 'query', label: 'Query' },
      { key: 'clicks', label: 'Clicks' },
      { key: 'impressions', label: 'Impressions' },
      { key: 'ctr', label: 'CTR' },
      { key: 'pos', label: 'Avg Position' },
    ]
  );

  if (lowCTRPages.length) {
    analyticsSection += `\n### ⚠ Pages with High Impressions but Low CTR (<2%)\n\n`;
    analyticsSection +=
      '_These pages appear in search results but rarely get clicked — likely a title or meta description issue._\n\n';
    analyticsSection += mdTable(
      lowCTRPages.slice(0, 15).map((r) => ({
        url: r.keys?.[0]?.replace(baseUrl.replace(/\/$/, ''), '') || '/',
        impressions: fmt.num(r.impressions),
        ctr: fmt.pct(r.ctr ?? 0),
        pos: fmt.pos(r.position),
      })),
      [
        { key: 'url', label: 'Page' },
        { key: 'impressions', label: 'Impressions' },
        { key: 'ctr', label: 'CTR' },
        { key: 'pos', label: 'Avg Position' },
      ]
    );
  }

  if (poorPosPages.length) {
    analyticsSection += `\n### 🔴 Pages Ranking Below Position 30\n\n`;
    analyticsSection +=
      '_These pages exist in the index but rank too low to generate meaningful traffic._\n\n';
    analyticsSection += mdTable(
      poorPosPages.slice(0, 15).map((r) => ({
        url: r.keys?.[0]?.replace(baseUrl.replace(/\/$/, ''), '') || '/',
        impressions: fmt.num(r.impressions),
        pos: fmt.pos(r.position),
      })),
      [
        { key: 'url', label: 'Page' },
        { key: 'impressions', label: 'Impressions' },
        { key: 'pos', label: 'Avg Position' },
      ]
    );
  }

  sections.push(analyticsSection);

  // ── 3. URL Inspection ────────────────────────────────────────────────────────
  const analyticsUrls = pageRows.map((r) => r.keys?.[0]).filter(Boolean);

  // Minimal static pages — extend this list per project after forking.
  // Add paths for any pages that may not yet appear in search analytics
  // (e.g. newly launched pages, service pages, location pages).
  const staticPages = [
    baseUrl,
    `${baseUrl}contact`,
    // Add per-project pages here, e.g.:
    // `${baseUrl}about`,
    // `${baseUrl}services`,
  ];

  const allUrls = [...new Set([...analyticsUrls, ...staticPages])].slice(0, MAX_URLS);

  console.log(`\n🔬 Inspecting ${allUrls.length} URLs (rate-limited, may take a moment)…`);

  const inspectionResults = [];
  for (let i = 0; i < allUrls.length; i++) {
    const url = allUrls[i];
    process.stdout.write(`  [${i + 1}/${allUrls.length}] ${url.replace(baseUrl.replace(/\/$/, ''), '') || '/'}\r`);
    const result = await inspectUrl(sc, url, siteUrl);
    inspectionResults.push({ url, result });
    await sleep(RATE_LIMIT_MS);
  }
  console.log('\n  ✓ URL inspection complete.');

  const coverageErrors = [];
  const coverageWarnings = [];
  const mobileIssues = [];
  const richResultIssues = [];
  const notIndexed = [];
  const valid = [];

  for (const { url, result } of inspectionResults) {
    if (!result || result._error) {
      coverageErrors.push({ url, issue: result?._error ?? 'API error', detail: '—' });
      continue;
    }

    const slug = url.replace(baseUrl.replace(/\/$/, ''), '') || '/';
    const idx = result.indexStatusResult;
    const coverage = idx?.coverageState ?? 'UNKNOWN';
    const verdict = idx?.verdict ?? 'UNKNOWN';
    const lastCrawl = idx?.lastCrawlTime ? fmt.date(idx.lastCrawlTime) : '—';
    const indexed = idx?.indexingState === 'INDEXING_ALLOWED';
    const fetchResult = idx?.pageFetchState ?? '—';

    if (verdict === 'FAIL' || coverage.includes('Error')) {
      coverageErrors.push({ url: slug, issue: coverage, detail: fetchResult, lastCrawl });
    } else if (verdict === 'PARTIAL' || coverage.includes('Warning')) {
      coverageWarnings.push({ url: slug, issue: coverage, detail: fetchResult, lastCrawl });
    } else if (verdict === 'NEUTRAL' || !indexed) {
      notIndexed.push({ url: slug, issue: coverage, detail: fetchResult, lastCrawl });
    } else {
      valid.push({ url: slug, lastCrawl });
    }

    const mob = result.mobileUsabilityResult;
    if (mob?.verdict === 'FAIL') {
      const issues_ = mob.issues?.map((i_) => `${i_.issueType ?? i_.message}`).join('; ') ?? '—';
      mobileIssues.push({ url: slug, issues: issues_ });
    }

    const rr = result.richResultsResult;
    if (rr?.verdict === 'FAIL' || rr?.detectedItems?.some((d) => d.items?.some((i_) => i_.issues?.length))) {
      const items = rr.detectedItems?.flatMap((d) =>
        (d.items ?? []).flatMap((i_) =>
          (i_.issues ?? []).map((iss) => {
            const sev = iss.severity === 'WARNING' ? '🟡' : '🔴';
            return `${sev} ${d.richResultType}: ${iss.issueMessage}`;
          })
        )
      ) ?? [];
      if (items.length) {
        richResultIssues.push({ url: slug, issues: items.join('; ') });
      }
    }
  }

  let inspectionSection = `## 🔬 URL Inspection Results (${allUrls.length} URLs)\n\n`;
  inspectionSection += `| Status | Count |\n| --- | --- |\n`;
  inspectionSection += `| 🟢 Valid & Indexed | ${valid.length} |\n`;
  inspectionSection += `| 🔴 Coverage Errors | ${coverageErrors.length} |\n`;
  inspectionSection += `| 🟡 Coverage Warnings | ${coverageWarnings.length} |\n`;
  inspectionSection += `| ⚪ Not Indexed / Excluded | ${notIndexed.length} |\n`;
  inspectionSection += `| 📱 Mobile Usability Issues | ${mobileIssues.length} |\n`;
  inspectionSection += `| ✨ Rich Result Issues | ${richResultIssues.length} |\n\n`;

  if (coverageErrors.length) {
    inspectionSection += `### 🔴 Coverage Errors\n\n`;
    inspectionSection += '_These pages have indexing errors — Google cannot properly crawl or index them._\n\n';
    inspectionSection += mdTable(coverageErrors, [
      { key: 'url', label: 'Page' },
      { key: 'issue', label: 'Issue' },
      { key: 'detail', label: 'Fetch Result' },
      { key: 'lastCrawl', label: 'Last Crawl' },
    ]);
  }

  if (coverageWarnings.length) {
    inspectionSection += `\n### 🟡 Coverage Warnings\n\n`;
    inspectionSection += '_These pages are indexed but have warnings that may affect ranking._\n\n';
    inspectionSection += mdTable(coverageWarnings, [
      { key: 'url', label: 'Page' },
      { key: 'issue', label: 'Warning' },
      { key: 'detail', label: 'Fetch Result' },
      { key: 'lastCrawl', label: 'Last Crawl' },
    ]);
  }

  if (notIndexed.length) {
    inspectionSection += `\n### ⚪ Not Indexed / Excluded\n\n`;
    inspectionSection += '_These pages are not in the Google index. This may be intentional (e.g. noindex) or an issue._\n\n';
    inspectionSection += mdTable(notIndexed, [
      { key: 'url', label: 'Page' },
      { key: 'issue', label: 'Coverage State' },
      { key: 'detail', label: 'Fetch Result' },
      { key: 'lastCrawl', label: 'Last Crawl' },
    ]);
  }

  if (mobileIssues.length) {
    inspectionSection += `\n### 📱 Mobile Usability Issues\n\n`;
    inspectionSection += '_Mobile-unfriendly pages are penalised in mobile search rankings._\n\n';
    inspectionSection += mdTable(mobileIssues, [
      { key: 'url', label: 'Page' },
      { key: 'issues', label: 'Issues' },
    ]);
  }

  if (richResultIssues.length) {
    inspectionSection += `\n### ✨ Rich Result Issues\n\n`;
    inspectionSection += '_Structured data errors prevent rich snippets (star ratings, FAQs, etc.) from appearing in search results._\n\n';
    inspectionSection += mdTable(richResultIssues, [
      { key: 'url', label: 'Page' },
      { key: 'issues', label: 'Issue' },
    ]);
  }

  if (valid.length) {
    inspectionSection += `\n<details>\n<summary>🟢 Valid & Indexed Pages (${valid.length})</summary>\n\n`;
    inspectionSection += mdTable(valid, [
      { key: 'url', label: 'Page' },
      { key: 'lastCrawl', label: 'Last Crawled' },
    ]);
    inspectionSection += `\n</details>\n`;
  }

  sections.push(inspectionSection);

  // ── 4. Action Items ──────────────────────────────────────────────────────────
  const actions = [];

  sitemapErrors.forEach((e) => {
    actions.push({ priority: 'HIGH', category: 'Sitemap', action: `Fix ${e.count} error(s) in sitemap: ${e.path}` });
  });
  sitemapWarnings.forEach((w) => {
    actions.push({ priority: 'MEDIUM', category: 'Sitemap', action: `Resolve ${w.count} warning(s) in sitemap: ${w.path}` });
  });
  coverageErrors.forEach((e) => {
    actions.push({ priority: 'HIGH', category: 'Indexing', action: `Fix coverage error on \`${e.url}\`: ${e.issue} (${e.detail})` });
  });
  coverageWarnings.forEach((w) => {
    actions.push({ priority: 'MEDIUM', category: 'Indexing', action: `Resolve coverage warning on \`${w.url}\`: ${w.issue}` });
  });
  notIndexed.forEach((n) => {
    if (!n.issue?.toLowerCase().includes('noindex') && !n.issue?.toLowerCase().includes('excluded')) {
      actions.push({ priority: 'MEDIUM', category: 'Indexing', action: `Investigate why \`${n.url}\` is not indexed: ${n.issue}` });
    }
  });
  mobileIssues.forEach((m) => {
    actions.push({ priority: 'HIGH', category: 'Mobile', action: `Fix mobile usability on \`${m.url}\`: ${m.issues}` });
  });
  richResultIssues.forEach((r) => {
    actions.push({ priority: 'MEDIUM', category: 'Structured Data', action: `Fix rich result schema on \`${r.url}\`: ${r.issues}` });
  });
  lowCTRPages.slice(0, 10).forEach((p) => {
    const slug = p.keys?.[0]?.replace(siteUrl.replace(/\/$/, ''), '') || '/';
    actions.push({ priority: 'MEDIUM', category: 'CTR', action: `Improve title/meta for \`${slug}\` — ${fmt.num(p.impressions)} impressions, only ${fmt.pct(p.ctr ?? 0)} CTR` });
  });
  poorPosPages.slice(0, 5).forEach((p) => {
    const slug = p.keys?.[0]?.replace(siteUrl.replace(/\/$/, ''), '') || '/';
    actions.push({ priority: 'LOW', category: 'Rankings', action: `Improve content/links for \`${slug}\` — avg position ${fmt.pos(p.position)}` });
  });

  const high = actions.filter((a) => a.priority === 'HIGH');
  const medium = actions.filter((a) => a.priority === 'MEDIUM');
  const low = actions.filter((a) => a.priority === 'LOW');

  let actionsSection = `## 🎯 Action Items\n\n`;

  if (high.length) {
    actionsSection += `### 🔴 High Priority (${high.length})\n\n`;
    high.forEach((a) => { actionsSection += `- **[${a.category}]** ${a.action}\n`; });
    actionsSection += '\n';
  }
  if (medium.length) {
    actionsSection += `### 🟡 Medium Priority (${medium.length})\n\n`;
    medium.forEach((a) => { actionsSection += `- **[${a.category}]** ${a.action}\n`; });
    actionsSection += '\n';
  }
  if (low.length) {
    actionsSection += `### 🟢 Low Priority (${low.length})\n\n`;
    low.forEach((a) => { actionsSection += `- **[${a.category}]** ${a.action}\n`; });
    actionsSection += '\n';
  }

  if (!actions.length) {
    actionsSection += '_No issues detected. All inspected pages appear healthy._ 🎉\n';
  }

  sections.push(actionsSection);

  // ── 5. Assemble report ───────────────────────────────────────────────────────
  const totalIssues = coverageErrors.length + mobileIssues.length + richResultIssues.length + sitemapErrors.length;
  const totalWarnings = coverageWarnings.length + sitemapWarnings.length + lowCTRPages.length;

  const report = [
    `# Google Search Console Audit Report`,
    ``,
    `> **Site:** ${siteUrl}  `,
    `> **Generated:** ${fmt.date(runAt)} at ${new Date(runAt).toLocaleTimeString('en-CA')}  `,
    `> **Period analysed:** ${fmt.date(startDate)} → ${fmt.date(endDate)} (${DAYS} days)  `,
    `> **URLs inspected:** ${allUrls.length}  `,
    ``,
    `---`,
    ``,
    `## 📋 Executive Summary`,
    ``,
    `| Category | Errors 🔴 | Warnings 🟡 | Healthy 🟢 |`,
    `| --- | --- | --- | --- |`,
    `| Sitemaps | ${sitemapErrors.length} | ${sitemapWarnings.length} | ${sitemapList.length - sitemapErrors.length} |`,
    `| Coverage | ${coverageErrors.length} | ${coverageWarnings.length} | ${valid.length} |`,
    `| Not Indexed | — | ${notIndexed.length} | — |`,
    `| Mobile Usability | ${mobileIssues.length} | — | ${allUrls.length - mobileIssues.length} |`,
    `| Rich Results | ${richResultIssues.length} | — | — |`,
    `| Low CTR Pages | — | ${lowCTRPages.length} | — |`,
    ``,
    `> **Total errors:** ${totalIssues}  `,
    `> **Total warnings:** ${totalWarnings}  `,
    `> **Action items:** ${actions.length} (${high.length} high, ${medium.length} medium, ${low.length} low)`,
    ``,
    `---`,
    ``,
    ...sections.map((s) => s.trimEnd()),
    ``,
    `---`,
    ``,
    `_Report generated by \`scripts/gsc-audit.mjs\` — ${runAt}_`,
  ].join('\n');

  fs.writeFileSync(OUTPUT_FILE, report, 'utf-8');

  console.log('\n─────────────────────────────────────────');
  console.log(`✅ Report written to: ${OUTPUT_FILE}`);
  console.log(`   Errors:   ${totalIssues}`);
  console.log(`   Warnings: ${totalWarnings}`);
  console.log(`   Actions:  ${actions.length}`);
  console.log('─────────────────────────────────────────\n');
}

main().catch((err) => {
  console.error('\n❌ Fatal error:', err.message ?? err);
  process.exit(1);
});
