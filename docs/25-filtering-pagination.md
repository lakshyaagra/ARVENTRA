# Filtering and Pagination

# 1. Introduction

When a collection grows to hundreds or thousands of documents, returning every document in a single request becomes inefficient.

To solve this problem, production APIs use:

* Filtering
* Pagination

Filtering allows users to retrieve only the required documents.

Pagination allows users to retrieve documents page by page instead of loading everything at once.

---

# 2. Filtering

Filtering allows the client to retrieve only the documents that match specific conditions.

Example:

```http
GET /goals?status=active
```

Instead of returning every goal, only goals having:

```
status = active
```

are returned.

---

# 3. Building the Filter Object

Every request should only access the authenticated user's data.

```javascript
const filter = {
    user: req.user.id
};
```

If the client provides a status:

```javascript
if (req.query.status) {
    filter.status = req.query.status;
}
```

Now:

```
GET /goals
```

creates

```javascript
{
    user: req.user.id
}
```

Whereas

```
GET /goals?status=active
```

creates

```javascript
{
    user: req.user.id,
    status: "active"
}
```

---

# 4. Validating Status

Only valid status values should be accepted.

```javascript
const allowedStatus = ["active", "completed"];

if (
    req.query.status &&
    !allowedStatus.includes(req.query.status)
) {
    return res.status(400).json({
        message: "Invalid status value.",
        success: false
    });
}
```

Why do we check:

```javascript
req.query.status &&
```

Because Query Parameters are optional.

If status is not provided, filtering should simply be skipped.

---

# 5. Using the Filter

Finally,

```javascript
Goal.find(filter)
```

retrieves only the matching documents.

---

# 6. Pagination

Pagination divides a large collection into smaller pages.

Instead of:

```
GET /goals
```

we use

```
GET /goals?page=2&limit=15
```

This returns only a small portion of the data.

---

# 7. Query Parameters Used

```
page
```

Specifies which page to return.

Example:

```
?page=3
```

---

```
limit
```

Specifies how many documents should be returned.

Example:

```
?limit=15
```

---

# 8. Reading Pagination Parameters

```javascript
const page = Number(req.query.page) || 1;
const limit = Number(req.query.limit) || 15;
```

Default values:

* Page = 1
* Limit = 15

---

# 9. Calculating Skip

MongoDB skips documents before returning data.

Formula:

```
skip = limit × (page − 1)
```

Implementation:

```javascript
const skip = limit * (page - 1);
```

---

# 10. MongoDB Pagination Methods

Skip previous documents:

```javascript
.skip(skip)
```

Limit returned documents:

```javascript
.limit(limit)
```

Combined query:

```javascript
const goals = await Goal.find(filter)
    .populate("user", "name email")
    .sort(sortObject)
    .skip(skip)
    .limit(limit);
```

---

# 11. Pagination Metadata

The frontend also needs information about pages.

Count matching documents:

```javascript
const totalGoals = await Goal.countDocuments(filter);
```

Calculate total pages:

```javascript
const totalPages = Math.ceil(totalGoals / limit);
```

Check next page:

```javascript
const hasNextPage = page < totalPages;
```

Check previous page:

```javascript
const hasPreviousPage = page > 1;
```

---

# 12. Final Response

```javascript
res.status(200).json({
    message: "Goals Retrieved",
    success: true,

    currentPage: page,
    totalPages,
    totalGoals,
    hasNextPage,
    hasPreviousPage,

    goals
});
```

---

# 13. Complete Flow

```
Client
      │
      ▼
GET /goals?page=2&limit=15&status=active
      │
      ▼
req.query
      │
      ▼
Validate Query Parameters
      │
      ▼
Build Filter Object
      │
      ▼
Calculate Pagination
(page, limit, skip)
      │
      ▼
Goal.find(filter)
.sort()
.skip()
.limit()
      │
      ▼
countDocuments()
      │
      ▼
Prepare Metadata
      │
      ▼
Send Response
```

---

# 14. Key Points

* Filtering uses Query Parameters.
* Query Parameters are optional.
* Always validate user input.
* Pagination improves performance.
* Skip formula:

```
skip = limit × (page − 1)
```

* Use `Math.ceil()` while calculating total pages.
* `countDocuments()` counts matching documents.
* Always send pagination metadata for frontend navigation.

---

# 15. Common Mistakes

### ❌ Using `Math.round()`

Wrong:

```javascript
Math.round(totalGoals / limit);
```

Correct:

```javascript
Math.ceil(totalGoals / limit);
```

---

### ❌ Forgetting Number Conversion

Wrong:

```javascript
const page = req.query.page;
```

Correct:

```javascript
const page = Number(req.query.page) || 1;
```

---

### ❌ Forgetting Default Values

Always provide defaults:

```javascript
page = 1;
limit = 15;
```

---

# Summary

Filtering allows clients to retrieve only the required documents using Query Parameters, while Pagination divides large datasets into smaller pages. Together, they improve API flexibility, performance, and user experience. Production APIs commonly use `filter`, `sort`, `skip`, `limit`, and `countDocuments()` to build efficient endpoints.

---

# Commands Used

```javascript
req.query

Goal.find()

countDocuments()

.sort()

.skip()

.limit()

Math.ceil()
```

---

# Code Written

```javascript
const page = Number(req.query.page) || 1;
const limit = Number(req.query.limit) || 15;

const skip = limit * (page - 1);

const allowedStatus = ["active", "completed"];

if (
    req.query.status &&
    !allowedStatus.includes(req.query.status)
) {
    return res.status(400).json({
        message: "Invalid status value.",
        success: false
    });
}

const filter = {
    user: req.user.id
};

if (req.query.status) {
    filter.status = req.query.status;
}

const totalGoals = await Goal.countDocuments(filter);
const totalPages = Math.ceil(totalGoals / limit);

const goals = await Goal.find(filter)
    .populate("user", "name email")
    .sort(sortObject)
    .skip(skip)
    .limit(limit);

const hasNextPage = page < totalPages;
const hasPreviousPage = page > 1;
```

---