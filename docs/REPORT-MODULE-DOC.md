# Reports Module

## Objective

In this milestone, we built the **Reports Module** for Project Udaan. The module provides financial insights by generating reports from the user's Assets, Loans, Income, Expenses, and Goals using MongoDB Aggregation Pipelines.

---

# Features Implemented

## Summary Report

Displays an overview of the user's financial position.

Includes:

- Total Income
- Total Expenses
- Total Assets
- Total Outstanding Loans
- Savings
- Net Worth

---

## Expense Category Report

Groups expenses based on category.

Displays:

- Category Name
- Total Amount Spent
- Total Transactions

Sorted by highest spending.

---

## Monthly Expense Report

Generates month-wise expense reports.

Displays:

- Month
- Total Expenses
- Number of Transactions

Useful for spending trend analysis.

---

## Monthly Income Report

Generates month-wise income reports.

Displays:

- Month
- Total Income
- Number of Income Records

Useful for income trend analysis.

---

## Loan Status Report

Groups loans by status.

Displays:

- Active Loans
- Closed Loans

---

## Goal Status Report

Groups goals by status.

Displays:

- Active Goals
- Completed Goals

---

# Aggregation Pipelines Used

The Reports Module primarily uses MongoDB Aggregation.

Common stages:

- $match
- $group
- $sort
- $project
- $month
- $year
- $sum

---

# Date Filtering

Supports optional query parameters:

```
month
year
```

Examples:

```
GET /reports/summary?month=7&year=2026
```

```
GET /reports/monthly-expense?year=2026
```

If no date filters are provided, the report includes all available data.

---

# Calculations

## Savings

```
Savings = Total Income − Total Expense
```

---

## Net Worth

```
Net Worth = Total Assets − Outstanding Loans
```

---

# Reports Generated

## Summary Report

Returns:

- Total Income
- Total Expense
- Total Assets
- Outstanding Loans
- Savings
- Net Worth

---

## Expense Category Report

Returns:

- Category
- Total Amount
- Total Transactions

---

## Monthly Expense Report

Returns:

- Month
- Total Expense
- Transaction Count

---

## Monthly Income Report

Returns:

- Month
- Total Income
- Income Count

---

## Loan Status Report

Returns:

- Active Loans
- Closed Loans

---

## Goal Status Report

Returns:

- Active Goals
- Completed Goals

---

# Routes

```
GET /reports/summary
```

Generate Summary Report

---

```
GET /reports/expense-category
```

Expense Category Report

---

```
GET /reports/monthly-expense
```

Monthly Expense Report

---

```
GET /reports/monthly-income
```

Monthly Income Report

---

```
GET /reports/loan-status
```

Loan Status Report

---

```
GET /reports/goal-status
```

Goal Status Report

---

# Query Parameters

Supported by reports:

```
month
year
```

Example:

```
GET /reports/summary?month=7&year=2026
```

---

# Security

All reports are user-specific.

Every aggregation begins with:

```javascript
{
    $match: {
        user: req.user.id
    }
}
```

This ensures users can only view their own financial reports.

---

# Controllers

Implemented:

- getSummaryReport
- getExpenseCategoryReport
- getMonthlyExpenseReport
- getMonthlyIncomeReport
- getLoanStatusReport
- getGoalStatusReport

---

# Middleware Flow

```
Client
      │
      ▼
Auth Middleware
      │
      ▼
Report Controller
      │
      ▼
Aggregation Pipeline
      │
      ▼
MongoDB
      │
      ▼
Response
```

---

# Important Concepts Learned

- MongoDB Aggregation Pipeline
- $match
- $group
- $sum
- $sort
- Date Filtering
- Month & Year Extraction
- Financial Calculations
- Reporting APIs

---

# Commands Used

```javascript
Model.aggregate()

$match

$group

$sum

$sort

$month

$year
```

---

# Summary

The Reports Module transforms raw financial records into meaningful insights using MongoDB Aggregation Pipelines. It provides users with spending summaries, income trends, loan and goal statistics, and overall financial reports while ensuring complete data isolation through authentication.