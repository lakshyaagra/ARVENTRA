# User Goal Relationship (Authorization)

# 1. Introduction

In a real application, multiple users use the same backend.

Every goal created by a user must belong to that specific user.

Without storing the owner of a goal, any user could access, update, or delete another user's data.

Authorization solves this problem.

---

# 2. Authentication vs Authorization

Authentication answers:

```
Who is the user?
```

Authorization answers:

```
Which data belongs to this user?
```
---

# 3. Why Do We Need a User Field?

Suppose we have two users.

```
Lakshya
Rahul
```

Without a user field, goals look like:

```
Goal 1
Goal 2
Goal 3
Goal 4
```

MongoDB cannot identify which goal belongs to which user.

Instead, every goal should store its owner's ID.

Example:

```javascript
{
    goalName: "Buy Laptop",
    targetAmount: 80000,
    user: ObjectId("Lakshya_ID")
}
```

Now every goal has an owner.

---

# 4. User Relationship in Goal Schema

```javascript
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
}
```

---

# 5. Understanding Each Property

### type

```javascript
type: mongoose.Schema.Types.ObjectId
```

Stores the MongoDB ObjectId of the user.

---

### ref

```javascript
ref: "User"
```

Tells Mongoose that this ObjectId belongs to the User model.

---

### required

```javascript
required: true
```

Every goal must belong to a user.

MongoDB will reject any goal without a user.

---

# 6. Why Don't We Trust the Client?

Suppose the client sends:

```json
{
    "goalName": "Laptop",
    "user": "Rahul_ID"
}
```

A malicious user could create goals for someone else.

Therefore, the server never trusts the user field coming from the client.

Instead, after authentication middleware verifies the JWT:

```javascript
req.user.id
```

contains the logged-in user's ID.

Before creating a goal:

```javascript
req.body.user = req.user.id;
```

Now the server decides ownership.

---

# 7. Creating Goals

Client sends:

```json
{
    "goalName": "Laptop",
    "targetAmount": 80000
}
```

Server automatically adds:

```javascript
req.body.user = req.user.id;
```

MongoDB stores:

```javascript
{
    goalName: "Laptop",
    targetAmount: 80000,
    user: ObjectId("Lakshya_ID")
}
```

---

# 8. Returning Only User's Goals

Unsafe:

```javascript
Goal.find();
```

This returns every goal from the database.

Correct:

```javascript
Goal.find({
    user: req.user.id
});
```

Only goals belonging to the logged-in user are returned.

---

# 9. Updating Goals Securely

Unsafe:

```javascript
Goal.findByIdAndUpdate(
    req.params.id,
    req.body
);
```

Anyone who knows the Goal ID could update another user's goal.

Correct approach:

```javascript
const goal=await Goal.findOneAndUpdate(
            {
                _id: id,
                user: req.user.id
            }, 
            req.body,
            { 
                new: true,
                runValidators: true
            }
        );
```

Both the Goal ID and User ID must match.

Only the owner can update the goal.

w/o `runValidators: true` mongoose doesnt always run the schema validation during updates.

---

# 10. Deleting Goals Securely

Unsafe:

```javascript
Goal.findByIdAndDelete(
    req.params.id
);
```

Anyone with the Goal ID could delete another user's goal.

Correct:

```javascript
Goal.findOne({
    _id: req.params.id,
    user: req.user.id
});
```

If no matching goal exists:

```javascript
return res.status(404).json({
    message: "Goal not found",
    success: false
});
```

Otherwise:

```javascript
await goal.deleteOne();
```

---

# 11. Why Do We Use findOne()?

`findById()` searches using only the Goal ID.

`findOne()` allows multiple conditions.

Example:

```javascript
Goal.findOne({
    _id: req.params.id,
    user: req.user.id
});
```

This ensures that both the Goal ID and the logged-in User ID match.

---

# 12. Authorization Flow

```
User Login
      │
      ▼
JWT Generated
      │
      ▼
Client Sends JWT
      │
      ▼
Authentication Middleware
      │
      ▼
jwt.verify()
      │
      ▼
req.user.id
      │
      ▼
Goal.find({
    user: req.user.id
})
      │
      ▼
Only User's Goals
```

---

# 13. Key Points

* Every goal belongs to one user.
* Goal schema stores the owner's ObjectId.
* `ref` tells Mongoose which model the ObjectId belongs to.
* The server never trusts the user field sent by the client.
* `req.user.id` is obtained from the verified JWT.
* Authorization ensures users can access only their own data.
* `findOne()` with both Goal ID and User ID prevents unauthorized updates and deletions.

---

# Commands Used

```javascript
mongoose.Schema.Types.ObjectId

ref: "User"

req.body.user = req.user.id

Goal.find({
    user: req.user.id
})

Goal.findOne({
    _id: req.params.id,
    user: req.user.id
})

await goal.deleteOne()
```

---

# Common Mistakes

### ❌ Trusting the Client

```javascript
req.body.user
```

Never trust ownership information coming from the client.

---

### ❌ Returning Every Goal

```javascript
Goal.find();
```

This exposes every user's data.

---

### ❌ Updating by Goal ID Only

```javascript
Goal.findByIdAndUpdate(...)
```

Anyone who knows the Goal ID could modify another user's data.

---

# Revision Questions

1. Why do we add a `user` field to the Goal schema?
2. Why is the `user` field of type `ObjectId`?
3. What does `ref: "User"` mean?
4. Why shouldn't we trust `req.body.user`?
5. Why do we write `req.body.user = req.user.id`?
6. Why is `Goal.find()` unsafe?
7. How does `Goal.find({ user: req.user.id })` improve security?
8. Why do we use `findOne()` instead of `findById()` for update and delete operations?
9. What is the difference between Authentication and Authorization?
10. Explain how JWT helps identify the owner of a goal.

---

# Summary

Authorization ensures that every goal belongs to exactly one user and that only the owner can view, update, or delete it. After the JWT is verified, the logged-in user's ID is available in `req.user.id`. This ID is used to store ownership while creating goals and to filter data during reading, updating, and deleting. Together, Authentication and Authorization provide a secure multi-user backend.
