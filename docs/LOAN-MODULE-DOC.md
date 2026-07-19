# Loan Module

## Objective

In this milestone, we built the complete **Loan Management Module** for Project Udaan. The module allows authenticated users to create, view, update, delete, search, filter, sort, and paginate their loans while enforcing business rules through middleware and backend logic.

---

# Features Implemented

## Loan Creation

* Create a new loan.
* Associate every loan with the logged-in user.
* Backend automatically decides the loan status.
* Validation middleware checks all incoming data before saving.

---

## Loan Retrieval

Users can:

* View all their loans.
* View a single loan using its ID.
* Access only their own loans.

---

## Loan Updation

Users can update:

* Loan Name
* Lender
* Principal Amount
* Outstanding Amount
* Interest Rate
* Loan Term
* Loan Type
* EMI Amount
* Next Due Date
* Notes

Backend automatically recalculates:

* Loan Status

---

## Loan Deletion

Users can delete only their own loans.

---

# Loan Schema

Fields implemented:

* loanName
* lender
* principalAmount
* outstandingAmount
* interestRate
* loanTerm
* loanType
* emiAmount
* nextDueDate
* notes
* status
* user

---

# Business Rules

The backend enforces:

* Principal Amount must be greater than 0.
* Outstanding Amount cannot be negative.
* Outstanding Amount cannot exceed Principal Amount.
* Interest Rate cannot be negative.
* Loan Term must be at least 1 month.
* EMI Amount cannot be negative.
* Loan Status is decided by the backend.
* Users cannot manually control loan status.

---

# Automatic Status Management

Backend automatically sets:

```
Outstanding Amount = 0
```

↓

```
Status = Closed
```

Otherwise:

```
Status = Active
```

---

# Validation Middleware

## validateLoan

Used while creating a loan.

Validates:

* Loan Name
* Lender
* Principal Amount
* Outstanding Amount
* Interest Rate
* Loan Term
* Loan Type
* EMI Amount
* Next Due Date
* Notes

---

## validateUpdateLoan

Used while updating a loan.

Allows partial updates.

Validates only the fields provided by the client.

---

# Security

Every loan belongs to a single authenticated user.

Queries always use:

```javascript
{
    _id: id,
    user: req.user.id
}
```

This prevents users from accessing or modifying other users' loans.

---

# Controllers

Implemented:

* createLoan
* getLoans
* getLoanById
* updateLoanById
* deleteLoanById

---

# Supported Query Parameters

## Sorting

Examples:

```
GET /loans?sort=loanName
```

```
GET /loans?sort=principalAmount&order=desc
```

---

## Searching

```
GET /loans?search=Education
```

Uses case-insensitive regular expression search.

---

## Filtering

```
GET /loans?status=active
```

```
GET /loans?status=closed
```

---

## Pagination

```
GET /loans?page=2&limit=10
```

Response includes:

* Current Page
* Total Pages
* Total Loans
* Has Next Page
* Has Previous Page

---

# Routes

```
POST   /loans
```

Create Loan

---

```
GET    /loans
```

Get All Loans

---

```
GET    /loans/:id
```

Get Loan By ID

---

```
PUT    /loans/:id
```

Update Loan

---

```
DELETE /loans/:id
```

Delete Loan

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
Loan Controller
      │
      ▼
MongoDB
      │
      ▼
Response
```

---

# Important Concepts Learned

* Resource Ownership
* Authentication
* Validation Middleware
* Partial Updates
* Business Rule Validation
* Automatic Status Management
* Search using Regex
* Sorting
* Filtering
* Pagination
* Route Protection

---

# Commands Used

```javascript
Loan.create()

Loan.find()

Loan.findOne()

loan.save()

loan.deleteOne()

Loan.countDocuments()

Object.assign()
```

---

# Summary

The Loan Module provides complete CRUD functionality with strong validation, authentication, authorization, searching, filtering, sorting, pagination, and backend-controlled business rules. It follows the same architecture as the Goal Module, ensuring consistency across Project Udaan.
