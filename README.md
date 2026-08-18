# JobPulse — Resilient Job Listing Ingestion Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-cyan.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-Glassmorphism-38bdf8.svg)](https://tailwindcss.com/)

**JobPulse** is a resilient, production-grade job listing aggregation and ingestion platform. It pulls job listings from authorized public sources, normalizes them into a unified schema, deduplicates records in MongoDB, tracks source health, handles failures with exponential backoff and automatic fallback adapters, and presents them in a React glassmorphic dashboard.

---

## Architecture

```text
                ┌─────────────────────┐
                │   Public Job Source │
                │  (WeWorkRemotely)   │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │   Source Adapter    │
                │                     │
                │ fetchJobs()         │
                │ normalizeJob()      │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ Ingestion Service   │
                │                     │
                │ validation          │
                │ deduplication       │
                │ rate limiting       │
                │ retry / backoff     │
                └──────────┬──────────┘
                           │
                    ┌──────┴──────┐
                    │             │
                    ▼             ▼
             ┌────────────┐ ┌────────────┐
             │  MongoDB   │ │ Source     │
             │ Database   │ │ Health Log │
             └─────┬──────┘ └────────────┘
                   │
                   ▼
            ┌───────────────┐
            │ Express REST  │
            │ API           │
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │ React Client  │
            │ Job Dashboard │
            └───────────────┘
```

---

## Problem Statement

External job feeds and web APIs are inherently unpredictable. They suffer from network timeouts, rate limits (HTTP 429), temporary server downtime (HTTP 5xx), schema inconsistencies, and duplicate records. Simple ingestion scripts crash or create corrupted database states under these conditions.

JobPulse solves this by implementing a **resilient ingestion architecture** built on rate pacing, timeout bounds, transient error retry with exponential backoff, database-level deduplication, health tracking state, and automatic adapter fallback.

---

## Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS (Custom Glassmorphism UI System)
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB & Mongoose
- **Feed Parser**: `rss-parser`
- **Security**: Helmet, CORS
- **Testing**: Jest & Supertest

---

## Key Features

1. **Adapter-Based Ingestion**: Modular source architecture supporting primary feeds (`WeworkRemotelyAdapter`) and secondary sandbox fallbacks (`MockJobAdapter`).
2. **Resilient HTTP Engine**:
   - **Timeout Aborts**: `AbortController` bounded timeouts preventing hanging requests.
   - **Rate Limiting**: Configurable pacing delay between requests.
   - **Exponential Backoff**: Jittered exponential retries (`base * 2^attempt + random(0..100)`) strictly for transient errors.
3. **Database Deduplication**: Compound index (`source + sourceId`) in MongoDB preventing duplicate insertions while tracking metrics.
4. **Source Health Tracking**: Dynamic health state evaluation (`healthy`, `degraded`, `failed`) based on consecutive failures.
5. **Glassmorphic React Dashboard**:
   - Live ingestion metrics panel & manual run trigger button.
   - Search by job title, company, or keyword.
   - Filters by location, source, and employment type.
   - Clean loading skeletons, empty state, and error handling.

---

## Ingestion Pipeline Flow

```text
Source Endpoint
       │
       ▼
Fetch Raw Data (Resilient HTTP + Timeout)
       │
       ▼
Validate Response Payload
       │
       ▼
Parse Feed / Items
       │
       ▼
Normalize Attributes & Sanitize HTML
       │
       ▼
Validate Required Schema Fields
       │
       ▼
Deduplicate against MongoDB Compound Index ({ source, sourceId })
       │
       ▼
Insert New / Update Modified / Count Duplicate
       │
       ▼
Record Health Metrics & Return Statistics
```

---

## Resilience Capabilities

