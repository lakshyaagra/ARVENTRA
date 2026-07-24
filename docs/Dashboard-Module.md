# Dashboard Module

## Objective

In this milestone, we built the **Dashboard Module** for Project Udaan. The dashboard acts as the central summary screen of the application by collecting financial information from all modules and presenting important statistics, totals, recent activities, and overall financial health.

---

# Features Implemented

## Dashboard Summary

The dashboard provides an overview of:

- Total Assets
- Total Income
- Total Expenses
- Total Outstanding Loans
- Net Worth
- Savings

---

## Goal Statistics

Displays:

- Total Goals
- Active Goals
- Completed Goals

---

## Loan Statistics

Displays:

- Total Loans
- Active Loans
- Closed Loans

---

## Income Statistics

Displays:

- Total Income Records
- Total Income Amount

---

## Expense Statistics

Displays:

- Total Expense Records
- Total Expense Amount

---

# Financial Calculations

## Net Worth

Calculated using:

```
Net Worth = Total Assets − Total Outstanding Loans
```

---

## Savings

Calculated using:

```
Savings = Total Income − Total Expenses
```

---

# Aggregation Pipeline

MongoDB Aggregation Pipeline is used to calculate totals.

Implemented aggregations:

- Total Assets
- Total Income
- Total Expenses
- Total Outstanding Loans

Example:

```javascript
Asset.aggregate([
    {
        $match: {
            user: req.user.id
        }
    },
    {
        $group: {
            _id: null,
            totalAssets: {
                $sum: "$currentValue"
            }
        }
    }
]);
```

---

# Status Aggregation

The Dashboard groups data based on status.

## Loan Status

Calculates:

- Active Loans
- Closed Loans

Using:

```javascript
Loan.aggregate([
    {
        $match: {
            user: req.user.id
        }
    },
    {
        $group: {
            _id: "$status",
            count: {
                $sum: 1
            }
        }
    }
]);
```

---

## Goal Status

Calculates:

- Active Goals
- Completed Goals

Using:

```javascript
Goal.aggregate([
    {
        $match: {
            user: req.user.id
        }
    },
    {
        $group: {
            _id: "$status",
            count: {
                $sum: 1
            }
        }
    }
]);
```

---

# Recent Activity

The dashboard also shows the latest five records from each module.

## Recent Goals

```
Goal.find()
.sort({ createdAt: -1 })
.limit(5)
```

---

## Recent Loans

```
Loan.find()
.sort({ createdAt: -1 })
.limit(5)
```

---

## Recent Expenses

```
Expense.find()
.sort({ createdAt: -1 })
.limit(5)
```

---

## Recent Income

```
Income.find()
.sort({ createdAt: -1 })
.limit(5)
```

---

# Dashboard Response

The dashboard returns:

- Total Assets
- Total Income
- Total Expenses
- Total Outstanding Loans
- Net Worth
- Savings
- Total Goals
- Active Goals
- Completed Goals
- Total Loans
- Active Loans
- Closed Loans
- Total Expense Records
- Total Income Records
- Recent Goals
- Recent Loans
- Recent Expenses
- Recent Income

---

# Controller

Implemented:

- getDashboard

---

# Route

```
GET /dashboard
```

Returns complete financial dashboard data for the authenticated user.

---

# Security

Dashboard data is user-specific.

Every query filters data using:

```javascript
{
    user: req.user.id
}
```

This ensures users can only view their own financial information.

---

# Middleware Flow

```
Client
      │
      ▼
Auth Middleware
      │
      ▼
Dashboard Controller
      │
      ▼
MongoDB
      │
      ▼
Dashboard Response
```

---

# Important Concepts Learned

- MongoDB Aggregation Pipeline
- `$match`
- `$group`
- `$sum`
- Document Counting
- Status-Based Aggregation
- Financial Calculations
- Recent Activity Retrieval
- Dashboard API Design
- Multi-Collection Data Aggregation

---

# Commands Used

```javascript
Model.aggregate()

Model.countDocuments()

Model.find()

.sort()

.limit()

.populate()

.find()

$match

$group

$sum

Array.find()
```

---

# Summary

The Dashboard Module provides a centralized overview of the user's financial data by combining information from Goals, Loans, Assets, Income, and Expenses. It uses MongoDB Aggregation Pipelines to efficiently calculate totals, groups records by status, computes Net Worth and Savings, and displays recent financial activities. This module serves as the primary analytics and summary endpoint of Project Udaan.