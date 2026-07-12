# Aggregation Pipeline and Dashboard Statistics

# 1. What is Aggregation?

Aggregation is a MongoDB framework used to process documents and perform calculations directly inside the database.

Unlike `find()`, which returns raw documents, Aggregation returns calculated results.

Examples:

- Total Goals
- Total Savings Target
- Average Goal Amount
- Highest Goal
- Lowest Goal

---

# 2. Why Do We Need Aggregation?

Without Aggregation:

```
Database
    │
    ▼
Node.js
    │
Calculate Everything
    │
    ▼
Response
```

With Aggregation:

```
Database
    │
Aggregation Pipeline
    │
Calculations
    │
    ▼
Response
```

Aggregation reduces network usage and improves performance by allowing MongoDB to perform calculations.

---

# 3. Aggregation Pipeline

Aggregation starts with:

```javascript
Goal.aggregate([
    ...
]);
```

The pipeline is an array because MongoDB executes multiple stages one after another.

---

# 4. Aggregation Stages

Example:

```
Documents
    │
    ▼
$match
(Filter)
    │
    ▼
$group
(Calculate)
    │
    ▼
Result
```

Each stage processes the output of the previous stage.

---

# 5. $match Stage

`$match` filters documents entering the pipeline.

Example:

```javascript
{
    $match: {
        user: req.user.id
    }
}
```

Only the authenticated user's goals continue to the next stage.

---

# 6. $group Stage

`$group` groups documents and performs calculations.

Example:

```javascript
{
    $group: {
        _id: null
    }
}
```

---

# 7. Meaning of _id inside $group

Inside Aggregation,

`_id` does **not** represent MongoDB ObjectId.

It defines how MongoDB groups documents.

Example:

```javascript
_id: "$status"
```

Groups documents by status.

Example:

```javascript
_id: "$user"
```

Groups documents by user.

Example:

```javascript
_id: null
```

Creates one group containing every document.

---

# 8. Aggregation Operators

## Count Documents

```javascript
totalGoals: {
    $sum: 1
}
```

Counts every document.

---

## Sum

```javascript
totalTargetAmount: {
    $sum: "$targetAmount"
}
```

Adds every target amount.

---

## Average

```javascript
averageTargetAmount: {
    $avg: "$targetAmount"
}
```

Calculates average target amount.

---

## Maximum

```javascript
highestTarget: {
    $max: "$targetAmount"
}
```

Returns highest target amount.

---

## Minimum

```javascript
lowestTarget: {
    $min: "$targetAmount"
}
```

Returns lowest target amount.

---

# 9. Dashboard Statistics API

Route:

```
GET /dashboard
```

Aggregation:

```javascript
const stats = await Goal.aggregate([
    {
        $match: {
            user: req.user.id
        }
    },
    {
        $group: {
            _id: null,

            totalGoals: {
                $sum: 1
            },

            totalTargetAmount: {
                $sum: "$targetAmount"
            },

            averageTargetAmount: {
                $avg: "$targetAmount"
            },

            highestTarget: {
                $max: "$targetAmount"
            },

            lowestTarget: {
                $min: "$targetAmount"
            }
        }
    }
]);
```

---

# 10. Why stats[0]?

Aggregation always returns an array.

Example:

```javascript
[
    {
        totalGoals: 5
    }
]
```

To access the object:

```javascript
stats[0]
```

---

# 11. Handling Empty Results

If the user has no goals:

```javascript
[]
```

Then:

```javascript
stats[0]
```

becomes

```javascript
undefined
```

So we return default values.

```javascript
const dashboardStats = stats[0] || {
    totalGoals: 0,
    totalTargetAmount: 0,
    averageTargetAmount: 0,
    highestTarget: 0,
    lowestTarget: 0
};
```

---

# 12. Final Response

```javascript
res.status(200).json({
    success: true,
    stats: dashboardStats
});
```

---

# Flow

```
Client
    │
    ▼
GET /dashboard
    │
    ▼
Authentication
    │
    ▼
Aggregation Pipeline
    │
    ▼
$match
(Filter User)
    │
    ▼
$group
(Perform Calculations)
    │
    ▼
Dashboard Statistics
    │
    ▼
Response
```

---

# Key Points

- Aggregation performs calculations inside MongoDB.
- `aggregate()` accepts an array of stages.
- `$match` filters documents.
- `$group` performs calculations.
- `_id` defines grouping.
- `_id: null` creates one group.
- `$sum: 1` counts documents.
- `$sum: "$field"` adds field values.
- `$avg` calculates average.
- `$max` returns maximum value.
- `$min` returns minimum value.
- Aggregation always returns an array.
- `stats[0]` extracts the calculated object.
- Default values handle empty databases safely.

---