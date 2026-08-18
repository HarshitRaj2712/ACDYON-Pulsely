# Ingestion Architecture & Security Analysis — JobPulse

> **Note**: This is a technical design and architectural analysis document. JobPulse does **not** implement anti-bot evasions, CAPTCHA bypasses, or unauthorized scraping routines. The live deployed demo operates exclusively on authorized public RSS feeds and sandbox APIs.

---

## 1. Detection Surface Analysis

Automated HTTP clients and headful browser automation scripts expose distinct fingerprints across network, browser runtime, and behavioral dimensions when interacting with protected commercial platforms (e.g. LinkedIn, Indeed, Naukri).

### Fingerprint Detection Vectors
1. **TLS / JA3 Fingerprint**: Custom HTTP clients (such as standard Axios or Node `http` module) use default OpenSSL cipher suites that differ from Chrome/Firefox TLS handshakes (`JA3` / `JA4` signatures).
2. **HTTP/2 Frame Settings**: Browser engines transmit specific HTTP/2 pseudo-header order (`:method`, `:authority`, `:scheme`, `:path`) and client `SETTINGS` frames that raw script connections lack.
3. **Headless Browser Runtime Artifacts**:
   - `navigator.webdriver` set to `true`.
   - Missing or non-standard `navigator.plugins`, `navigator.languages`, or `window.chrome`.
   - Broken WebGL / Canvas rendering footprints or static GPU vendor strings (e.g. `SwiftShader`).
4. **Request Timing & Behavior Patterns**:
   - Sub-millisecond consecutive requests without human-like DOM interaction (mouse movement, scroll events).
   - Uniform inter-request delays (lack of statistical variance/jitter).
5. **Header Inconsistencies**:
   - Missing standard modern headers (`Sec-Ch-Ua`, `Sec-Fetch-Dest`, `Sec-Fetch-Mode`, `Sec-Fetch-Site`).
   - Mismatched `User-Agent` string with client capabilities.

### How JobPulse Conceptually Accounts for Detection Surface
Even though JobPulse operates on safe public feeds:
- **Rate-Limiting & Pacing**: `HttpClient` enforces configurable delays (`REQUEST_DELAY_MS`) between requests to avoid burst patterns.
- **Jitter Backoff**: Retries use randomized exponential backoff (`base * 2^attempt + jitter`) to eliminate fixed-frequency request signatures.
- **Controlled User-Agents**: Standardized client identification headers expressing transparent platform identity (`JobPulse-Ingestion-Bot/1.0`).

---

## 2. Production Ingestion Strategy

A production-grade ingestion platform pulling data across multiple providers requires structured scaling and failover strategy without violating terms of service.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Ingestion Controller                        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
                ┌──────────────────────────────┐
                │   Adapter Pool Manager       │
                └──────────────┬───────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌─────────────────────────┐           ┌─────────────────────────┐
│ Primary Provider        │           │ Secondary Provider      │
│ (RSS / Authorized API)  │           │ (Fallback / Sandbox API)│
└───────────┬─────────────┘           └───────────┬─────────────┘
            │                                     │
            ▼                                     ▼
┌─────────────────────────┐           ┌─────────────────────────┐
│ Rate Limit & Timeout    │           │ Rate Limit & Timeout    │
│ (AbortController)       │           │ (AbortController)       │
└───────────┬─────────────┘           └───────────┬─────────────┘
            │                                     │
            │ (On Failure / Timeout)              │
            └─────────────────► Fallback Switched ┼────────────────► Store Data
```

### Strategy Principles
1. **Decoupled Source Adapters**: Source-specific parsing is isolated inside dedicated adapter classes (`WeworkRemotelyAdapter`, `MockJobAdapter`) implementing a uniform `JobSourceAdapter` interface.
2. **Dynamic Fallback Execution**: If a primary source endpoint fails or returns transient errors, the pipeline automatically switches execution to a secondary fallback adapter without interrupting service availability.
3. **Session & Identity Isolation**: Requests maintain isolated state per provider, eliminating cross-provider cookies or shared headers.

---

## 3. Pipeline Resilience

JobPulse protects data integrity and system uptime against common external integration hazards:

| Hazard Scenario | Pipeline Resilience Response |
| :--- | :--- |
| **Source Offline / Server Error (5xx)** | `HttpClient` catches transient status, applies exponential backoff retry up to `MAX_RETRIES`. If retries exhaust, updates source health to `failed` and triggers fallback adapter. |
| **Rate Limit Triggered (429)** | Respects response status, pauses request queue, applies backoff jitter, and logs source health state degradation (`degraded`). |
| **Source Markup / Structure Change** | Normalization layer (`JobNormalizer`) isolates field extraction. Malformed records missing mandatory fields are skipped cleanly (`metrics.failed++`) while valid records continue ingestion. |
| **Empty Payload Returned** | Does not assume zero total jobs. Logs zero-count metrics, keeps health status monitored, and prevents database wipeouts. |
| **Duplicate Listings** | Enforces compound unique index (`source + sourceId`) in MongoDB. Identical listings increment `duplicates` counter without duplicate record insertion. |

---

## 4. Ethical Boundaries & ToS Line (Where We Stop)

Responsibility and legal compliance are strict architectural boundaries in JobPulse:

> [!CAUTION]
> **Definitive Ethical Line**:
> - **No CAPTCHA Bypass**: We explicitly refuse to integrate third-party CAPTCHA solving services or OCR evasions.
> - **No Authentication / Access-Control Circumvention**: We do not attempt to log into private LinkedIn, Indeed, or password-protected employer accounts.
> - **No Anti-Bot Spoofing**: We do not use residential proxy pools or TLS fingerprint spoofing libraries to bypass active platform blocks.
> - **Strict robots.txt & ToS Respect**: Ingestion is limited to public RSS feeds, authorized developer APIs, or self-controlled sandbox endpoints.

By building resilient ingestion on authorized endpoints, JobPulse demonstrates production software engineering principles while adhering strictly to ethical standards.
