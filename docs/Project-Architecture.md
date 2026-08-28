# Architecture

## Overview

Arventra follows a standard **MERN** architecture with a clear separation between the client (React SPA) and the server (Express REST API), communicating over JSON with a JWT-based auth layer. An AI service (Gemini API) and a scheduled job runner (node-cron) sit alongside the core request/response cycle as supporting services.

```
┌─────────────┐        HTTPS / JSON        ┌──────────────────┐
│   React SPA │ ─────────────────────────▶ │   Express API     │
│ (Tailwind,  │ ◀───────────────────────── │   (Node.js)        │
│  Axios)     │                             └──────────────────┘
└─────────────┘                                     │
                                                      │
                        ┌─────────────────────────────┼───────────────────────────┐
                        ▼                              ▼                           ▼
                ┌───────────────┐            ┌──────────────────┐        ┌────────────────┐
                │   MongoDB      │            │   Cloudinary      │        │  Gemini AI API  │
                │  (Mongoose)    │            │  (image storage)   │        │ (chat/insights) │
                └───────────────┘            └──────────────────┘        └────────────────┘
                        ▲
                        │
                ┌───────────────┐
                │  node-cron     │
                │ (EMI reminders,│
                │ savings alerts,│
                │ daily AI tips) │
                └───────────────┘
```

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

Ownership is enforced at the controller level: the authenticated user's ID (`req.user.id`) is attached server-side to every document created, and every read/update/delete is scoped to `{ user: req.user.id }`. The client-supplied `user` field, if any, is never trusted.

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
- **Cron Jobs** — three scheduled jobs run independently of user requests:
  - EMI Reminder — flags upcoming loan due dates
  - Savings Rate Alert — computes savings rate and raises Warning / Critical / Overspending alerts
  - Daily AI Smart Notification — generates a daily AI-written financial insight per user
- **Aggregation Layer** — Dashboard, Reports, and Credit Health modules do not duplicate data; they compute derived views (net worth, savings, status breakdowns) via MongoDB aggregation pipelines over the same Income/Expense/Asset/Loan/Goal collections.

## Data Ownership Model

Every user-generated document (goals, loans, income, expenses, assets, notifications, settings, contact requests, discussions, comments, likes) stores a `user: ObjectId` reference back to the `User` model. This is the backbone of the authorization model — see [SECURITY.md](./SECURITY.md) for how it's enforced.

## Frontend Structure

React SPA using React Router for navigation and Axios for API calls, styled with Tailwind CSS. State for auth (access token) is held client-side; the refresh token lives in an httpOnly cookie, invisible to JavaScript.