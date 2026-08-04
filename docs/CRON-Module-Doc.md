# Cron Jobs Documentation

# Objective

Cron Jobs are background tasks that execute automatically at scheduled times without requiring any user request.

In Project Udaan, Cron Jobs are used to generate financial notifications and reminders automatically, making the application proactive instead of reactive.

---

# Why Do We Need Cron Jobs?

Normally, an API executes only when a client sends a request.

Example:

```
User
   │
GET /dashboard
   │
Backend Executes
```

But some tasks should happen automatically.

Examples:

* EMI reminders
* AI financial insights
* Savings rate monitoring

Instead of waiting for the user to open the application, Cron Jobs execute these tasks automatically.

---

# Folder Structure

```
cron/
│
├── dailyAISmartNotificationCron.js
├── emiReminderJob.js
└── savingsRateAlertCron.js
```

---

# Cron Flow for this Project

```
Server Starts
      │
      ▼
Cron Jobs Registered
      │
      ▼
Node-Cron Scheduler
      │
      ▼
Scheduled Time Arrives
      │
      ▼
Cron Executes
      │
      ▼
Business Logic
      │
      ▼
createNotification()
      │
      ▼
Notification Stored
      │
      ▼
Socket.IO
      │
      ▼
Real-Time Notification
```

---

# 1. EMI Reminder Cron

## Purpose

Automatically remind users one day before their EMI due date.

---

## Schedule

```javascript
cron.schedule("0 8 * * *")
```

Meaning:

```
Every day at 8:00 AM
```

---

## Flow

```
8:00 AM
     │
     ▼
Calculate Tomorrow
     │
     ▼
Find Active Loans
     │
     ▼
EMI Due Tomorrow?
     │
     ▼
createNotification()
```

---

## Steps

### Step 1

Calculate tomorrow's date.

```javascript
const tomorrow = new Date();
```

---

### Step 2

Create tomorrow's ending time.

```javascript
const tomorrowEnd = new Date(tomorrow);
```

---

### Step 3

Find loans.

```javascript
Loan.find({
    status: "active",
    nextDueDate: {
        $gte: tomorrow,
        $lte: tomorrowEnd
    }
})
```

Only active loans due tomorrow are selected.

---

### Step 4

Create notification.

```javascript
await createNotification({
    user: loan.user,
    title: "💳 EMI Reminder",
    message: `Your EMI for "${loan.loanName}" is due tomorrow.`,
    type: "loan"
});
```

---

# 2. Savings Rate Alert Cron

## Purpose

Monitor every user's monthly savings rate.

Generate alerts when savings become unhealthy.

---

## Schedule

```javascript
cron.schedule("0 8 * * *")
```

Runs every day at 8 AM.

---

## Flow

```
Get Users
     │
     ▼
Current Month Income
     │
     ▼
Current Month Expenses
     │
     ▼
Savings Rate
     │
     ▼
Choose Alert Level
     │
     ▼
Already Notified?
     │
     ├── Yes → Skip
     │
     └── No
            │
            ▼
createNotification()
```

---

## Savings Formula

```
Monthly Savings

=

Income

-

Expenses
```

Savings Rate

```
(Savings ÷ Income) × 100
```

---

## Alert Levels

### Overspending

```
Savings < 0
```

Notification

```
❌ Overspending Alert
```

---

### Critical

```
Savings Rate < 10%
```

Notification

```
🚨 Critical Savings Alert
```

---

### Warning

```
Savings Rate < 20%
```

Notification

```
⚠️ Savings Alert
```

---

## Duplicate Prevention

Project Udaan stores

```
lastSavingsAlertMonth

lastSavingsAlertLevel
```

before sending another notification.

Therefore,

the same notification is never sent repeatedly during one month.

---

# 3. Daily AI Smart Notification Cron

## Purpose

Generate one personalized financial insight using Gemini AI.

---

## Schedule

```javascript
cron.schedule("30 9 * * *")
```

Meaning

```
Every day

9:30 AM
```

---

## Flow

```
Users
   │
   ▼
Load Financial Data
   │
   ▼
financialAnalyzer()
   │
   ▼
Prompt Builder
   │
   ▼
Gemini AI
   │
   ▼
JSON Response
   │
   ▼
createNotification()
```

---

## Step 1

Load all financial data.

```
Income

Expense

Goals

Loans

Assets
```

using

```javascript
Promise.all()
```

This improves performance by running all database queries simultaneously.

---

## Step 2

Analyze data.

```javascript
financialAnalyzer()
```

Calculates

* Total Income
* Total Expenses
* Monthly Savings
* Savings Rate
* Goal Progress
* Loan Amount
* Assets
* Financial Health Score

---

## Step 3

Build AI Prompt.

```javascript
aiNotificationPromptBuilder()
```

Creates

* System Prompt
* Financial Context

---

## Step 4

Send to Gemini.

```javascript
aiService()
```

Gemini returns JSON.

Example

```json
{
    "title":"⚠️ Low Savings",
    "message":"Reduce food expenses to improve savings."
}
```

---

## Step 5

Validate Response.

If

```
title == ""

message == ""
```

No notification is created.

---

## Step 6

Store Notification.

```javascript
createNotification()
```

---

## Duplicate Prevention

Project Udaan stores

```
lastAINotificationDate
```

Only one AI notification is generated per user per day.

---

# How Cron Jobs Start

Inside

```
index.js
```

```
require("./cron/savingsRateAlertCron1");

require("./cron/dailyAISmartNotificationCron");

emiReminderJob();
```

As soon as the server starts,

all cron jobs are registered with Node-Cron.

After registration,

Node-Cron waits silently until the scheduled time arrives.

---

# Interview Questions

1. What is a Cron Job?
2. Why are Cron Jobs used in Project Udaan?
3. Which package schedules Cron Jobs?
4. Explain the EMI Reminder Cron flow.
5. How is duplicate AI notification prevented?
6. Why is Promise.all() used in the AI Cron?
7. What is the purpose of financialAnalyzer()?
8. Which Cron Job calculates savings rate?
9. What happens after createNotification() is called?
10. How are Cron Jobs registered when the server starts?

---

# Common Mistakes

❌ Running heavy database queries every minute.

❌ Forgetting duplicate notification checks.

❌ Creating multiple Cron schedules for the same task.

❌ Putting business logic directly inside index.js.

---

# Summary

These background jobs continuously monitor the user's financial data and automatically generate intelligent notifications without requiring any API request from the client.
