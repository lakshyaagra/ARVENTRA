# Notification Module

## Objective

The Notification Module is responsible for informing users about important financial events, reminders, system updates, and future AI-generated recommendations. It provides a centralized notification system that can be used by every module in Project Udaan.

---

# Purpose

Instead of every module implementing its own notification logic, a common notification service is used.

Examples:

* Goal Achieved
* EMI Reminder
* Monthly Report Generated
* Community Activity
* Credit Health Updates
* AI Financial Suggestions (Future)

---

# Notification Sources

```
Income
│
Expenses
│
Loans
│
Goals
│
Reports
│
Credit Health
│
Community
│
AI (Future)
│
System
```

---

# Notification Types

```
goal

loan

income

expense

report

credit-health

community

system

ai
```

---

# Database Structure

## Notification Schema

```
Notification

│

├── user

├── title

├── message

├── type

├── isRead

├── createdAt

└── updatedAt
```

---

# Schema Fields

### user

Stores the owner of the notification.

Type:

```
ObjectId
```

Reference:

```
User
```

---

### title

Short heading displayed in the notification list.

Example:

```
EMI Reminder
```

---

### message

Detailed notification description.

Example:

```
Your Home Loan EMI is due tomorrow.
```

---

### type

Specifies which module generated the notification.

Possible values:

```
goal

loan

income

expense

report

credit-health

community

system

ai
```

---

### isRead

Tracks whether the notification has been read.

Default:

```
false
```

---

# Notification Service

A common helper function is used by every module.

```
createNotification()
```

Instead of writing

```
Notification.create(...)
```

inside every controller, all modules simply call

```
createNotification()
```

This keeps the project modular and follows the DRY principle.

---

# Controller Functions

## 1. Get All Notifications

Returns every notification belonging to the logged-in user.

Notifications are sorted by newest first.

---

## 2. Mark Notification as Read

Marks a single notification as read.

```
isRead = true
```

---

## 3. Mark All Notifications as Read

Updates every unread notification of the current user.

---

## 4. Delete Notification

Deletes one notification.

---

## 5. Delete All Notifications

Deletes every notification belonging to the current user.

---

# API Endpoints

| Method | Endpoint                | Purpose                        |
| ------ | ----------------------- | ------------------------------ |
| GET    | /notifications          | Get all notifications          |
| PATCH  | /notifications/:id/read | Mark one notification as read  |
| PATCH  | /notifications/read-all | Mark all notifications as read |
| DELETE | /notifications/:id      | Delete one notification        |
| DELETE | /notifications          | Delete all notifications       |

---

# Route Flow

```
Client

   │

   ▼

Notification Routes

   │

   ▼

Authentication Middleware

   │

   ▼

Notification Controller

   │

   ▼

Notification Database

   │

   ▼

Response
```

---

# Current Integration

Currently the Notification module is completed independently.

Future integrations include:

* Goals
* Loans
* Reports
* Community
* AI Financial Advisor

---

# Future Improvements

* Push Notifications
* Email Notifications
* SMS Notifications
* Notification Priority
* Notification Expiry
* Scheduled Notifications
* AI Generated Notifications

---

# Summary

The Notification Module provides a centralized communication system for Project Udaan. Every major module can create notifications through a common service, making the backend modular, reusable, and scalable.
