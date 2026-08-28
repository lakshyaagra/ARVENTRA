# MongoDB
# 1. Introduction

MongoDB is a NoSQL, document-oriented database used to store application data. Unlike traditional SQL databases that store data in tables and rows, MongoDB stores data as JSON-like documents inside collections.

MongoDB is designed to handle large amounts of flexible and scalable data.

---

# 2. Why Do We Need MongoDB?

Previously in Project Udaan, all goals were stored inside a JavaScript array.

Example:

```javascript
const goals = [];
```

This approach has several problems:

* Data is lost whenever the server restarts.
* Data cannot be shared between multiple users.
* Data cannot be stored permanently.
* Searching and updating large amounts of data becomes inefficient.

MongoDB solves these problems by permanently storing data in a database.

---

```json
{
    "_id": "...",
    "goalName": "Buy a Car",
    "targetAmount": 500000
}
```

---

# 3. Collections and Documents

A Collection stores multiple Documents.

Example:

```
goals
│
├── Document 1
├── Document 2
├── Document 3
└── Document 4
```

Each document represents one Goal in Project Udaan.

---

# 4. BSON vs JSON

MongoDB stores data internally as BSON (Binary JSON).

Developers usually work with JSON because it is easy to read.

Example JSON:

```json
{
    "goalName": "Emergency Fund",
    "targetAmount": 100000
}
```

---

# 5. MongoDB Architecture

```
Client
   │
   ▼
Express Server
   │
   ▼
Mongoose
   │
   ▼
MongoDB
   │
   ▼
Collection
   │
   ▼
Documents
```

---

# 6. Example

When a user creates a Goal:

```
POST /goals
```

The server stores it inside the `goals` collection.

Example:

```json
{
    "goalName": "Buy Laptop",
    "targetAmount": 80000
}
```

MongoDB automatically generates an `_id` field.

---

# 7. Key Points

* MongoDB is a NoSQL database.
* It stores data as Documents.
* Documents are stored inside Collections.
* Collections are stored inside Databases.
* Data remains available even after restarting the server.
* MongoDB automatically creates a unique `_id` for every document.

---

# Summary

MongoDB is a NoSQL document database that stores JSON-like documents inside collections. It provides permanent storage, scalability, and flexibility, making it an excellent choice for backend applications like Project Udaan.

---

# Notes

MongoDB automatically generates a unique `_id` for every document and stores data internally as BSON while allowing developers to work with JSON.

---

