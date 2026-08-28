# 🚀 ARVENTRA

Arventra is a personal finance and credit mentorship platform built to help users track their income, expenses, assets, loans, and financial goals in one place — while an integrated AI layer offers personalized financial guidance and a computed "Credit Health Score" gives users a single, actionable view of their financial standing.

---

## Why Arventra

Most personal finance apps stop at "track your spending." Arventra goes further:

- **Full financial picture** — income, expenses, assets, and loans are tracked as first-class, related modules, not isolated logs.
- **Credit Health Score** — a computed score (net worth, savings rate, debt-to-income ratio, asset-to-loan ratio) that turns raw numbers into a single, understandable health indicator.
- **AI-guided mentorship** — a conversational AI layer (Gemini-powered) gives contextual financial advice grounded in the user's actual data, not generic tips.
- **Automated nudges** — scheduled jobs remind users of upcoming EMIs, flag risky savings rates, and deliver daily AI-generated insights, without the user needing to ask.
- **Community** — a discussion space where users can share and discuss financial questions and experiences.

---

# ✨ Features

## 👤 Authentication

* User Registration
* Secure Login
* JWT Authentication
* Access & Refresh Token Flow
* Password Encryption with bcrypt
* Logout
* CSRF Protection
* Email Verification
* Password Reset

## 💰 Income Management

* Add Income
* Update Income
* Delete Income
* Income History
* Income Tracking

## 💸 Expense Management

* Expense Tracking
* Expense Categories
* Add, Update & Delete Expenses
* Monthly Expense Analysis
* Spending Insights

## 🎯 Goal Management

* Create Financial Goals
* Track Goal Progress
* Goal Completion Monitoring
* Savings Progress

## 💳 Loan Management

* Loan Tracking
* EMI Calculation
* EMI Monitoring
* EMI Reminder Notifications

## 🏦 Asset Management

* Asset Portfolio
* Asset Tracking
* Net Worth Calculation
* Financial Position Overview

## 📊 Reports & Analytics

* Monthly Financial Reports
* Income vs Expense Analysis
* Expense Distribution
* Financial Trends
* Spending Analysis

## ❤️ Financial Health

* Financial Health Score
* Personalized Financial Suggestions
* Financial Behavior Insights
* Savings & Spending Recommendations

## 🧮 Financial Calculators

* EMI Calculator
* SIP Calculator
* Loan Calculator
* Other More

## 🤖 AI Features

* AI Financial Assistant
* AI-Powered Financial Insights
* Personalized Recommendations
* Smart Daily Notifications
* Context-Aware Financial Guidance

## 👥 Community

* Community Discussions
* Comments
* Likes
* User Engagement

## 🔔 Notifications

* Real-Time Notifications
* Socket.IO Notifications
* AI-Powered Notifications
* EMI Reminders
* Savings Alerts

## ⚙️ Settings

* Appearance Preferences
* AI Preferences
* Notification Preferences
* Financial Preferences
* Cursor Grid Appearance
* Logout

---

# 🛠 Tech Stack

## 💻 Backend

* **Node.js** — JavaScript runtime
* **Express.js** — Backend web framework
* **JavaScript** — Primary backend language
* **REST APIs** — Communication between application layers

## 🗄 Database

* **MongoDB** — NoSQL database
* **Mongoose** — MongoDB object modeling and data management

## 🔐 Authentication & Security

* **JWT** — Secure authentication and token-based authorization
* **bcrypt** — Password hashing
* **CSRF Protection** — Protection against cross-site request forgery
* **Access & Refresh Tokens** — Secure session management
* **Authentication Middleware** — Protected API routes and authorization

## 🤖 Artificial Intelligence

* **Google Gemini API** — AI-powered financial assistance, insights, and recommendations

## ⚡ Real-Time Communication

* **Socket.IO** — Real-time bidirectional communication and notifications

## ⏰ Background Processing

* **node-cron** — Scheduled jobs, reminders, and automated background tasks

## ☁️ Media & File Storage

* **Cloudinary** — Cloud-based media and file storage

---

### Architecture Overview

**Routes**
Handle incoming API requests and map them to the appropriate controllers.

**Controllers**
Process requests and coordinate application logic.

**Services**
Contain reusable business logic and application-level operations.

**Models**
Define database schemas and interact with MongoDB through Mongoose.

**Middleware**
Handle authentication, security, validation, and request processing.

**Socket**
Handles real-time communication and notifications using Socket.IO.

**Cron**
Handles scheduled background tasks and automated reminders.

**Utils**
Contains reusable utility functions used across the application.

---


# 🏗 Project Architecture

ARVENTRA follows a modular backend architecture designed to keep the application scalable, maintainable, and easy to extend.

The system separates:

**API Routes → Controllers → Services → Models → Database**

while dedicated middleware, utilities, scheduled jobs, and real-time communication services support the core application.

---

# 👨‍💻 Author

**Lakshya Agarwal**

