#  Middleware

# 1. Introduction

Middleware is a function that executes between the client request and the route handler. It can inspect, modify, or stop the request before it reaches the intended route.

Middleware allows us to perform common tasks such as logging requests, authentication, validation, and error handling without repeating the same code in every route.

---

# 2. Why Do We Need Middleware?

Imagine Project Udaan has 100 different routes.

If every route checks whether the user is logged in, our code will become repetitive and difficult to maintain.

Instead, we can write the authentication logic once inside a middleware and reuse it wherever required.

Middleware is commonly used for:

* Authentication
* Logging
* Request Validation
* Error Handling
* Parsing JSON
* Security

---

# 3. Middleware Flow

```
Client
   │
   ▼
Middleware
   │
 next()
   │
   ▼
Route Handler
   │
   ▼
Response
```

Every incoming request passes through middleware before reaching the route.

---

# 4. app.use()

Middleware is commonly registered using:

```javascript
app.use(middlewareFunction);
```

or

```javascript
app.use((req, res, next) => {

    // Middleware Logic

    next();

});
```

`app.use()` tells Express to execute the middleware whenever a request is received.

---

# 5. The next() Function

`next()` tells Express to continue processing the request by moving to the next middleware or the matching route.

Example:

```javascript
app.use((req, res, next) => {

    console.log("Middleware Executed");

    next();

});
```

Without calling `next()`, the request stops and never reaches the route unless a response is sent inside the middleware.

---

# 6. Logger Middleware

Example:

```javascript
app.use((req, res, next) => {

    console.log(`${req.method} ${req.url}`);

    next();

});
```

### Explanation

* `req.method` tells which HTTP method was used (GET, POST, PUT, DELETE, etc.).
* `req.url` tells which URL path was requested.

Example terminal output:

```
GET /dashboard
POST /goals
GET /loans/45
```

---

# 7. Authentication Middleware

Example:

```javascript
app.use((req, res, next) => {

    const isLoggedIn = true;

    if (!isLoggedIn) {
        return res.send("Please login first.");
    }

    next();

});
```

If the user is logged in, the request continues.

If not, the middleware immediately sends a response and the route never executes.

---

# 8. Middleware Execution Order

Middleware executes in the same order in which it is registered.

Example:

```javascript
app.use((req, res, next) => {
    console.log("Middleware 1");
    next();
});

app.use((req, res, next) => {
    console.log("Middleware 2");
    next();
});

app.get("/dashboard", (req, res) => {
    res.send("Dashboard");
});
```

Visiting:

```
GET /dashboard
```

produces in terminal:

```
Middleware 1
Middleware 2
```

Finally, the browser receives:

```
Dashboard
```

---

# 9. Project Udaan Example

Public Routes:

```
/login
/register
/contact
```

These routes do not require authentication.

Protected Routes:

```
/dashboard
/goals
/loans
/reports
/assets
```

Authentication middleware should protect these routes so that only logged-in users can access them.


# 11. Common Mistakes


### ❌ Calling `next()` after sending a response

```javascript
res.send("Access Denied");
next();
```

Once a response has been sent, the request should not continue.

---

# Summary

Middleware is one of the core concepts of Express. It allows us to execute reusable logic before a request reaches the route handler. It keeps backend applications clean, organized, scalable, and easy to maintain. Features such as authentication, logging, validation, JSON parsing, and error handling are commonly implemented using Middleware.

---

# Code Written

```javascript
app.use((req, res, next) => {

    console.log(`${req.method} ${req.url}`);

    next();

});

app.use((req, res, next) => {

    const isLoggedIn = true;

    if (!isLoggedIn) {
        return res.send("Please login first.");
    }

    next();

});
```

---

# Notes

Middleware executes in the order it is registered. It can modify the request, stop the request, or allow it to continue by calling `next()`.

---
