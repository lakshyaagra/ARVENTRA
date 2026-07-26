# Calculators Module

## Objective

The Calculators Module provides financial calculators to help users estimate interest, investments, taxes, retirement corpus, loan EMIs, and returns.

---

# Routes

GET /calculators/simple-interest
GET /calculators/compound-interest
GET /calculators/roi
GET /calculators/fd
GET /calculators/rd
GET /calculators/sip
GET /calculators/lumpsum
GET /calculators/emi
GET /calculators/retirement
GET /calculators/income-tax

---

# Available Calculators

## 1. Simple Interest Calculator

Formula

```
SI = (P × R × T) / 100
```

---

## 2. Compound Interest Calculator

Formula

```
A = P(1 + R/100)^T
```

---

## 3. ROI Calculator

Formula

```
ROI = (Profit / Investment) × 100
```

---

## 4. Fixed Deposit Calculator

Formula

```
A = P(1 + R/(100n))^(nt)
```

Supports

- Annual
- Semi-Annual
- Quarterly
- Monthly Compounding

---

## 5. Recurring Deposit Calculator

Uses the standard Indian banking quarterly compounding formula.

Returns

- Total Deposit
- Interest Earned
- Maturity Amount

---

## 6. SIP Calculator

Formula

```
FV = PMT × ((1+r)^n − 1)/r × (1+r)
```

Returns

- Total Investment
- Wealth Gained
- Estimated Value

---

## 7. Mutual Fund Lumpsum Calculator

Formula

```
FV = P(1+r)^n
```

---

## 8. EMI Calculator

Formula

```
EMI = P × r × (1+r)^n / ((1+r)^n − 1)
```

Applicable for

- Personal Loan
- Home Loan
- Education Loan
- Vehicle Loan

Returns

- Monthly EMI
- Total Interest
- Total Payment

---

## 9. Retirement Calculator

Uses SIP Future Value Formula.

Inputs

- Current Age
- Retirement Age
- Monthly Investment
- Expected Return

Returns

- Retirement Corpus
- Wealth Created

---

## 10. Income Tax Calculator

Implements the New Tax Regime slab-based taxation.

Returns

- Estimated Tax
- Income After Tax

---

# Common Features

- Input Validation
- Proper HTTP Status Codes
- Rounded Financial Values
- Consistent JSON Responses

---

# Concepts Learned

- Financial Mathematics
- Compound Growth
- Time Value of Money
- Progressive Taxation
- EMI Calculations
- Investment Planning
- Retirement Planning