# CRUD Controllers


# 1. Introduction

A Controller is a function that receives an HTTP request, performs the required business logic, interacts with the database through Models, and sends an appropriate response back to the client.

Controllers separate application logic from routing, making the code modular and easier to maintain.

---

# 2. Why Do We Need Controllers?

Without Controllers, all the application logic would be written inside the route file, making it difficult to read and maintain.

Instead, Routes only decide **which Controller should handle the request**.

Flow:

```text
Client
   │
   ▼
Route
   │
   ▼
Controller
   │
   ▼
Model
   │
   ▼
MongoDB
   │
   ▼
Response
```

---

# 3. CRUD Operations

CRUD stands for:

| Operation  | HTTP Method | Mongoose Method            |
| ---------- | ----------- | -------------------------- |
| Create     | POST        | `Goal.create()`            |
| Read All   | GET         | `Goal.find()`              |
| Read By ID | GET         | `Goal.findById()`          |
| Update     | PUT         | `Goal.findByIdAndUpdate()` |
| Delete     | DELETE      | `Goal.findByIdAndDelete()` |

---

# 4. Create Controller

Example:

```javascript
const goal = await Goal.create(req.body);
```

Purpose:

* Creates a new document.
* Stores it inside MongoDB.
* Returns the newly created document.

Success Response:

```javascript
res.status(201).json({
    message: "Goal Created",
    success: true,
    goal
});
```

---

# 5. Read All Controller

Example:

```javascript
const goals = await Goal.find();
```

Purpose:

* Retrieves every document from the collection.
* Returns an array of Goal documents.

Success Response:

```javascript
res.status(200).json({
    message: "Goals Retrieved",
    success: true,
    goals
});
```

---

# 6. Read By ID Controller

Example:

```javascript
const goal = await Goal.findById(id);
```

Possible outcomes:

### Goal Found

```javascript
res.status(200).json({
    success: true,
    goal
});
```

### Goal Not Found

```javascript
res.status(404).json({
    error: "Goal not found",
    success: false
});
```

---

# 7. Update Controller

Example:

```javascript
const goal = await Goal.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
);
```

Purpose:

* Finds the document.
* Updates it.
* Returns the updated document because of:

```javascript
{ new: true }
```

---

# 8. Delete Controller

Example:

```javascript
const goal = await Goal.findByIdAndDelete(id);
```

Purpose:

* Removes the document permanently.
* Returns the deleted document.

---

# 9. Error Handling

Every Controller should use:

```javascript
try{

}
catch(error){

}
```

Reason:

* Database may be down.
* Invalid ObjectId.
* Validation errors.
* Unexpected server errors.

Example:

```javascript
catch(error){
    res.status(500).json({
        message: error.message,
        success: false
    });
}
```

---

# 10. Status Codes Used

| Status Code | Meaning               |
| ----------- | --------------------- |
| 200         | Success               |
| 201         | Resource Created      |
| 404         | Resource Not Found    |
| 500         | Internal Server Error |

---

# 11. Complete Controller Flow

```text
Client

   │

   ▼

HTTP Request

   │

   ▼

Express Route

   │

   ▼

Controller

   │

   ▼

Goal Model

   │

   ▼

MongoDB

   │

   ▼

Result Returned

   │

   ▼

JSON Response
```

---


# 12. Common Mistakes

### ❌ Forgetting async

```javascript
const goal = await Goal.create(req.body);
```

requires an async function.

---

### ❌ Forgetting await

Without `await`, the Promise is returned instead of the actual result.

---

### ❌ Forgetting 404 Check

Always verify:

```javascript
if(!goal)
```

before sending a success response.

---

### ❌ Returning Old Document

Remember:

```javascript
{ new: true }
```

returns the updated document.

---

# Commands Used

```javascript
Goal.create()

Goal.find()

Goal.findById()

Goal.findByIdAndUpdate()

Goal.findByIdAndDelete()
```

---

# Code Written

```javascript
module.exports = {
    createGoal,
    getGoals,
    getGoalById,
    updateGoalById,
    deleteGoalById
};
```

---

# Notes

Controllers never communicate directly with MongoDB. They always perform database operations through Mongoose Models.

---