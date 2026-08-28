# API Reference

Base URL: `/api` (prepend to every path below unless noted).

All endpoints except `POST /auth/register` and `POST /auth/login` require authentication — see [AUTH.md](./AUTH.md). All list endpoints are scoped to the authenticated user; no endpoint returns another user's data.

---

## Auth

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Create a new user account |
| POST | `/auth/login` | Log in, receive access token + refresh cookie |
| POST | `/auth/refresh` | Exchange refresh cookie for a new access token |
| POST | `/auth/logout` | Invalidate session |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/verify-email` | Verify email address |

Full flow detail: [AUTH.md](./AUTH.md).

---

## Goals

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/goals` | Create goal (multipart, optional image) |
| GET | `/goals` | List goals — supports search, filter, sort, pagination |
| GET | `/goals/:id` | Get one goal |
| PUT | `/goals/:id` | Update goal (partial, optional image replace) |
| DELETE | `/goals/:id` | Delete goal (and its Cloudinary image, if any) |

**Query params:** `search`, `status`, `sort`, `order`, `page`, `limit`
Example: `GET /goals?search=laptop&status=active&sort=goalName&order=asc&page=1&limit=10`

---

## Loans

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/loans` | Create loan |
| GET | `/loans` | List loans — supports search, filter, sort, pagination |
| GET | `/loans/:id` | Get one loan |
| PUT | `/loans/:id` | Update loan |
| DELETE | `/loans/:id` | Delete loan |

**Query params:** `search`, `status`, `sort`, `order`, `page`, `limit`
Loan `status` is managed automatically based on due dates and outstanding amount (see module notes).

---

## Income

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/incomes` | Create income entry |
| GET | `/incomes` | List income — supports search, filter, sort, pagination |
| GET | `/incomes/:id` | Get one income entry |
| PUT | `/incomes/:id` | Update income entry |
| DELETE | `/incomes/:id` | Delete income entry |

**Query params:** `search`, `category`, `sort`, `order`, `page`, `limit`

---

## Expenses

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/expenses` | Create expense entry |
| GET | `/expenses` | List expenses — supports search, filter, sort, pagination |
| GET | `/expenses/:id` | Get one expense entry |
| PUT | `/expenses/:id` | Update expense entry |
| DELETE | `/expenses/:id` | Delete expense entry |

**Query params:** `search`, `category`, `sort`, `order`, `page`, `limit`

---

## Assets

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/assets` | Create asset |
| GET | `/assets` | List assets — supports search, filter, sort, pagination |
| GET | `/assets/:id` | Get one asset |
| PUT | `/assets/:id` | Update asset |
| DELETE | `/assets/:id` | Delete asset |

**Query params:** `search`, `category`, `sort`, `order`, `page`, `limit`

---

## Notifications

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/notifications` | Get all notifications |
| PATCH | `/notifications/:id/read` | Mark one notification as read |
| PATCH | `/notifications/read-all` | Mark all notifications as read |
| DELETE | `/notifications/:id` | Delete one notification |
| DELETE | `/notifications` | Delete all notifications |

---

## Settings

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/settings` | Get current user's settings |
| PATCH | `/settings` | Update settings (appearance, notifications, financial, AI, language) |

One settings document exists per user, created on first access.

---

## Contact

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/contact` | Submit a contact/support request |
| GET | `/contact` | Get my contact requests |
| DELETE | `/contact/:id` | Delete a contact request |

---

## Dashboard

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/dashboard` | Aggregated financial overview: net worth, savings, goal/loan status breakdowns, recent activity |

---

## Reports

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/reports/summary` | Overall financial summary (supports `month`, `year`) |
| GET | `/reports/expense-category` | Expense breakdown by category |
| GET | `/reports/monthly-expense` | Monthly expense trend (supports `year`) |
| GET | `/reports/monthly-income` | Monthly income trend |
| GET | `/reports/loan-status` | Loan status breakdown |
| GET | `/reports/goal-status` | Goal status breakdown |

---

## Credit Health

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/credit-health` | Computed credit health score and financial ratios |

**Example response:**
```json
{
  "success": true,
  "creditHealth": {
    "totalAssets": 2500000,
    "totalOutstandingLoans": 500000,
    "totalIncome": 1200000,
    "totalExpense": 800000,
    "netWorth": 2000000,
    "savings": 400000,
    "savingsRate": 33.33,
    "debtToIncomeRatio": 0.42,
    "assetLoanRatio": 5,
    "activeLoans": 2,
    "healthStatus": "Good"
  }
}
```

---

## AI Chat

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/ai/chat` | Send a message to the AI financial assistant |

**Request:**
```json
{ "message": "How can I improve my savings?" }
```
**Response:**
```json
{ "success": true, "reply": "..." }
```
The AI response is generated using the user's actual financial context (income, expenses, goals, loans) plus a running conversation summary, not just the raw message.

---

## Calculators

Stateless, no auth-scoped data — pure computation endpoints.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/calculators/simple-interest` | Simple interest calculator |
| GET | `/calculators/compound-interest` | Compound interest calculator |
| GET | `/calculators/roi` | ROI calculator |
| GET | `/calculators/fd` | Fixed Deposit calculator |
| GET | `/calculators/rd` | Recurring Deposit calculator |
| GET | `/calculators/sip` | SIP calculator |
| GET | `/calculators/lumpsum` | Mutual Fund Lumpsum calculator |
| GET | `/calculators/emi` | EMI calculator |
| GET | `/calculators/retirement` | Retirement calculator |
| GET | `/calculators/income-tax` | Income Tax calculator |

---

## Community

Base path: `/community`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/community` | Create discussion |
| GET | `/community` | Get discussions |
| PATCH | `/community/:id` | Update discussion |
| DELETE | `/community/:id` | Delete discussion |
| POST | `/community/:id/comments` | Create comment |
| GET | `/community/:id/comments` | Get comments |
| PATCH | `/community/comments/:id` | Update comment |
| DELETE | `/community/comments/:id` | Delete comment |
| POST | `/community/:id/like` | Like/unlike a discussion |

---

## Common Response Shape

Success:
```json
{ "success": true, "data": { } }
```
Failure:
```json
{ "success": false, "message": "..." }
```

## Common Status Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Validation error |
| 401 | Missing/invalid/expired auth |
| 403 | Authenticated but not authorized (e.g. accessing another user's resource) |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Server error |