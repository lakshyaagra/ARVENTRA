# 10 - Express Routing

## What is Routing?

Every Request has its own destination.

Routing is the process of directing an incoming HTTP request to the correct function/path based on the requested URL and HTTP method.

A route acts as a pathway between the client and a specific functionality of the backend.

---

## Route

A Route is an endpoint in a server that listens for a specific HTTP request and performs a specific task.

---

## Why Do We Need Routing?

As applications grow, keeping every route inside a single file becomes difficult.

Instead of writing hundreds of routes inside `index.js`, we divide routes into separate files based on their responsibilities.

Examples:

* Users
* Loans
* Reports
* AI
* Contact 
...

This follows the Single Responsibility Principle, where each router manages one feature.

---

## Express Router

```javascript

const express = require("express");

const router = express.Router();

```

`express.Router()` creates a Router object.

Unlike `app`, which represents the entire application, a router manages only one module or feature.

---

## Exporting a Router

```javascript

module.exports = router;

```

This exports the Router object so that it can be imported into other files.

---

## Importing a Router

```javascript
const dashboardRouter = require("./routes/dashboard");
```

This imports the exported Router object into `index.js`.

---

## Connecting a Router

```javascript

app.use("/dashboard", dashboardRouter);

```

`app.use()` connects the router with a URL prefix.

If the router contains:

```javascript

router.get("/", ...)

```

the final route becomes:

```
/dashboard
```

because Express combines the prefix and the router path.

---

## Route Parameters

Example of Dynamic route:

```javascript
router.get("/:loanId", (req, res) => {
    const loanId = req.params.loanId;
});
```

If a user visits:

```
/loans/45
```

then:

```javascript
req.params.loanId
```

becomes:

```
45
```

Route parameters allow us to create dynamic URLs without creating thousands of separate routes.

---

## Route Matching Order

Express checks routes from top to bottom.

Specific routes should always be written before dynamic routes.

Example:

```javascript
router.get("/history", ...);

router.get("/:loanId", ...);
```

If the order is reversed, `/history` would be treated as a loan ID.

---

