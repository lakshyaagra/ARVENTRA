# Authentication Middleware


# 1. Introduction

After a user successfully logs in, the server generates a JWT (JSON Web Token).

The client stores this token and sends it with every future request.

Instead of asking for the user's password every time, the server verifies the JWT before allowing access.

---

# 2. Why Authentication Middleware?

Without middleware:

```
Client
   │
   ▼
Controller
```

Anyone can directly access the controller.

With middleware:

```
Client
   │
   ▼
Authentication Middleware
   │
   ▼
Controller
```

The middleware checks whether the user is authenticated before allowing the request to continue.

---

# 3. Authorization Header

The client sends the JWT inside the HTTP Authorization header i.e. `req.headers`

Example:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Here:

* `Authorization` is the header name.
* `Bearer` tells the server that the following value is a JWT.
* The long string is the JWT.

---

# 4. Accessing Headers in Express

Headers are available through:

```javascript
req.headers
```

The Authorization header can be accessed using:

```javascript
req.headers.authorization
```

---

# 5. Checking Whether Token Exists

Example:

```javascript
const authHeader = req.headers.authorization;

if (!authHeader) {
    return res.status(401).json({
        message: "Access Denied",
        success: false
    });
}
```

If the client does not send a token, the request is rejected.

---

# 6. Extracting the Token

The Authorization header looks like:

```
Bearer eyJhbGc123...
```

Splitting it:

```javascript
authHeader.split(" ")
```

returns an Array as:

```javascript
[
    "Bearer",
    "eyJhbGc123..."
]
```

The JWT is:

```javascript
const token = authHeader.split(" ")[1];
```

---

# 7. Verifying JWT

JWT is verified using:

```javascript
jwt.verify(token, process.env.JWT_SECRET);
```

Example:

```javascript
const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET
);
```

If the token:

* is modified,
* is fake,
* or has expired,

`jwt.verify()` throws an error.

---

# 8. Decoded Payload

During login we generated:

```javascript
jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    {
        expiresIn: "7d"
    }
);
```

After verification:

```javascript
const decoded = jwt.verify(...);
```

contains:

```javascript
{
    id: user._id
}
```

This object is called the decoded payload.

---

# 9. req.user

The decoded payload is attached to the request.

Example:

```javascript
req.user = decoded;
```

Now every controller can access:

```javascript
req.user.id
```

without verifying the token again.

---

# 10. next()

Middleware must call:

```javascript
next();
```

This tells Express to continue executing the next middleware or controller.

Flow:

```
Request
   │
   ▼
Authentication Middleware
   │
 next()
   │
   ▼
Controller
```

Without `next()`, the request stops inside the middleware.

---

# 11. Complete Authentication Middleware

```javascript
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Access Denied",
                success: false
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    }

    catch (err) {

        return res.status(401).json({
            message: "Invalid or Expired Token",
            success: false
        });

    }

}

module.exports = authMiddleware;
```

---

# 12. Protecting Routes

Without middleware:

```javascript
router.get("/", getGoals);
```

Protected route:

```javascript
router.get(
    "/",
    authMiddleware,
    getGoals
);
```

Now every request first passes through the middleware.

---

# 13. Flow

```
Client
   │
   ▼
Authorization Header
   │
   ▼
Authentication Middleware
   │
   ▼
jwt.verify()
   │
   ▼
req.user
   │
 next()
   │
   ▼
Controller
```

---

# 14. Key Points

* JWT is sent inside the Authorization header.
* Authorization header is accessed using `req.headers.authorization`.
* The token is extracted using `split(" ")[1]`.
* JWT is verified using `jwt.verify()`.
* The decoded payload is stored in `req.user`.
* `next()` allows the request to continue.
* Authentication middleware protects routes.

---

# Commands Used

```javascript
req.headers.authorization

authHeader.split(" ")[1]

jwt.verify()

req.user

next()
```

---

# Summary

Authentication middleware verifies every incoming JWT before allowing access to protected routes. The middleware extracts the JWT from the Authorization header, verifies it using `jwt.verify()`, stores the decoded payload inside `req.user`, and calls `next()` to continue the request. This allows controllers to know which user is making the request without asking for the user's password again.
