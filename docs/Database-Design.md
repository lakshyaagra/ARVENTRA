# Database

MongoDB with Mongoose ODM. Every user-owned collection stores a `user: ObjectId` field (`ref: "User"`, `required: true`) that is set server-side from `req.user.id` after authentication — never trusted from client input. This is the foundation of the app's authorization model (see [SECURITY.md](./SECURITY.md)).

## User

| Field | Type | Required |
|---|---|---|
| name | String | Yes |
| email | String | Yes (unique) |
| password | String (hashed, bcrypt) | Yes, min length 7 |

## Goal

| Field | Type | Required | Default |
|---|---|---|---|
| goalName | String | Yes | — |
| targetAmount | Number | Yes | — |
| currentAmount | Number | No | 0 |
| priority | String | No | medium |
| category | String | No | other |
| deadline | Date | No | — |
| description | String | No | — |
| status | String | No | active |
| image | String | No | — |
| publicId | String | No | — |
| user | ObjectId → User | Yes | — |

## Loan

Fields: `loanName`, `lender`, `principalAmount`, `outstandingAmount`, `interestRate`, `loanTerm`, `loanType`, `emiAmount`, `nextDueDate`, `notes`, `status`, `user`.
`status` is managed automatically based on due dates and outstanding balance rather than set directly by the client.

## Income

Fields: `incomeSource`, `amount`, `category`, `paymentMethod`, `receivedDate`, `notes`, `user`.

## Expense

Fields: `expenseName`, `amount`, `category`, `paymentMethod`, `expenseDate`, `notes`, `user`.

## Asset

Fields: `assetName`, `category`, `currentValue`, `purchaseValue`, `purchaseDate`, `institution`, `notes`, `user`.

## Notification

```
Notification
├── user
├── title
├── message
├── type
├── isRead
├── createdAt
└── updatedAt
```

## Settings

One document per user, created lazily on first access.

```
Settings
├── user
├── appearance
│    └── theme
├── notifications
│    ├── emiReminder
│    ├── goalReminder
│    ├── monthlyReport
│    ├── communityNotification
│    └── aiRecommendation
├── financial
│    ├── currency
│    └── salaryDay
├── ai
│    ├── enableAI
│    ├── dailySummary
│    └── weeklyInsights
├── language
├── createdAt
└── updatedAt
```

## Contact

```
Contact
├── user
├── subject
├── message
├── status
├── createdAt
└── updatedAt
```

## Community — Discussion / Comment / Like

Three related collections:
- **Discussion** — the top-level post
- **Comment** — belongs to a Discussion, has its own CRUD and validation
- **Like** — join-style record linking a user to a discussion, with a **unique constraint** on `(user, discussion)` so a user can only like a given discussion once (toggling re-runs the same endpoint to like/unlike).

## AI Conversation

Stores per-user chat history plus a **running conversation summary** (regenerated periodically rather than resending full history on every AI call) so the AI has long-term context without ballooning prompt size on each request.

## Derived / Computed Data (not stored)

The following are **not** separate collections — they're computed on read via MongoDB aggregation pipelines over Income, Expense, Asset, Loan, and Goal:

- **Dashboard** — net worth, savings, goal/loan status breakdowns, recent activity
- **Reports** — summary, expense-by-category, monthly income/expense trends, loan/goal status
- **Credit Health** — net worth, savings rate, debt-to-income ratio, asset-to-loan ratio, health status

Keeping these as computed views (rather than duplicated/cached data) avoids sync bugs between raw records and derived numbers.

## Relationships Summary

```
User 1───* Goal
User 1───* Loan
User 1───* Income
User 1───* Expense
User 1───* Asset
User 1───* Notification
User 1───1 Settings
User 1───* Contact
User 1───* Discussion
User 1───* Comment
User 1───* Like  (unique per user+discussion)
User 1───* AIConversation
```