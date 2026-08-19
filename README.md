# Pulsely — Resilient Job Listing Ingestion Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-cyan.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-Ultra--Glassmorphism-38bdf8.svg)](https://tailwindcss.com/)
[![Deployment Status](https://img.shields.io/badge/Production-Live-emerald.svg)](https://acdyon-pulsely2712.vercel.app/)

**Pulsely** is a production-grade, resilient job listing aggregation and ingestion platform. It pulls job listings from authorized public feeds, normalizes them into a unified schema, deduplicates records in MongoDB, monitors source health state, handles failures with exponential backoff and automatic fallback adapters, and presents them in an ultra-glassmorphic React dashboard styled with a Green Apple & Light theme.

---

## 🌐 Live Deployments

- **Live Web Application (Frontend)**: [https://acdyon-pulsely2712.vercel.app/](https://acdyon-pulsely2712.vercel.app/)
- **Production REST API (Backend)**: [https://acdyon-pulsely.onrender.com/](https://acdyon-pulsely.onrender.com/)
- **Health Check Endpoint**: [https://acdyon-pulsely.onrender.com/api/health](https://acdyon-pulsely.onrender.com/api/health)

---

## Architecture Overview

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

External job feeds and web APIs are inherently unpredictable. They suffer from network timeouts, rate limits (HTTP 429), temporary server downtime (HTTP 5xx), schema inconsistencies, and duplicate records. Naive ingestion scripts crash or create corrupted database states under these conditions.

**Pulsely** solves this by implementing a **resilient ingestion architecture** built on rate pacing, timeout bounds, transient error retry with exponential backoff, database-level deduplication, health tracking state, and automatic adapter fallback.

---

## Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS (Custom Green Apple Ultra-Glassmorphism UI)
- **Icons**: Lucide React & Pulsely Pulse Emblem
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB & Mongoose
- **Feed Parser**: `rss-parser`
- **Security**: Helmet, CORS
- **Testing**: Jest & Supertest

---

## Key Features

1. **Adapter-Based Ingestion Architecture**: Modular source architecture supporting primary feeds (`WeworkRemotelyAdapter`) and secondary sandbox fallbacks (`MockJobAdapter`).
2. **Resilient HTTP Engine**:
   - **Timeout Aborts**: `AbortController` bounded timeouts preventing hanging requests.
   - **Rate Limiting & Pacing**: Configurable delay pacing between outbound requests.
   - **Exponential Backoff**: Jittered exponential retries (`base * 2^attempt + random(0..100)`) strictly for transient errors.
3. **Database Deduplication**: Compound unique index (`source + sourceId`) in MongoDB preventing duplicate insertions while tracking metrics.
4. **Source Health Tracking**: Dynamic health state evaluation (`healthy`, `degraded`, `failed`) based on consecutive failure tracking.
5. **Ultra-Glassmorphic Green Apple Dashboard**:
   - Live ambient background refractions (Green Apple top-left & south-right gradients).
   - Live ingestion metrics control panel & manual pipeline trigger.
   - Instant search across job title, company, or tech stack.
   - Filters by location, source, and employment type.
   - Clean skeleton loaders, empty states, and error retry state.

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
- **Response**:
  ```json
  {
    "status": "ok",
    "service": "Pulsely Backend",
    "timestamp": "2026-08-19T23:30:00.000Z",
    "database": "connected"
  }
  ```

---

## Local Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `mongodb://127.0.0.1:27017/pulsely` or MongoDB Atlas connection string)

### Installation
Clone the repository and install all dependencies:

```bash
# Install root, backend, and frontend dependencies
npm run install:all
```

### Environment Configuration
Create `.env` inside `backend/`:

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/pulsely

REQUEST_TIMEOUT_MS=10000
REQUEST_DELAY_MS=1000
MAX_RETRIES=3
BACKOFF_BASE_MS=500

PRIMARY_SOURCE_URL=https://weworkremotely.com/categories/remote-programming-jobs.rss
FALLBACK_SOURCE_URL=https://hnrss.org/jobs
```

### Running Locally
Start backend and frontend services concurrently:

```bash
npm run dev
```

- Frontend App: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## Automated Tests

Run backend unit and integration test suites:

```bash
npm test
```

Tests cover:
- Job normalization & HTML tag stripping
- Deterministic ID hashing
- Error classification & transient retry logic
- API endpoint integration

---

## Environment Variables Reference

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/pulsely` |
| `CLIENT_ORIGIN` | CORS allowed origin | `http://localhost:5173` |
| `REQUEST_TIMEOUT_MS` | Max request timeout before abort | `10000` |
| `REQUEST_DELAY_MS` | Minimum delay between outbound requests | `1000` |
| `MAX_RETRIES` | Max transient error retries | `3` |
| `BACKOFF_BASE_MS` | Base duration for exponential backoff | `500` |
| `PRIMARY_SOURCE_URL` | Primary public RSS feed URL | WeWorkRemotely RSS |

---

## Deployment Configuration

### Backend (Render)
- **Live Endpoint**: [https://acdyon-pulsely.onrender.com/](https://acdyon-pulsely.onrender.com/)
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**: Set `MONGO_URI` (MongoDB Atlas), `CLIENT_ORIGIN`, `NODE_ENV=production`.

### Frontend (Vercel)
- **Live Application**: [https://acdyon-pulsely2712.vercel.app/](https://acdyon-pulsely2712.vercel.app/)
- **Root Directory**: `frontend`
- **Framework Preset**: Vite
- **Environment Variable**: `VITE_API_URL` -> `https://acdyon-pulsely.onrender.com/api`

---

## License

This project is open source and available under the [MIT License](LICENSE).
