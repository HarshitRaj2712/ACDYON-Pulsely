<div align="center">

# ⚡ Pulsely — Resilient Job Listing Ingestion Platform

[![Deployment Status](https://img.shields.io/badge/Production-Live%20Application-10B981?style=for-the-badge&logo=vercel&logoColor=white)](https://acdyon-pulsely2712.vercel.app/)
[![Backend API](https://img.shields.io/badge/Render-API%20Service-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://acdyon-pulsely.onrender.com/)
[![React](https://img.shields.io/badge/React-v18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-Ultra--Glassmorphism-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  A production-grade, fault-tolerant job listing aggregation platform featuring rate-paced ingestion, automated exponential backoff retries, database deduplication, and a high-refraction Green Apple glassmorphic UI.
</p>

</div>

---

## 🌐 Live Production Deployments

| Component | Deployed Live URL | Status |
| :--- | :--- | :--- |
| 🚀 **Web Application (Frontend)** | [https://acdyon-pulsely2712.vercel.app/](https://acdyon-pulsely2712.vercel.app/) | `Active (Vercel)` |
| ⚙️ **REST API Service (Backend)** | [https://acdyon-pulsely.onrender.com/](https://acdyon-pulsely.onrender.com/) | `Active (Render)` |
| 🏥 **API System Health Check** | [https://acdyon-pulsely.onrender.com/api/health](https://acdyon-pulsely.onrender.com/api/health) | `HTTP 200 OK` |

---

## ✨ Key Engineering Features

- **🔌 Modular Adapter-Based Architecture**: Decouples feed parsing logic into dedicated source adapters (`WeworkRemotelyAdapter`, `MockJobAdapter`) implementing a uniform `JobSourceAdapter` interface.
- **🛡️ Fault-Tolerant HTTP Engine**: Bounded requests via `AbortController`, configurable inter-request rate pacing, and jittered exponential backoff retries (`base * 2^attempt + jitter`) strictly for transient errors.
- **⚡ Database Deduplication**: Enforces compound unique indexes (`source + sourceId`) in MongoDB to prevent duplicate record pollution during high-frequency ingestion runs.
- **📊 Source Health State Machine**: Evaluates source reliability (`healthy`, `degraded`, `failed`) dynamically based on consecutive request failures.
- **🍏 Ultra-Glassmorphic Green Apple UI**: Modern light mode interface with top-left & south-right ambient background glow refractions, specular edge reflections, and real-time metric counters.

---

## 🏗️ System Architecture

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

## 🛡️ Failure Modes & Resilience Matrix

| Failure Scenario | System Vulnerability | Pulsely Automated Resilience Response |
| :--- | :--- | :--- |
| **5xx Server Downtime / Outage** | Process termination / corrupt state | `HttpClient` identifies transient error, executes exponential backoff retries (`base * 2^attempt + jitter`). Triggers secondary fallback adapter if max retries exhaust. |
| **429 Rate Limiting Hit** | Sudden IP block or rate ban | Enforces inter-request rate pacing (`REQUEST_DELAY_MS`), applies backoff jitter, and updates source health status to `degraded`. |
| **Malformed Feed Data / Bad HTML** | Ingestion pipeline crash | Normalization layer (`JobNormalizer`) strips dangerous HTML and skips invalid records cleanly without interrupting batch processing. |
| **Duplicate Feed Items** | Database record bloat | Enforces compound unique index (`source + sourceId`) in MongoDB, incrementing `duplicates` metric counter without re-inserting. |

---

## 🔌 REST API Specification

### 1. Fetch Job Listings
`GET /api/jobs`

Returns paginated listings with search and filter capabilities.

**Query Parameters:**
- `page` *(number)*: Page index (default: `1`)
- `limit` *(number)*: Items per page (default: `20`)
- `q` *(string)*: Search term matching title, company, or tech stack
- `source` *(string)*: Filter by source identifier (`weworkremotely`, `mock-sandbox`)
- `employmentType` *(string)*: Filter by employment type (`Full-time`, `Contract`, etc.)
- `location` *(string)*: Filter by location keyword

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "67b612c8a1b2c3d4e5f67890",
      "source": "weworkremotely",
      "sourceId": "wwr-1049281",
      "title": "Senior Full Stack Engineer",
      "company": "Pulsely Labs",
      "location": "Remote",
      "employmentType": "Full-time",
      "url": "https://weworkremotely.com/jobs/sample",
      "postedAt": "2026-08-19T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### 2. Trigger Ingestion Pipeline
`POST /api/ingestion/run`

Triggers an on-demand resilient ingestion run across primary and fallback adapters.

### 3. Get Ingestion Health Status
`GET /api/ingestion/status`

### 4. Health Check
`GET /api/health`

---

## 🛠️ Tech Stack

- **Frontend**: React 18 (Vite), Tailwind CSS (Ultra-Glassmorphism System), Lucide Icons, Axios
- **Backend**: Node.js, Express.js, MongoDB & Mongoose, RSS Parser, Helmet, CORS
- **Testing**: Jest & Supertest

---

## 💻 Local Development Quickstart

### Prerequisites
- **Node.js**: v18+
- **MongoDB**: Running locally or a valid MongoDB Atlas URI

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/HarshitRaj2712/ACDYON-Pulsely.git
cd ACDYON-Pulsely

# 2. Install all dependencies (root, backend, frontend)
npm run install:all

# 3. Start development servers (Backend @ localhost:5000, Frontend @ localhost:5173)
npm run dev
```

---

## 🧪 Automated Test Suite

Run backend integration and unit test suites:

```bash
npm test
```

Test coverage includes:
- HTML tag stripping and normalization
- Deterministic source ID hashing
- Exponential backoff math and error classification
- End-to-end REST API controller contracts

---

## 📖 Architectural Deep-Dive

For complete technical design documents and architectural decision records, see:
- 📑 [Ingestion Architecture & Security Analysis (`DESIGN.md`)](file:///d:/college_projects/ACDYON-Pulsely/DESIGN.md)
- ⚖️ [Architectural Decisions & Trade-Offs (`DECISIONS.md`)](file:///d:/college_projects/ACDYON-Pulsely/DECISIONS.md)

---

## 📄 License

Distributed under the [MIT License](LICENSE).
