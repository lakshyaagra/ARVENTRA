# AI Module Documentation

# Objective

The AI Module acts as the intelligent financial assistant of Project Udaan.

Instead of giving generic chatbot responses, it analyzes the user's complete financial profile and provides personalized financial guidance based on:

- Income
- Expenses
- Goals
- Loans
- Assets
- Financial Health Score
- Previous AI Conversations

The AI also remembers previous conversations by maintaining a summarized memory, allowing future responses to remain personalized while keeping API costs low.

---

# Architecture

```
User
   │
   ▼
POST /ai/chat
   │
   ▼
Authentication
   │
   ▼
Validation
   │
   ▼
AI Controller
   │
   ├─────────────► Fetch Financial Data
   │
   ├─────────────► Financial Analyzer
   │
   ├─────────────► Prompt Builder
   │
   ├─────────────► Previous Conversation
   │
   ├─────────────► Gemini API
   │
   ├─────────────► Save Conversation
   │
   ├─────────────► Update Summary (every 10 messages)
   │
   ▼
Response
```

---

# Folder Structure

```
controllers/
    aiController.js

models/
    AIConversation.js

services/
    aiService.js
    financialAnalyzer.js
    promptBuilder.js

middleware/
    validateAIRequest.js

routes/
    ai.js
```

---

# Route

```
POST /ai/chat
```

Protected Route

Requires JWT Authentication.

---

# Request Body

```json
{
    "message":"How can I improve my savings?"
}
```

---

# Response

```json
{
    "success": true,
    "reply": "..."
}
```

---

# AI Flow

```
Receive User Question
        │
        ▼
Fetch Financial Records
        │
        ▼
Analyze Financial Health
        │
        ▼
Build System Prompt
        │
        ▼
Load Conversation Summary
        │
        ▼
Load Recent Messages
        │
        ▼
Generate Gemini Response
        │
        ▼
Store Conversation
        │
        ▼
Update Summary (Every 10 Messages)
        │
        ▼
Return Reply
```

---

# AI Controller

Responsible for:

- Validating request
- Fetching all financial records
- Creating financial analysis
- Loading AI conversation
- Sending request to Gemini
- Saving conversation history
- Updating conversation summary
- Returning AI response

---

## Step 1

Receive User Message

```javascript
req.body.message
```

---

## Step 2

Load Financial Data

The controller fetches all user financial information simultaneously using Promise.all().

Models used:

```
Income
Expense
Goal
Loan
Asset
```

---

## Step 3

Financial Analysis

The fetched data is passed to

```
financialAnalyzer()
```

which calculates:

- Monthly Income
- Monthly Expenses
- Savings
- Savings Rate
- Goal Progress
- Loan Amount
- Asset Value
- Financial Health Score
- Financial Status

---

## Step 4

Load Conversation

```
AIConversation.findOne()
```

If no conversation exists,

create one automatically.

---

## Step 5

Prompt Builder

The Prompt Builder creates two sections.

### 1. System Prompt

Contains AI behaviour.

Examples:

- Professional Financial Advisor
- Never invent numbers
- Explain reasoning
- Give step-by-step guidance
- Encourage long-term wealth creation

---

### 2. Financial Context

Contains user's current financial data.

Example

```
Monthly Income

Monthly Expenses

Savings Rate

Goal Progress

Financial Health Score

Assets

Loans
```

---

## Step 6

Recent Conversation

Instead of sending all previous chats,

only the latest

```
10 messages
```

as history are sent.

```
conversation.messages.slice(-10)
```

This keeps context while reducing tokens.

---

## Step 7

Conversation Summary

The controller also sends

```
conversation.summary
```

to Gemini.

The summary contains important long-term memory such as

- Goals
- Spending habits
- Income
- Investments
- Risk profile
- Preferences

instead of every previous message.

---

## Final Prompt

Gemini receives

```
System Prompt

Financial Context

Conversation Summary

Last 10 Messages

Current User Question
```

