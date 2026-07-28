# Settings Module

## Objective

The Settings Module stores user preferences and personalization options for Project Udaan. It allows every user to customize how the application behaves without affecting other users.

---

# Purpose

Instead of storing preferences inside the User model, a separate Settings document is maintained for every user.

This keeps the project modular and scalable.

---

# Features

## Appearance

* Light Theme
* Dark Theme
* System Theme

---

## Notifications

* EMI Reminder
* Goal Reminder
* Monthly Report
* Community Notification
* AI Recommendation

---

## Financial Preferences

* Currency
* Salary Day

---

## AI Preferences

* Enable AI
* Daily Summary
* Weekly Insights

---

## Language

Stores the preferred application language.

---

# Database Structure

```
Settings

│

├── user

├── appearance

│      └── theme

├── notifications

│      ├── emiReminder

│      ├── goalReminder

│      ├── monthlyReport

│      ├── communityNotification

│      └── aiRecommendation

├── financial

│      ├── currency

│      └── salaryDay

├── ai

│      ├── enableAI

│      ├── dailySummary

│      └── weeklyInsights

├── language

├── createdAt

└── updatedAt
```

---

# One Settings Document Per User

Every user owns exactly one settings document.

```
User

↓

Settings
```

This is enforced using

```
unique: true
```

on the user field.

---

# Appearance

## Theme

Possible values

```
light

dark

system
```

Default

```
system
```

---

# Notification Preferences

Each notification can be enabled or disabled individually.

```
emiReminder

goalReminder

monthlyReport

communityNotification

aiRecommendation
```

Default

```
true
```

---

# Financial Preferences

## Currency

Default

```
INR
```

---

## Salary Day

Represents the day of the month when salary is usually credited.

Valid Range

```
1–31
```

---

# AI Preferences

Stores user preferences related to future AI functionality.

```
enableAI

dailySummary

weeklyInsights
```

---

# Language

Stores the preferred application language.

Example

```
English
```

---

# Controller Functions

## Get Settings

Returns the user's settings.

If settings do not exist, a default settings document is automatically created.

---

## Update Settings

Updates only the settings sent by the client.

---

# Validation

The Settings middleware validates:

* Theme
* Salary Day
* Language

Boolean values are handled automatically by Mongoose.

---

# API Endpoints

| Method | Endpoint  | Purpose                   |
| ------ | --------- | ------------------------- |
| GET    | /settings | Get current user settings |
| PATCH  | /settings | Update settings           |

---

# Route Flow

```
Client

   │

   ▼

Settings Routes

   │

   ▼

Authentication Middleware

   │

   ▼

Validation Middleware

   │

   ▼

Settings Controller

   │

   ▼

Settings Database

   │

   ▼

Response
```

---

# Advantages

* Clean separation from User model
* Supports personalization
* Future-ready
* Easy to maintain
* Easy to expand

---

# Future Improvements

* Theme Color
* Font Size
* Currency Symbols
* Multi-language Support
* Time Zone
* Data Export Preferences
* Privacy Settings
* Two-Factor Authentication
* Profile Picture
* Accessibility Settings

---

# Summary

The Settings Module stores all user-specific preferences in a dedicated document. It centralizes personalization features such as appearance, notification preferences, financial settings, AI preferences, and language, making Project Udaan more scalable and easier to maintain.
