# Query Parameters

# 1. Introduction

Query Parameters are optional values that are added to the end of a URL to send additional information to the server. They are mainly used for filtering, searching, sorting, and customizing the response without changing the route itself.

---

# 2. Why Do We Need Query Parameters?

Without Query Parameters, we would have to create separate routes for every possible filter or search.

Instead, we can use a single route and pass different values through Query Parameters.

Examples include:

* Filtering active goals.
* Searching learning content.
* Sorting reports.
* Viewing data based on different conditions.

---

# 3. Query Parameter Syntax

A Query Parameter starts after a **?** in the URL.

Example:

```
/goals?status=active
```

Here:

* `?` starts the Query Parameters.
* `status` is the key.
* `=` assigns a value.
* `active` is the value.

Multiple Query Parameters can be written using `&`.

Example:

```
/reports?sort=date&order=desc
```

---

# 4. Accessing Query Parameters in Express

Express provides Query Parameters through:

```javascript
req.query
```

Example:

```javascript
app.get("/goals", (req, res) => {
    console.log(req.query);
});
```

If the request is:

```
/goals?status=active
```

then:

```javascript
req.query
```

contains:

```javascript
{
    status: "active"
}
```

---


### Searching Learning Content

```
GET /learning?type=mutual-funds
```

---

### Sorting Reports

```
GET /reports?sort=date
```

---

### Viewing a Specific Loan

```
GET /loans?id=1
```

---

### Searching Users

```
GET /users?id=45
```

---

# 5. Route Parameters vs Query Parameters

| Route Parameters                      | Query Parameters                      |
| ------------------------------------- | ------------------------------------- |
| `/users/45`                           | `/users?id=45`                        |
| Used to identify a specific resource. | Used to filter, search, or sort data. |
| Usually required.                     | Usually optional.                     |

---

# 7. Flow

```
Client
   │
   ▼
GET /goals?status=active
   │
   ▼
Express
   │
   ▼
req.query
   │
   ▼
Route Handler
   │
   ▼
Response
```

---

# 8. Key Points

* Query Parameters are optional.
* They begin with `?`.
* Multiple Query Parameters are separated using `&`.
* Express stores them inside `req.query`.
* They are commonly used for filtering, searching, and sorting data.

---

# 9. Common Mistakes

### ❌ Confusing Route Parameters with Query Parameters

```
/users/45
```

is different from

```
/users?id=45
```

---

---

# Summary

Query Parameters allow us to send optional information to the server through the URL. They are mainly used for filtering, searching, and sorting data. In Express, Query Parameters are accessed using `req.query`, making it easy to build flexible APIs without creating multiple routes.

---

# Commands Used

```javascript
req.query
```

---

# Code Written

```javascript
app.get("/goals", (req, res) => {
    console.log(req.query);

    res.send(req.query);
});
```

---