# Architectural Decisions & Trade-Offs — JobPulse

## 1. Why This Ingestion Strategy Over the Obvious Alternative?

Instead of scraping protected commercial platforms (e.g. LinkedIn or Indeed) via headless browsers—which introduces high fragility, potential legal/ToS violations, IP blocking, and constant maintenance overhead—we chose to build an **adapter-based architecture utilizing authorized public RSS feeds (WeWorkRemotely) and an internal Sandbox Mock fallback**.

### Core Engineering Advantages:
- **Zero Legal & Security Risk**: Ingests data through legal, publicly accessible endpoints.
- **Production Resilience Focus**: Allows us to demonstrate true architectural resilience (rate-limiting, timeout aborts, exponential backoff, health tracking, deduplication) without fighting anti-bot defenses.
- **Deterministic & High Performance**: Parsing structured RSS XML is orders of magnitude faster and less resource-intensive than executing JavaScript-heavy web scrapers.

---

## 2. One Trade-off Made Under the Time Limit

### The Trade-off: Modular Resilience Architecture Over Multiple Source Adapters
Under the project time limit, we prioritized building a robust, production-ready ingestion pipeline (with Mongoose deduplication, exponential backoff retries, health tracking models, fallback failover, and a full glassmorphic React dashboard) over adding dozens of different external job board adapters.

### What Would Be Implemented With One Additional Week:
1. **Cron-Based Scheduled Ingestion**: Integrate `node-cron` or BullMQ with Redis to schedule automated background runs every $N$ hours.
2. **Additional Authorized Adapters**: Implement additional public adapters for Hacker News Jobs (`hnrss.org`) and Remotive API (`remotive.com/api`).
3. **Advanced Normalization Rules**: Expand salary range parsing and tech stack tag extraction from job description text.
4. **WebSocket Live Status Streaming**: Stream ingestion pipeline progress to the React UI in real-time via Socket.io.

---

## 3. AI Usage & Verification Transparency

AI assistance (Gemini 3.6 Flash / Pair Programming Agent) was utilized during the development of JobPulse for:
- **Boilerplate & Test Generation**: Accelerating initial setup of Express route handlers, Mongoose schemas, and Jest unit test skeletons.
- **Glassmorphism CSS Styling**: Tailoring glass visual utility classes (`backdrop-blur`, translucent border tokens) in Tailwind CSS.

### Personally Verified & Code Audited:
- **Resilience Math & Logic**: Hand-verified `HttpClient` backoff timing calculation (`base * 2^attempt + jitter`) and error classification logic (`4xx` vs `5xx`).
- **Compound Deduplication Index**: Verified Mongoose schema `{ source: 1, sourceId: 1 }` unique index behavior to ensure zero duplicate database insertions.
- **Adapter Design Pattern**: Verified contract enforcement in `BaseAdapter`, ensuring subclass separation of `fetchJobs()` and `normalizeJob()`.