---

# AI Service

Responsible for communicating with Gemini.

Uses

```
@google/genai
```

Model

```
gemini-3.6-flash
```

Current Configuration

```javascript
temperature

topP

topK

maxOutputTokens
```

The AI Service converts messages into Gemini's required format before making the request.

---

# Prompt Builder

Generates

```
System Prompt
```

and

```
Financial Context
```

The controller combines them with

- Conversation Summary
- Chat History
- Current Question

---

# Financial Analyzer

Purpose

Converts raw database records into financial insights.

Input

```
Income

Expense

Goal

Loan

Asset
```

Output

```
Monthly Income

Monthly Expenses

Savings

Savings Rate

Goal Progress

Outstanding Loans

Assets

Financial Health Score

Health Status
```

---

# Financial Health Calculation

Savings

```
30 Points
```

Goal Progress

```
20 Points
```

Loans

```
20 Points
```

Assets

```
30 Points
```

Total

```
100 Points
```

---

# Health Status

```
80+

Excellent
```

```
60+

Good
```

```
40+

Average
```

```
Below 40

Needs Improvement
```

---

# AI Conversation Model

Stores

```
User

Messages

Conversation Summary

Title

Created At

Updated At
```

---

# Message Schema

Each message stores

```
Role

Content

Timestamp
```

Roles

```
user

assistant
```

---

# Conversation Summary

Purpose

Instead of sending hundreds of previous messages,

the AI stores one compressed memory.

Example

```
User prefers SIP investments.

Risk appetite is moderate.

Currently saving for higher education.

Has one active education loan.

Prefers monthly budgeting.
```

---

# Summary Update Logic

Summary generation starts only after

```
20 messages
```

After that,

summary updates every

```
10 messages
```

Condition

```javascript
if(
messages.length >=20 &&
messages.length %10===0
)
```

Meaning

```
20

30

40

50

60
```

only.

---

# Summary Prompt

Gemini receives

```
Current Summary

Latest 20 Messages
```

and updates memory.

Maximum

```
300 words
```

Summary includes

- Goals
- Spending Behaviour
- Assets
- Loans
- Investments
- Risk Appetite
- Preferences
- Important Financial Facts

Summary ignores

- Greetings
- Small Talk
- Temporary Discussion

---

# Why Summary Exists

Without Summary

```
Every Request

↓

Entire Conversation

↓

Thousands of Tokens

↓

Slow

↓

Expensive
```

With Summary

```
Summary

+

Last 10 Messages

↓

Very Fast

↓

Very Cheap

↓

Still Personalized
```

---

# Validation

Middleware

```
validateAIRequest
```

Checks

Message Required

Minimum Length

```
10
```

Maximum Length

```
1000
```

---

# Database Models Used

```
Income

Expense

Goal

Loan

Asset

AIConversation
```

---

# Error Handling

Possible Errors

Missing Message

Gemini Failure

Database Failure

Authentication Failure

Validation Failure

Every error returns

```json
{
    "success": false,
    "message": "..."
}
```

---

# Advantages

✅ Personalized Financial Advice

✅ Financial Health Analysis

✅ Conversation Memory

✅ Token Optimization

✅ Fast Responses

✅ Long-term Context

✅ Easily Extendable

---

# Interview Questions

1. Why do we use Prompt Builder?
2. What is the purpose of Financial Analyzer?
3. Why is Conversation Summary required?
4. Why do we update summary every 10 messages?
5. What does AI Service do?
6. Why use Promise.all() in the controller?
7. What are the advantages of conversation memory?

---

# Summary

The AI Module transforms Project Udaan from a traditional finance application into an intelligent personal financial advisor. It combines real financial data, conversation memory, and Google's Gemini model to provide personalized, context-aware, and efficient financial guidance. By using financial analysis, prompt engineering, recent chat history, and periodic conversation summarization, the module delivers high-quality responses while minimizing API token usage and maintaining long-term conversational context.