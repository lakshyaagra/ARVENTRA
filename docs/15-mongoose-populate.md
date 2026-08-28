# Mongoose Populate

# 1. Introduction

When we created the Goal schema, we stored the owner's ObjectId instead of storing the complete user information.

Example:

```javascript
{
    goalName: "Buy Laptop",
    targetAmount: 80000,
    user: ObjectId("687cb93d...")
}
```

The `user` field only stores the ObjectId of the User document.

---

# 2. Why Do We Store Only ObjectId?

Storing complete user information inside every goal would duplicate data.

Example:

```javascript
{
    goalName: "Buy Laptop",
    user: {
        name: "Lakshya",
        email: "lakshya@gmail.com"
    }
}
```

If the user's email changes, every goal document would also need to be updated.

Instead, MongoDB stores only the user's ObjectId.

Benefits:

* Avoids duplicate data.
* Saves storage space.
* Keeps data consistent.
* Makes updates easier.

---

# 3. The Role of `ref`

Goal Schema:

```javascript
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
}
```

Here:

* `type` stores the User's ObjectId.
* `ref` tells Mongoose that this ObjectId belongs to the **User** model.

The `ref` property does not automatically fetch user information.

It only tells Mongoose where the ObjectId belongs.

---

# 4. What Does `populate()` Do?

Without populate:

```javascript
const goals = await Goal.find();
```

Result:

```javascript
{
    goalName: "Buy Laptop",
    user: ObjectId("687cb93d...")
}
```

With populate:

```javascript
const goals = await Goal.find().populate("user");
```

Result:

```javascript
{
    goalName: "Buy Laptop",
    user: {
        _id: "...",
        name: "Lakshya",
        email: "lakshya@gmail.com",
        password: "$4fhruc$1fet3......"
    }
}
```

`populate()` replaces the ObjectId with the corresponding User document.

---

# 5. Does `populate()` Change MongoDB? - IMPORTANT

No.

MongoDB still stores:

```javascript
{
    goalName: "Buy Laptop",
    user: ObjectId("687cb93d...")
}
```

`populate()` only changes the data returned to Node.js.

It does **not** modify the database.

---

# 6. Selecting Specific Fields

Using:

```javascript
.populate("user")
```

returns every field from the User document, including the hashed password.

To return only the required fields:

```javascript
.populate("user", "name email")
```

Result:

```javascript
{
    goalName: "Buy Laptop",
    user: {
        name: "Lakshya",
        email: "lakshya@gmail.com"
    }
}
```

This is both more secure and more efficient.

---

# 7. Why Avoid Returning Every Field?

Returning every field can expose unnecessary information such as:

* Password
* Phone Number
* Address
* Role

Instead, always return only the fields required by the frontend.

This improves:

* Security
* Performance
* API Design

---

# 8. Flow

```text
Goal.find()
      │
      ▼
Goal Documents
      │
user contains ObjectId
      │
      ▼
.populate("user")
      │
      ▼
User Collection
      │
Find Matching ObjectId
      │
      ▼
Replace ObjectId
      │
      ▼
Return Complete User Document
```

---

# 9. Key Points

* MongoDB stores only ObjectIds for relationships.
* `ref` identifies which model the ObjectId belongs to.
* `populate()` retrieves the related document.
* `populate()` does not modify MongoDB.
* Use field selection to avoid exposing sensitive information.
* Return only the data required by the frontend.

---

# Commands Used

```javascript
.populate("user")

.populate("user", "name email")
```

---

# Common Mistakes

### ❌ Thinking `populate()` changes the database

It only changes the response returned by Node.js.

---

### ❌ Returning every field

```javascript
.populate("user")
```

This may expose sensitive information like hashed passwords.

---

### ✅ Better

```javascript
.populate("user", "name email")
```

---

