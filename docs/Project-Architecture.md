# Architecture

## Overview

Arventra follows a standard **MERN** architecture with a clear separation between the client (React SPA) and the server (Express REST API), communicating over JSON with a dual-token JWT auth layer. A real-time layer (Socket.io), an AI service (Gemini API), and a scheduled job runner (node-cron) sit alongside the core request/response cycle as supporting services. The app is deployed with the frontend on Vercel and the backend on Render, connected through a same-origin API proxy so authentication cookies remain first-party in production.

```
┌─────────────┐   Vercel proxy (/api/*)   ┌──────────────────┐
│   React SPA │ ─────────────────────────▶│   Express API    │
│ (Vercel,    │ ◀─────────────────────────│   (Render,       │
│  Tailwind,  │        HTTPS / JSON        │   Socket.io)     │
│  Axios)     │◀════════════════════════▶ │                  │
└─────────────┘     WebSocket (real-time)  └──────────────────┘
                                                      │
                        ┌─────────────────────────────┼───────────────────────────────┐
                        ▼                              ▼                               ▼
                ┌───────────────┐            ┌──────────────────┐            ┌────────────────┐
                │   MongoDB     │            │   Cloudinary     │            │  Gemini AI API │
                │  (Mongoose)   │            │  (image storage) │            │ (chat/insights)│
                └───────────────┘            └──────────────────┘            └────────────────┘
                        ▲
                        │
                ┌───────────────┐            ┌──────────────────┐
                │  node-cron    │──────────▶│   Brevo API      │
                │(EMI reminders,│            │  (transactional  │
                │savings alerts,│            │  email delivery) │
                │daily AI tips) │            └──────────────────┘
                └───────────────┘
```

## Deployment & Cross-Origin Auth

Frontend and backend live on different domains (`*.vercel.app` and `*.onrender.com`), which normally makes cookie-based auth unreliable — browsers treat a cross-site cookie as third-party and increasingly block it by default. Arventra avoids this with a same-origin proxy rather than relying on cross-site cookie flags alone:

- Vercel rewrites every `/api/*` request to the Render backend server-side (`vercel.json`), so the browser only ever talks to its own origin. `Set-Cookie` responses from the backend are forwarded through transparently, making the refresh-token cookie first-party from the browser's point of view.
- The refresh-token cookie itself still carries `httpOnly`, `secure`, and `sameSite=None` in production as defense-in-depth, but the proxy is what makes login/refresh reliable across browsers and their evolving third-party-cookie policies.
- Backend runs with `NODE_ENV=production` and `app.set('trust proxy', 1)` so it correctly reads the real client IP from Render's reverse proxy — required for `express-rate-limit` to rate-limit per-user rather than per-proxy-IP.

## Request Flow

Every authenticated request follows the same pipeline:

```
Client Request
     │
     ▼
CORS / Helmet / Rate Limiter   (global security middleware)
     │
     ▼
Body Parser / Sanitization
     │
     ▼
Authentication Middleware      (verifies JWT, attaches req.user)
     │
     ▼
Route-specific Validation      (schema validation middleware)
     │
     ▼
Controller                     (business logic)
     │
     ▼
Model (Mongoose)                ──▶ MongoDB
     │
     ▼
Response
```

Ownership is enforced at the controller level: the authenticated user's ID (`req.user.id`) is attached server-side to every document created, and every read/update/delete is scoped to `{ user: req.user.id }`. The client-supplied `user` field, if any, is never trusted — verified via hands-on testing that a second account cannot read, update, or delete another user's records by guessing an ID.

## Authentication & Session Security

- **Dual-token model** — short-lived access token (returned in the response body, held client-side) plus a long-lived, `httpOnly` refresh token (opaque random value, SHA-256 hashed before storage — never a JWT, so a database leak alone can't be used to mint sessions).
- **CSRF protection** — a CSRF token is required on cookie-authenticated endpoints (`refresh-token`, `logout`); requests missing or presenting an invalid token are rejected before reaching the controller.
- **Rate limiting** — applied per-endpoint on `login`, `register`, and `forgot-password` to slow brute-force and credential-stuffing attempts, without permanently locking an account out.
- **Email verification enforced at login** — an account with an unverified email cannot log in; verification status is checked only after password validation to avoid leaking account existence to an unauthenticated caller.

## Backend Module Structure

Each domain module (Goal, Loan, Income, Expense, Asset, Notification, Settings, Contact, Community, Dashboard, Reports, Credit Health, AI) follows a consistent internal structure:

```
module/
├── model.js         # Mongoose schema
├── controller.js     # Business logic (CRUD + module-specific logic)
├── routes.js          # Express route definitions
├── validation.js      # Request validation middleware
```

## Supporting Services

- **AI Service** — builds a prompt from the user's financial context (income, expenses, goals, loans) plus conversation history, sends it to the Gemini API, and stores both the message and a running conversation summary so context persists across sessions without resending the full history each time.
- **Real-Time Notifications (Socket.io)** — pushes notifications to a connected client instantly (e.g. AI insights, alerts) instead of relying solely on the client polling for updates; runs inside the same Express process as the REST API.
- **Cron Jobs** — three scheduled jobs run independently of user requests:
  - EMI Reminder — flags upcoming loan due dates
  - Savings Rate Alert — computes savings rate and raises Warning / Critical / Overspending alerts
  - Daily AI Smart Notification — generates a daily AI-written financial insight per user
- **Transactional Email (Brevo)** — verification, password-reset, and notification emails are sent via Brevo's HTTP API rather than raw SMTP. This followed a real production issue: Render's free tier blocks outbound SMTP ports (25/465/587) entirely, so an SMTP-based mailer (Nodemailer + Gmail) worked locally but silently timed out in production. Brevo sends over HTTPS, sidestepping the port restriction.
- **Aggregation Layer** — Dashboard, Reports, and Credit Health modules do not duplicate data; they compute derived views (net worth, savings, status breakdowns) via MongoDB aggregation pipelines over the same Income/Expense/Asset/Loan/Goal collections.

## Data Ownership Model

Every user-generated document (goals, loans, income, expenses, assets, notifications, settings, contact requests, discussions, comments, likes) stores a `user: ObjectId` reference back to the `User` model. This is the backbone of the authorization model — see [SECURITY.md](./SECURITY.md) for how it's enforced.

## Frontend Structure

React SPA using React Router for navigation and Axios for API calls, styled with Tailwind CSS. State for auth (access token) is held client-side in memory, deliberately not `localStorage`, so it's cleared on a hard refresh; an `AuthInitializer` re-populates it via a silent refresh call against the `httpOnly` cookie on load. A response interceptor transparently retries a request once on `401` after refreshing, rather than immediately logging the user out.