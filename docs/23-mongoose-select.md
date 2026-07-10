# Mongoose Select

# 1. Introduction

By default, Mongoose returns every field of a document when using methods like `find()` or `findOne()`.

Example:

```javascript
const user = await User.findOne({
    email: req.body.email
});
```

Result:

```javascript
{
    _id: "...",
    name: "Lakshya",
    email: "lakshya@gmail.com",
    password: "$2b$10$..."
}
```

The hashed password is also returned.

Although the password is hashed, it should not be exposed unless absolutely necessary.

---

# 2. Why Hide the Password?

Most API responses never require the password.

Examples:

* User Profile
* Dashboard
* Goals
* Reports
* Learning Section

Returning the password unnecessarily:

* Exposes sensitive information.
* Increases response size.
* Makes accidental leaks more likely.

---

# 3. Using `select: false`

Mongoose allows us to hide a field directly in the schema.

Example:

```javascript
password: {
    type: String,
    required: true,
    minlength: 7,
    select: false
}
```

Now every normal query automatically hides the password.

Example:

```javascript
const user = await User.findOne({
    email: req.body.email
});
```

Result:

```javascript
{
    _id: "...",
    name: "Lakshya",
    email: "lakshya@gmail.com"
}
```

---

# 4. Why Login Still Works

During login, we need the hashed password to compare it using `bcrypt.compare()`.

Since the password is hidden by default, we explicitly request it.

```javascript
const user = await User.findOne({
    email: req.body.email
}).select("+password");
```

Now Mongoose temporarily includes the password.

Result:

```javascript
{
    _id: "...",
    name: "Lakshya",
    email: "lakshya@gmail.com",
    password: "$2b$10$..."
}
```

This allows:

```javascript
bcrypt.compare(
    req.body.password,
    user.password
);
```

to work correctly.

---

# 5. Default Behavior

Without:

```javascript
select: false
```

Every query returns:

```javascript
name
email
password
```

With:

```javascript
select: false
```

Every query returns:

```javascript
name
email
```

Only queries that explicitly request the password receive it.

---

# 6. Advantages

* Password stays hidden by default.
* Better security.
* Cleaner controllers.
* Less repeated code.
* Follows production-level practices.

---

# 7. Flow

```text
User Schema
      │
      ▼
password
select:false
      │
      ▼
Normal Query
      │
      ▼
Password Hidden
      │
      ▼
Login Query
.select("+password")
      │
      ▼
Password Included
      │
      ▼
bcrypt.compare()
```

---

# 8. Key Points

* `select: false` hides a field by default.
* The field is still stored in MongoDB.
* Hidden fields can be requested using `.select("+fieldName")`.
* Login is the most common place where the password is explicitly selected.
* This improves both security and code quality.

---

# Commands Used

```javascript
select: false

.select("+password")
```

---

# Common Mistakes

### ❌ Forgetting `.select("+password")` during login

Result:

```javascript
user.password
```

becomes

```javascript
undefined
```

and `bcrypt.compare()` fails.

---

### ❌ Returning passwords in every API

Never expose hashed passwords unless absolutely necessary.

---