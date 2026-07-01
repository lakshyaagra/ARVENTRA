# 09 - Express Basics

## What is Express?

Express is a lightweight and popular web framework for Node.js that makes it easier to build servers and APIs.Express provides simple methods for handling multiple routes,error management, requests, responses, and middleware.

---

## Why do we use Express?

Using only Node.js to create a server becomes difficult as the application grows because we have to manage routing, request handling, error handling, and many other tasks manually.

Express helps us by:

* Creating servers easily.
* Managing routes.
* Handling HTTP requests and responses.

---

## Creating an Express Application

```javascript
const express = require("express");

const app = express();
```

* `require("express")` imports the Express package.
* `express()` creates an Express Application Object.
* This application controls the entire backend server.

---

## Creating a Route

```javascript
app.get("/", (req, res) => {
    res.send("Welcome to Project Udaan");
});
```

* `app.get()` creates a GET route.
* `req` represents the incoming request.
* `res` represents the response sent back to the client.
* `res.send()` sends data to the browser.

---

## Starting the Server

```javascript
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
```

* `app.listen()` starts the server.
* `3000` is the port number.
* The callback function runs only once when the server starts successfully.
* In English, express, please start my application, listen on port 3000, and once you start successfully, run this function having a message.
---
