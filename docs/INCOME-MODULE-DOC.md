# Income Module

## Objective

In this milestone, we built the complete **Income Management Module** for Project Udaan. The module allows authenticated users to create, view, update, delete, search, filter, sort, and paginate their income records while enforcing validation through middleware and secure backend logic.

---

# Features Implemented

## Income Creation

- Create a new income record.
- Associate every income with the logged-in user.
- Validation middleware checks all incoming data before saving.

---

## Income Retrieval

Users can:

- View all their income records.
- View a single income using its ID.
- Access only their own income records.

---

## Income Updation

Users can update:

- Income Source
- Amount
- Category
- Payment Method
- Received Date
- Notes

---

## Income Deletion

Users can delete only their own income records.

---

# Income Schema

Fields implemented:

- incomeSource
- amount
- category
- paymentMethod
- receivedDate
- notes
- user

---

# Business Rules

The backend enforces:

- Income Source is required.
- Amount must be greater than 0.
- Category must belong to the allowed categories.
- Payment Method must belong to the allowed payment methods.
- Received Date cannot be in the future.
- Notes cannot be an empty string.

---

# Validation Middleware

## validateIncome

Used while creating an income.

Validates:

- Income Source
- Amount
- Category
- Payment Method
- Received Date
- Notes

---

## validateUpdateIncome

Used while updating an income.

Allows partial updates.

Validates only the fields provided by the client.

---

# Security

Every income belongs to a single authenticated user.

Queries always use:

```javascript
{
    _id: id,
    user: req.user.id
}
```

This prevents users from accessing or modifying other users' income records.

---

# Controllers

Implemented:

- createIncome
- getIncomes
- getIncomeById
- updateIncomeById
- deleteIncomeById

---

# Supported Query Parameters

## Sorting

Examples:

```
GET /incomes?sort=incomeSource
```

```
GET /incomes?sort=amount&order=desc
```

```
GET /incomes?sort=receivedDate&order=asc
```

---

## Searching

```
GET /incomes?search=Salary
```

Uses case-insensitive regular expression search.

---

## Filtering

```
GET /incomes?category=salary
```

```
GET /incomes?category=business
```

---

## Pagination

```
GET /incomes?page=2&limit=10
```

Response includes:

- Current Page
- Total Pages
- Total Incomes
- Has Next Page
- Has Previous Page

---

# Routes

```
POST   /incomes
```

Create Income

---

```
GET    /incomes
```

Get All Incomes

---

```
GET    /incomes/:id
```

Get Income By ID

---

```
PUT    /incomes/:id
```

Update Income

---

```
DELETE /incomes/:id
```

Delete Income

---

# Middleware Flow

```
Client
      │
      ▼
Auth Middleware
      │
      ▼
Validation Middleware
      │
      ▼
Income Controller
      │
      ▼
MongoDB
      │
      ▼
Response
```

---

# Categories Supported

- salary
- business
- freelancing
- investment
- rental
- interest
- gift
- bonus
- refund
- other

---

# Payment Methods Supported

- cash
- upi
- credit-card
- debit-card
- bank-transfer
- wallet
- other

---

# Important Concepts Learned

- Authentication
- Authorization
- Resource Ownership
- Validation Middleware
- Partial Updates
- Search using Regex
- Category Filtering
- Sorting
- Pagination
- CRUD Operations
- Protected Routes

---

# Commands Used

```javascript
Income.create()

Income.find()

Income.findOne()

income.save()

income.deleteOne()

Income.countDocuments()

Object.assign()
```

---

# Summary

The Income Module provides complete CRUD functionality with strong validation, authentication authorization, searching, filtering, sorting, and pagination. Every income record belongs to its authenticated user, ensuring secure access and maintaining a consistent backend architecture across Project Udaan. This module will serve as one of the primary data sources for the upcoming Dashboard, Reports, and AI Financial Advisor modules.