# Sorting Data in Mongoose

# 1. Introduction

Sorting is the process of arranging data in a particular order before sending it to the client.

Without sorting, MongoDB returns documents in their natural order, which is usually the order in which they were inserted.

Sorting helps users view data in a meaningful way.

Examples:

* Newest goals first
* Highest target amount first
* Goals arranged alphabetically
* Completed goals at the end

---

# 2. Why Do We Need Sorting?

Without sorting, users receive data in random or insertion order.

Sorting improves user experience by allowing users to view information according to their preference.

Examples:

* Show newest goals first.
* Show highest savings target first.
* Sort goals alphabetically.
* Show completed goals at the bottom.

---

# 3. The `.sort()` Method

Mongoose provides the `.sort()` method to arrange documents.

Example:

```javascript
Goal.find().sort({
    createdAt: -1
});
```

---

# 4. Sorting on Different Fields

### Sort by Target Amount

```javascript
.sort({
    targetAmount: 1
})
```

---

### Sort by Goal Name

```javascript
.sort({
    goalName: 1
})
```

---

### Sort by Status

```javascript
.sort({
    status: 1
})
```

---

### Sort by Creation Date

```javascript
.sort({
    createdAt: -1
})
```

---

# 5. Dynamic Sorting using Query Parameters

Instead of hardcoding sorting, we allow the frontend to decide.

Example:

```
GET /goals?sort=targetAmount&order=asc
```

Here:

* `sort` specifies the field.
* `order` specifies ascending or descending.

Express provides these values through:

```javascript
req.query.sort
req.query.order
```

---

# 6. Default Sorting

If the frontend does not send any sorting information:

```
GET /goals
```

then we apply default sorting.

Example:

```javascript
const sortField = req.query.sort || "createdAt";
```

```javascript
const order = req.query.order || "desc";
```

This means goals will be sorted by newest first.

---

# 7. Converting Order

The frontend sends:

```
asc
```

or

```
desc
```

Mongoose expects:

```
1
```

or

```
-1
```

So we convert it.

```javascript
const sortOrder = order === "asc" ? 1 : -1;
```

---

# 8. Dynamic Sort Object

JavaScript allows computed property names.

```javascript
const sortObject = {
    [sortField]: sortOrder
};
```

Examples:

If

```javascript
sortField = "createdAt";
sortOrder = -1;
```

then

```javascript
{
    createdAt: -1
}
```

---

# 9. Why Square Brackets?

Object values are evaluated automatically.

Object keys are treated as plain text.

To use the value stored inside a variable as a key, JavaScript provides computed property names.

Correct:

```javascript
{
    [sortField]: sortOrder
}
```

Incorrect:

```javascript
{
    sortField: sortOrder
}
```

because it creates

```javascript
{
    sortField: 1
}
```

instead of

```javascript
{
    targetAmount: 1
}
```

---

# 10. Validation

To prevent invalid sorting fields, we validate them.

```javascript
const allowedSortFields = [
    "createdAt",
    "goalName",
    "targetAmount",
    "status"
];
```

Validation:

```javascript
if (
    !allowedSortFields.includes(sortField) ||
    (order !== "asc" && order !== "desc")
) {
    return res.status(400).json({
        message: "Invalid sort field or order",
        success: false
    });
}
```

---

# 11. Flow

```
Client
   │
   ▼
GET /goals?sort=targetAmount&order=asc
   │
   ▼
Express
   │
   ▼
req.query
   │
   ▼
Validate Parameters
   │
   ▼
Build sortObject
   │
   ▼
Goal.find().sort(sortObject)
   │
   ▼
Sorted Response
```

---

# 12. Complete Project Udaan Code

```javascript
const sortField = req.query.sort || "createdAt";

const allowedSortFields = [
    "createdAt",
    "targetAmount",
    "goalName",
    "status"
];

const order = req.query.order || "desc";

if (
    !allowedSortFields.includes(sortField) ||
    (order !== "asc" && order !== "desc")
) {
    return res.status(400).json({
        message: "Invalid sort field or order",
        success: false
    });
}

const sortOrder = order === "asc" ? 1 : -1;

const sortObject = {
    [sortField]: sortOrder
};

const goals = await Goal.find({
    user: req.user.id
})
.populate("user", "name email")
.sort(sortObject);
```

---

# 13. Key Points

* `.sort()` arranges MongoDB documents.
* `1` means ascending.
* `-1` means descending.
* Query Parameters make sorting dynamic.
* Default sorting improves user experience.
* Computed property names allow dynamic object keys.
* Always validate query parameters before using them.

---

# 14. Common Mistakes

### ❌ Using variable name as object key

```javascript
{
    sortField: sortOrder
}
```

Correct:

```javascript
{
    [sortField]: sortOrder
}
```

---

### ❌ Forgetting default values

Without defaults:

```javascript
req.query.sort
```

may become

```javascript
undefined
```

---

### ❌ Not validating Query Parameters

Users may send

```
sort=password
```

or

```
order=ascending
```

Always validate before sorting.

---

# Summary

Sorting allows APIs to return data in a meaningful order. Mongoose provides the `.sort()` method, while Query Parameters allow users to dynamically decide how data should be sorted. Production applications should always validate sorting fields and orders, provide sensible default sorting, and build sort objects dynamically using JavaScript computed property names.

---

# Commands Used

```javascript
.sort()

req.query

.includes()
```

---

