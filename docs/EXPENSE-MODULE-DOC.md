# Expense Module

## Objective

In this milestone, we built the complete **Expense Management Module** for Project Udaan. The module allows authenticated users to create, view, update, delete, search, filter, sort, and paginate their expenses while ensuring proper validation through middleware.

---

# Features Implemented

## Expense Creation

- Create a new expense.
- Associate every expense with the logged-in user.
- Validation middleware checks all incoming data before saving.

---

## Expense Retrieval

Users can:

- View all their expenses.
- View a single expense using its ID.
- Access only their own expenses.

---

## Expense Updation

Users can update:

- Expense Name
- Amount
- Category
- Payment Method
- Expense Date
- Notes

---

## Expense Deletion

Users can delete only their own expenses.

---

# Expense Schema

Fields implemented:

- expenseName
- amount
- category
- paymentMethod
- expenseDate
- notes
- user

---

# Business Rules

The backend enforces:

- Expense Name is required.
- Amount must be greater than 0.
- Category must belong to the allowed categories.
- Payment Method must belong to the allowed payment methods.
- Expense Date cannot be in the future.
- Notes cannot be an empty string.

---

# Validation Middleware

## validateExpense

Used while creating an expense.

Validates:

- Expense Name
- Amount
- Category
- Payment Method
- Expense Date
- Notes

---

## validateUpdateExpense

Used while updating an expense.

Allows partial updates.

Validates only the fields provided by the client.

---

# Security

Every expense belongs to a single authenticated user.

Queries always use:

```javascript
{
    _id: id,
    user: req.user.id
}
```

This prevents users from accessing or modifying other users' expenses.

---

# Controllers

Implemented:

- createExpense
- getExpenses
- getExpenseById
- updateExpenseById
- deleteExpenseById

---

# Supported Query Parameters

## Sorting

Examples:

```
GET /expenses?sort=expenseName
```

```
GET /expenses?sort=amount&order=desc
```

```
GET /expenses?sort=expenseDate&order=asc
```

---

## Searching

```
GET /expenses?search=Pizza
```

Uses case-insensitive regular expression search.

---

## Filtering

```
GET /expenses?category=food
```

```
GET /expenses?category=travel
```

---

## Pagination

```
GET /expenses?page=2&limit=10
```

Response includes:

- Current Page
- Total Pages
- Total Expenses
- Has Next Page
- Has Previous Page

---

# Routes

```
POST   /expenses
```

Create Expense

---

```
GET    /expenses
```

Get All Expenses

---

```
GET    /expenses/:id
```

Get Expense By ID

---

```
PUT    /expenses/:id
```

Update Expense

---

```
DELETE /expenses/:id
```

Delete Expense

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
Expense Controller
      │
      ▼
MongoDB
      │
      ▼
Response
```

---

# Categories Supported

- food
- transport
- shopping
- entertainment
- health
- education
- bills
- travel
- investment
- family
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
Expense.create()

Expense.find()

Expense.findOne()

expense.save()

expense.deleteOne()

Expense.countDocuments()

Object.assign()
```

---

# Summary

The Expense Module provides complete CRUD functionality with strong validation, authentication, authorization, searching, filtering, sorting, and pagination. Every expense belongs to its authenticated user, ensuring secure access and consistent backend architecture across Project Udaan.