# Google Search Console Audit — Setup Guide

## What it does

Runs `scripts/gsc-audit.mjs` to pull data from Google Search Console and writes a
structured Markdown report (`gsc-audit-report.md`) covering:

- **Sitemap health** — submitted URLs, indexed URLs, errors, warnings
- **Search performance** — clicks, impressions, CTR, avg position (last 28 days)
- **Low CTR pages** — high impression pages with poor click-through (title/meta issues)
- **URL inspection** — per-page indexing status, coverage state, fetch result
- **Mobile usability** — pages failing Google's mobile-friendly checks
- **Rich result issues** — structured data (JSON-LD) errors blocking snippets
- **Prioritised action items** — categorised High / Medium / Low for AI or human review

---

## One-time Setup

### Step 1 — Create a Google Cloud project & enable APIs

1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Create a new project (e.g. `client-name-gsc-audit`)
3. Enable both APIs:
   - **Google Search Console API** → [Enable](https://console.cloud.google.com/apis/library/searchconsole.googleapis.com)
   - **Google Webmasters API** → [Enable](https://console.cloud.google.com/apis/library/webmasters.googleapis.com)

### Step 2 — Create a Service Account

1. IAM & Admin → Service Accounts → **Create Service Account**
2. Give it a name: `gsc-audit-reader`
3. Skip role assignment (GSC controls access separately)
4. Click the account → **Keys** tab → **Add Key** → **JSON**
5. Download the JSON key file — keep it secret, **never commit it**
6. Store it outside the repo or in a git-ignored folder (e.g. `./secrets/`)

### Step 3 — Grant the Service Account access to Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Select the client's property
3. Settings → Users and permissions → **Add User**
4. Enter the service account email (e.g. `gsc-audit-reader@your-project.iam.gserviceaccount.com`)
5. Set permission: **Full** (sufficient for read-only audit access)

### Step 4 — Configure environment variables

Add to `.env.local`:

```bash
GSC_SITE_URL=https://yourclientdomain.com/

# Point to the downloaded service account JSON key file:
GOOGLE_APPLICATION_CREDENTIALS=./secrets/gsc-service-account.json
```

> **Security note:** The `secrets/` folder must be git-ignored. Verify `.gitignore`
> contains `secrets/` before storing any key files there.

---

## Running the audit

```bash
npm run gsc-audit

# Optional overrides:
GSC_DAYS=90 GSC_MAX_URLS=150 GSC_OUTPUT_FILE=reports/audit-march.md npm run gsc-audit
```

The report is written to `gsc-audit-report.md` (git-ignored by default).

---

## Per-project: extend the static pages list

The script inspects URLs found in GSC analytics plus a minimal hardcoded list.
After forking, open `scripts/gsc-audit.mjs` and extend the `staticPages` array
to include all pages that may not yet appear in analytics (newly launched pages,
service pages, location pages, etc.):

```js
const staticPages = [
  baseUrl,
  `${baseUrl}contact`,
  // Add per-project pages:
  `${baseUrl}about`,
  `${baseUrl}services`,
  `${baseUrl}pricing`,
];
```

---

## Reading the report with an AI

Once generated, open the report in Claude Code or paste it into any AI chat.
It is structured so an AI can:

1. Read the **Executive Summary** for a quick count of issues
2. Scan **Action Items** (High → Medium → Low) to prioritise fixes
3. Drill into specific sections (Coverage Errors, Mobile Issues, Low CTR Pages)
4. Map each issue back to a file in `src/app/` or `src/components/` and apply a fix

Example prompt:

> "Here is my Google Search Console audit report. Please fix all High priority
> issues in the codebase, then address the Medium priority ones."

---

## Troubleshooting

| Error | Fix |
| --- | --- |
| `403 User does not have sufficient permission` | Make sure the service account email is added as a user in GSC with Full permission |
| `404 Site not found` | Ensure `GSC_SITE_URL` matches the exact property URL in GSC (including trailing slash) |
| `Could not load the default credentials` | Check that `GOOGLE_APPLICATION_CREDENTIALS` points to a valid, readable JSON key file |
| `Rate limit exceeded` | Lower `GSC_MAX_URLS` or increase `RATE_LIMIT_MS` in the script |
| URL inspection returns `_error` for every URL | The Search Console API URL Inspection requires the **exact** siteUrl that matches the verified property |
