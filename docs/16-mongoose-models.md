# Mongoose Models

# 1. Introduction

Mongoose provides two important concepts:

* Schema
* Model

A Schema defines the structure of a document, while a Model provides methods to create, read, update, and delete documents from MongoDB.

---

# 2. Why Do We Need a Schema?

MongoDB is schema-less, meaning it allows flexible documents.

However, in real applications we need every document to follow a consistent structure.

Example Goal document:

```json
{
    "goalName": "Buy a Car",
    "targetAmount": 500000,
    "status": "active"
}
```

A Schema ensures every Goal document follows this structure.

---

# 3. Creating a Schema

Example:

```javascript
const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
    goalName: String,
    targetAmount: Number
});
```

The Schema only defines the structure of the document.

It does **not** communicate with MongoDB.

---

# 4. Creating a Model

A Model is created using:

```javascript
const Goal = mongoose.model("Goal", goalSchema);
```

Here:

* `"Goal"` → Model Name
* `goalSchema` → Structure of the document

The Model is the object through which we interact with MongoDB.

---

# 5. Automatic Collection Creation

When Mongoose sees:

```javascript
mongoose.model("Goal", goalSchema);
```

it automatically creates (or uses) the collection:

```text
goals
```

Rules:

* Converts to lowercase.
* Converts to plural.

Example:

| Model | Collection |
| ----- | ---------- |
| Goal  | goals      |
| User  | users      |...


---

# 6. What Does mongoose.model() Return?

`mongoose.model()` returns a **Model object**.

Example:

```javascript
const Goal = mongoose.model("Goal", goalSchema);
```

Now `Goal` contains many built-in methods such as:

```javascript
Goal.create()

Goal.find()

Goal.findById()

Goal.findByIdAndUpdate()

Goal.findByIdAndDelete()
```

---

# 7. Creating a Document

Example:

```javascript
await Goal.create(req.body);
```

Suppose:

```json
{
    "goalName":"Buy Bike",
    "targetAmount":100000
}
```

Mongoose creates a document and stores it inside:

```text
project_udaan

      │

      ▼

goals Collection

      │

      ▼

New Document
```

---

# 8. Model Flow

```text
Goal Schema

      │

      ▼

mongoose.model()

      │

      ▼

Goal Model

      │

      ▼

CRUD Methods

      │

      ▼

MongoDB Collection

      │

      ▼

Documents
```

---

# 9. Project Udaan Examples

Create:

```javascript
await Goal.create(req.body);
```

Read All:

```javascript
await Goal.find();
```

Read By ID:

```javascript
await Goal.findById(id);
```

Update:

```javascript
await Goal.findByIdAndUpdate(id, req.body, { new: true });
```

Delete:

```javascript
await Goal.findByIdAndDelete(id);
```

---

# 10. Key Points

* Schema defines document structure.
* Model communicates with MongoDB.
* `mongoose.model()` returns a Model object.
* Models contain CRUD methods.
* Mongoose automatically creates plural lowercase collections.

---

# 11. Common Mistakes

### ❌ Thinking Schema inserts data

Schema only defines the structure.

---

### ❌ Thinking Model is the Collection

The Model is a JavaScript object used to interact with the Collection.

---

### ❌ Forgetting to Export the Model

```javascript
module.exports = Goal;
```

---

# Summary

A Schema defines the structure of documents, while a Model provides methods to communicate with MongoDB. Models are used to perform CRUD operations and automatically connect to the appropriate collection inside the database.

---

# Commands Used

```javascript
new mongoose.Schema()

mongoose.model()
```

---

# Code Written

```javascript
const Goal = mongoose.model("Goal", goalSchema);

module.exports = Goal;
```

---

# Notes

The Model acts as the bridge between JavaScript and MongoDB. Every CRUD operation in Project Udaan is performed through the Model.

---