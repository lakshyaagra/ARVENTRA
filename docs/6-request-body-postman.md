# Milestone 13 - Request Body & Postman

# 1. Introduction

A Request Body contains the actual data that the client wants to send to the server.

Unlike GET requests, which usually request information, POST requests send information that the backend needs to process.

Examples include:

* Creating a new goal
* Adding a loan
* Updating monthly income
* Contact form submission
* User registration

---

# 2. Why Do We Need Request Body?

Imagine a user wants to create a financial goal in Project Udaan.

The browser must send information such as:

* Goal Name
* Target Amount
* Current Savings
* Target Date
* Priority

This information is sent inside the Request Body.

Example:

```json
{
    "goalName": "Complete Education Loan",
    "targetAmount": 700000,
    "currentSavings": 20000,
    "targetDate": "2029-10-31",
    "priority": 1
}
```

---

# 3. GET vs POST

| GET              | POST                        |
| ---------------- | --------------------------- |
| Retrieves data   | Sends data                  |
| Mostly uses URL  | Uses Request Body           |
| Used for reading | Used for creating resources |

Example:

```
GET /goals
```

```
POST /goals
```

---

# 4. express.json()

Express cannot automatically understand JSON data sent by the client.

To convert incoming JSON into a JavaScript object, Express provides the following middleware:

```javascript
app.use(express.json());
```

This middleware:

* Reads the incoming JSON.
* Converts it into a JavaScript object.
* Stores it inside `req.body`.

Without this middleware:

```javascript
console.log(req.body);
```

usually prints:

```javascript
undefined
```

---

# 5. req.body

The parsed JavaScript object can be accessed using:

```javascript
req.body
```

Example:

```javascript
app.post("/goals", (req, res) => {

    console.log(req.body);

    res.send(req.body);

});
```

If the client sends:

```json
{
    "goalName": "Buy House"
}
```

Then:

```javascript
req.body
```

contains:

```javascript
{
    goalName: "Buy House"
}
```

---

# 6. Accessing Individual Properties

Since `req.body` is a JavaScript object, we can access individual properties using dot notation.

Example:

```javascript
const goal = req.body;

console.log(goal.goalName);
console.log(goal.targetAmount);
```

Output:

```
Buy House
5000000
```

---

# 7. Request Flow

```
Postman
   │
(JSON Body)
   │
   ▼
Express Server
   │
express.json()
   │
   ▼
req.body
   │
   ▼
Route Handler
   │
   ▼
res.send()
   │
   ▼
Postman Response
```

---

# 8. Postman

Postman is an API testing tool used by backend developers.

It allows developers to:

* Send GET requests
* Send POST requests
* Send PUT requests
* Send DELETE requests
* Test APIs without building a frontend

For this milestone, Postman was used to send JSON data to our Express server.

---

# 9. Project Udaan Example

POST Route:

```javascript
app.post("/goals", (req, res) => {

    console.log(req.body);

    res.send(req.body);

});
```

Request Body:

```json
{
    "goalName": "Complete Education Loan",
    "targetAmount": 700000,
    "currentSavings": 20000,
    "targetDate": "2029-10-31",
    "priority": 1
}
```

Response to postman:

```json
{
    "goalName": "Complete Education Loan",
    "targetAmount": 700000,
    "currentSavings": 20000,
    "targetDate": "2029-10-31",
    "priority": 1
}
```

---

# 10. Key Points

* POST requests send data to the server.
* Data is sent inside the Request Body.
* Express uses `express.json()` to parse JSON.
* Parsed data is stored inside `req.body`.
* `req.body` is a JavaScript object.
* Postman is commonly used for API testing.

---

# 11. Common Mistakes

### ❌ Forgetting `express.json()`

```javascript
console.log(req.body);
```

Output:

```javascript
undefined
```

---

### ✅ Correct

```javascript
app.use(express.json());
```

---

### ❌ Using `${}` inside an object

Incorrect:

```javascript
res.send({
    goal: `${goal.goalName}`
});
```

Correct:

```javascript
res.send({
    goal: goal.goalName
});
```

`${}` is only required inside template strings.

---

# Commands Used

```javascript
app.use(express.json())

req.body

app.post()

res.send()
```

---

# Code Written

```javascript
app.use(express.json());

app.post("/goals", (req, res) => {

    console.log(req.body);

    res.send(req.body);

});
```
---

# Notes

Express automatically converts JavaScript objects sent through `res.send()` back into JSON before sending the response to the client.

---
