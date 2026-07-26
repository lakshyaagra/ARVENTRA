# Credit Health Module

## Objective

The Credit Health Module evaluates the user's overall financial health by analyzing assets, loans, income, expenses, savings, and debt. It generates a Credit Health Score along with important financial ratios.

---

# Features

- Calculate Total Assets
- Calculate Outstanding Loans
- Calculate Total Income
- Calculate Total Expenses
- Calculate Net Worth
- Calculate Savings
- Calculate Savings Rate
- Calculate Debt-to-Income Ratio
- Calculate Asset-to-Loan Ratio
- Count Active Loans
- Generate Credit Health Score
- Generate Health Status

---

# Route

GET /credit-health

---

# Response

```json
{
    "success": true,
    "creditHealth": {
        "totalAssets": 2500000,
        "totalOutstandingLoans": 500000,
        "totalIncome": 1200000,
        "totalExpense": 800000,

        "netWorth": 2000000,
        "savings": 400000,

        "savingsRate": 33.33,
        "debtToIncomeRatio": 0.42,
        "assetLoanRatio": 5,

        "activeLoans": 2,

        86,
        "healthStatus": "Good"
    }
}
```

---

# Financial Metrics

## Total Assets

Sum of all asset current values.

Formula

```
Total Assets = Sum(Current Asset Values)
```

---

## Total Outstanding Loans

Sum of all outstanding loan balances.

Formula

```
Outstanding Loans = Sum(Outstanding Amount)
```

---

## Total Income

Sum of all income records.

Formula

```
Total Income = Sum(Income Amount)
```

---

## Total Expense

Sum of all expense records.

Formula

```
Total Expense = Sum(Expense Amount)
```

---

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

## Savings Rate

```
Savings Rate = (Savings / Total Income) × 100
```

---

## Debt-to-Income Ratio

```
Debt-to-Income Ratio = Outstanding Loans / Total Income
```

---

## Asset-to-Loan Ratio

```
Asset-to-Loan Ratio = Total Assets / Outstanding Loans
```

---

# Credit Health Score

Maximum Score = 100

| Factor | Weight |
|---------|--------|
| Savings Rate | 35 |
| Debt-to-Income Ratio | 35 |
| Asset-to-Loan Ratio | 20 |
| Active Loans | 10 |

---

# Health Status

| Score | Status |
|--------|--------|
| 90–100 | Excellent |
| 80–89 | Good |
| 60–79 | Average |
| 40–59 | Poor |
| Below 40 | Critical |

---

# Aggregation Pipelines Used

- Total Assets
- Total Income
- Total Expense
- Outstanding Loans
- Loan Status

---

# Concepts Learned

- MongoDB Aggregation
- Financial Ratios
- Credit Health Analysis
- Financial Planning