| Mechanism | Implementation Details |
| :--- | :--- |
| **Timeout Pacing** | Bounded requests via `REQUEST_TIMEOUT_MS` (default 10000ms). |
| **Rate Limiting** | Enforces `REQUEST_DELAY_MS` (default 1000ms) between outbound calls. |
| **Transient Retries** | Retries network errors, timeouts, 5xx, and 429s. Skips 4xx auth/client errors. |
| **Exponential Backoff** | `BACKOFF_BASE_MS * 2^(attempt - 1) + jitter`. |
| **Automatic Fallback** | If primary source fails retries, pipeline executes secondary fallback adapter automatically. |
| **Health Monitoring** | Updates source status to `degraded` after 1 failure, and `failed` after 3 consecutive failures. |

---

## REST API Reference

### 1. Get Job Listings
- **GET** `/api/jobs`
- **Query Parameters**:
  - `page` (default: 1)
  - `limit` (default: 20)
  - `q` (Search query across title, company, description)
  - `location` (e.g. `Remote`)
  - `source` (e.g. `weworkremotely`)
  - `employmentType` (e.g. `Full-time`)
- **Response**:
  ```json
  {
    "success": true,
    "data": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
  ```

### 2. Trigger Pipeline Ingestion
- **POST** `/api/ingestion/run`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "usedFallback": false,
      "metrics": {
        "source": "weworkremotely",
        "fetched": 30,
        "inserted": 22,
        "updated": 0,
        "duplicates": 8,
        "failed": 0,
        "durationMs": 1420
      }
    }
  }
  ```

### 3. Get Ingestion Health Status
- **GET** `/api/ingestion/status`

### 4. Health Check
- **GET** `/api/health`

---

## Local Setup & Quickstart

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `mongodb://127.0.0.1:27017/jobpulse` or MongoDB Atlas URI)

### Installation
Clone the repository and install all dependencies:

```bash
# Install root, backend, and frontend dependencies
npm run install:all
```

### Environment Setup
Create `.env` inside `backend/`:

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/jobpulse

REQUEST_TIMEOUT_MS=10000
REQUEST_DELAY_MS=1000
MAX_RETRIES=3
BACKOFF_BASE_MS=500

PRIMARY_SOURCE_URL=https://weworkremotely.com/categories/remote-programming-jobs.rss
FALLBACK_SOURCE_URL=https://hnrss.org/jobs
```

### Running Locally
Start both backend and frontend concurrently:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## Running Automated Tests

Run backend unit and integration tests:

```bash
npm test
```

Tests cover:
- Job normalization & HTML stripping
- Deterministic ID hashing
- Error classification & transient retry logic

---

## Environment Variables Reference

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/jobpulse` |
| `CLIENT_ORIGIN` | CORS allowed origin | `http://localhost:5173` |
| `REQUEST_TIMEOUT_MS` | Max request timeout before abort | `10000` |
| `REQUEST_DELAY_MS` | Minimum delay between outbound requests | `1000` |
| `MAX_RETRIES` | Max transient error retries | `3` |
| `BACKOFF_BASE_MS` | Base duration for exponential backoff | `500` |
| `PRIMARY_SOURCE_URL` | Primary public RSS feed URL | WeWorkRemotely RSS |

---

## Deployment Guide

### Backend (Render / Railway)
1. Set root directory to `backend`.
2. Build command: `npm install`
3. Start command: `npm start`
4. Configure environment variables in dashboard (including `MONGO_URI` pointing to MongoDB Atlas).

### Frontend (Vercel)
1. Set root directory to `frontend`.
2. Framework preset: Vite
3. Environment Variable: `VITE_API_URL` -> Production backend URL.

---

## Limitations & Future Improvements

### Limitations
- Ingestion runs on demand or when manually triggered (no background daemon without external cron).
- Relies on structured RSS fields; unformatted free-text fields require heuristic extraction.

### Future Improvements
1. **Background Cron Service**: Integrate `node-cron` or Redis queues for background ingestion.
2. **Salary Extraction Engine**: NLP regex parser for extracting min/max salary ranges.
3. **Realtime WebSockets**: Push ingestion metrics directly to connected clients via Socket.io.
