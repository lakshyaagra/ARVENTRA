# Security

Arventra handles personal financial data, so security is treated as a first-class concern rather than an afterthought. This document lists what's implemented and why.

## Transport & Headers

- **Helmet** — sets secure HTTP headers by default (mitigates clickjacking, MIME-sniffing, and other header-based attacks).
- **CORS** — configured explicitly (`credentials: true` server-side, `withCredentials: true` client-side) so cross-origin cookie-based auth works only from allowed origins.

## Authentication & Session Security

- **Password hashing** — bcrypt, 10 salt rounds. Plain-text passwords are never stored.
- **Dual-token model** — short-lived access token (client-held) + httpOnly, `SameSite`-restricted refresh token cook
- **Email verification** and **forgot-password flow** implemented, so account recovery doesn't rely on insecure ad hoc workarounds.

## CSRF Protection

Because the refresh token lives in a cookie, the app is exposed to CSRF unless explicitly protected. CSRF tokens are required on state-changing requests, checked server-side, and rejected if missing or mismatched.

## Rate Limiting

Applied at the API level (login and other sensitive endpoints in particular) to slow down brute-force credential-stuffing attempts.

## Input Handling

- **Sanitization** — request bodies are sanitized to strip/neutralize injection payloads (e.g. NoSQL operator injection, XSS payloads in text fields) before they reach the database or get echoed back to a client.
- **Schema validation middleware** — every module (Goal, Loan, Income, Expense, Asset, Community, etc.) has dedicated create/update validation middleware that runs before the controller, rejecting malformed or out-of-range input with `400` rather than letting it reach Mongoose.

## Authorization (data isolation between users)

The server never trusts a client-supplied `user` field on any write. After the auth middleware attaches `req.user`, every module sets ownership server-side (`req.body.user = req.user.id`) and scopes every read/update/delete query to the authenticated user. A user cannot access another user's goals, loans, income, expenses, assets, notifications, settings, or contact requests by guessing a document ID.

## File Uploads

Images (e.g. goal images) are uploaded via Multer to Cloudinary rather than stored on the app server's filesystem. On update/delete, the old Cloudinary asset is explicitly removed to avoid orphaned files.

## Secrets Management

All secrets (`JWT_SECRET`, database URI, Cloudinary credentials, Gemini API key) are read from environment variables via `.env`, never hardcoded in source.
