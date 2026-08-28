# Mongoose

# 1. Introduction

Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.

It provides a structured way to interact with MongoDB by allowing us to create Schemas, Models, and perform database operations without writing raw MongoDB queries.

---

# 2. Why Do We Need Mongoose?

Node.js cannot directly communicate with MongoDB in a structured way.

Although MongoDB provides its own driver, writing everything using the native driver becomes lengthy and difficult.

Mongoose simplifies this process by providing:

* Schemas
* Models
* Validation
* Simple CRUD methods
* Middleware
* Automatic type conversion

---

# 3. What is an ODM?

ODM stands for **Object Data Modeling**.

Just as an ORM maps objects to relational tables, an ODM maps JavaScript objects to MongoDB documents.

Flow:

```text
JavaScript Object
        │
        ▼
    Mongoose
        │
        ▼
MongoDB Document
```

---

# 4. Installing Mongoose

```bash
npm install mongoose
```

---

# 5. Connecting MongoDB

Example:

```javascript
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
```

---

# 6. Why is connectDB Async?

`mongoose.connect()` returns a Promise because establishing a database connection takes time.

Possible outcomes:

* Connection Successful (Promise Fulfilled)
* Connection Failed (Promise Rejected)

Therefore,

* `async` is required.
* `await` pauses execution until the connection succeeds or fails.
* `try...catch` handles any connection errors.

---

# 7. Promise Flow

```text
connectDB()

        │
        ▼

mongoose.connect()

        │

 ┌──────┴───────┐

 ▼              ▼

Fulfilled     Rejected

 │              │

 ▼              ▼

Continue     Catch Block
Execution
```

---

# 8. Key Points

* It connects Node.js with MongoDB.
* `mongoose.connect()` returns a Promise.
* Database connection should complete before starting the server.
* Schemas and Models are provided by Mongoose.

---

# 9. Common Mistakes

### ❌ Not handling connection errors

Always use:

```javascript
try{
    ...
}
catch(error){
    ...
}
```

---

# Summary

Mongoose is an Object Data Modeling library that simplifies interaction between Node.js and MongoDB. It provides Schemas, Models, Validation, and simple CRUD methods while handling MongoDB communication efficiently.

---

# Commands Used

```bash
npm install mongoose
```

---

# Code Written

```javascript
await mongoose.connect(process.env.MONGO_URI);
```

---

# Notes

Mongoose acts as a bridge between Node.js and MongoDB. It allows developers to work with JavaScript objects instead of writing low-level MongoDB operations.

---
