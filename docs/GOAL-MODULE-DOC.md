# Goal Module Documentation

## Overview

The Goal Module allows authenticated users to create, manage, update, search, and delete their financial goals. Each goal belongs to a specific user and can optionally include an image uploaded to Cloudinary.

---

# Features

* Create a financial goal
* Upload an optional goal image
* View all goals
* View a specific goal
* Update goal details
* Replace goal image
* Delete goal
* Search goals
* Filter goals by status
* Sort goals
* Paginate results
* User-specific authorization

---

# Authentication

All Goal routes are protected using JWT Authentication.

Every request must include:

```
Authorization: Bearer <JWT_TOKEN>
```

Users can only access their own goals.

---

# Goal Schema

| Field         | Type     | Required | Default |
| ------------- | -------- | -------- | ------- |
| goalName      | String   | Yes      | —       |
| targetAmount  | Number   | Yes      | —       |
| currentAmount | Number   | No       | 0       |
| priority      | String   | No       | medium  |
| category      | String   | No       | other   |
| deadline      | Date     | No       | —       |
| description   | String   | No       | —       |
| status        | String   | No       | active  |
| image         | String   | No       | —       |
| publicId      | String   | No       | —       |
| user          | ObjectId | Yes      | —       |

---

# API Endpoints

## Create Goal

```
POST /api/goals
```

Authentication Required

Supports:

* Multipart Form Data
* Optional Image Upload

---

## Get All Goals

```
GET /api/goals
```

Supports:

* Search
* Filter
* Sort
* Pagination

---

## Get Goal By ID

```
GET /api/goals/:id
```

Returns a single goal belonging to the authenticated user.

---

## Update Goal

```
PUT /api/goals/:id
```

Supports:

* Partial Updates
* Optional Image Replacement

If a new image is uploaded:

1. New image is uploaded to Cloudinary.
2. MongoDB is updated.
3. Old Cloudinary image is deleted.

---

## Delete Goal

```
DELETE /api/goals/:id
```

Deletes:

* Goal document from MongoDB
* Associated image from Cloudinary (if present)

---

# Query Parameters

## Search

```
GET /api/goals?search=laptop
```

Searches goal names using case-insensitive matching.

---

## Filter

```
GET /api/goals?status=active
```

Allowed values:

* active
* completed

---

## Sorting

```
GET /api/goals?sort=goalName&order=asc
```

Allowed sort fields:

* createdAt
* goalName
* targetAmount
* status

Order:

* asc
* desc

---

## Pagination

```
GET /api/goals?page=1&limit=10
```

Response includes:

* Current Page
* Total Goals
* Total Pages
* Has Next Page
* Has Previous Page

---

# Image Upload Flow

1. Multer stores the uploaded image temporarily.
2. Image is uploaded to Cloudinary.
3. Cloudinary URL and Public ID are stored in MongoDB.
4. Temporary file is deleted from the server.
5. If database save fails, the uploaded Cloudinary image is deleted (rollback).

---

# Validation

## Create Validation

Validates:

* Goal Name
* Target Amount
* Current Amount
* Priority
* Category
* Deadline Format
* Description

Business Rule:

```
Current Amount <= Target Amount
```

---

## Update Validation

Supports partial updates.

Only validates fields that are provided by the client.

Business Rule is verified inside the controller using the existing database values.

---

# Security

* JWT Authentication
* User Authorization
* Image Type Validation
* Maximum Upload Size (5 MB)
* Cloudinary Rollback
* Ownership Validation

---

# Technologies Used

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Multer
* Cloudinary

---

# Module Status

**Status:** Completed

This module has been fully implemented, validated, tested, and is considered feature-complete for Project Udaan Phase 1.
