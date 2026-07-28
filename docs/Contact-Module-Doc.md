# Contact Module

## Objective

The Contact Module allows authenticated users to communicate with the Project Udaan team by submitting support requests, reporting issues, requesting features, or providing feedback.

---

# Purpose

The Contact Module serves as the communication bridge between users and the Project Udaan team.

Users can:

* Report bugs
* Request new features
* Ask for support
* Provide feedback

---

# Database Structure

## Contact Schema

```text
Contact

│

├── user

├── subject

├── message

├── status

├── createdAt

└── updatedAt
```

---

# Schema Fields

## user

Stores the owner of the contact request.

Type

```text
ObjectId
```

Reference

```text
User
```

---

## subject

Short title describing the issue.

Example

```text
Unable to Update Income
```

---

## message

Detailed description of the issue.

Example

```text
Whenever I try to update my monthly income, the application returns an internal server error.
```

---

## status

Tracks the progress of the request.

Possible values

```text
pending

resolved
```

Default

```text
pending
```

---

# Validation

The Contact validation middleware checks:

## Subject

* Required
* Minimum 5 characters
* Maximum 100 characters

---

## Message

* Required
* Minimum 20 characters

---

# Controller Functions

## 1. Create Contact Request

Creates a new contact request for the logged-in user.

---

## 2. Get My Contact Requests

Returns all contact requests created by the authenticated user.

Results are sorted by newest first.

---

## 3. Delete Contact Request

Deletes a contact request belonging to the logged-in user.

Users cannot delete another user's request.

---

# API Endpoints

| Method | Endpoint     | Purpose                     |
| ------ | ------------ | --------------------------- |
| POST   | /contact     | Submit contact request      |
| GET    | /contact     | Get all my contact requests |
| DELETE | /contact/:id | Delete contact request      |

---

# Route Flow

```text
Client

   │

   ▼

Contact Routes

   │

   ▼

Authentication Middleware

   │

   ▼

Validation Middleware

   │

   ▼

Contact Controller

   │

   ▼

Contact Database

   │

   ▼

Response
```

---

# Security

Every contact request belongs to exactly one user.

Before deleting a request, ownership is verified.

Example

```javascript
Contact.findOne({

    _id: id,

    user: req.user.id

})
```

This prevents users from accessing or deleting another user's contact request.

---

# Current Features

* Submit Contact Request
* View My Requests
* Delete My Request

---

# Future Improvements

* Reply to User
* File Attachments
* Email Notifications
* Request Categories
* Mark as Resolved
* Search Contact Requests
* Contact History

---

# Summary

The Contact Module provides a secure communication system between users and the Project Udaan team. It allows users to submit support requests, retrieve their own requests, and delete them when necessary while ensuring proper ownership verification and validation.
