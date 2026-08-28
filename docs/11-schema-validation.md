# Mongoose Schema Validation

# 1. Introduction

A Schema defines the structure of a document, but it can also validate data before it is saved into MongoDB.

Validation ensures that only valid and meaningful data enters the database.

Example:

❌ Invalid Goal

```json
{
    "goalName": "",
    "targetAmount": -500
}
```

Without validation, MongoDB would store this document because an empty string is still a String and `-500` is still a Number.

Schema Validation prevents such invalid data from being stored.

---

# 2. Why Do We Need Schema Validation?

Validation Middleware checks incoming requests.

Schema Validation protects the database itself.

Even if data reaches the Model directly, the Schema still validates it before saving.

This creates an additional layer of protection.

---

# 3. Type Validation

Example:

```javascript
goalName: String,
targetAmount: Number
```

This only checks the data type.

Examples:

✔

```json
{
    "goalName":"Car",
    "targetAmount":500000
}
```

✔

```json
{
    "goalName":"",
    "targetAmount":-500
}
```

Both pass because the types are correct.

---

# 4. Required Validator

Example:

```javascript
goalName:{
    type:String,
    required:true
}
```

Purpose:

The client must provide this field.

Example:

❌

```json
{
    "targetAmount":50000
}
```

Result:

```text
ValidationError:
Path "goalName" is required.
```

---

# 5. Trim Validator

Example:

```javascript
goalName:{
    type:String,
    trim:true
}
```

Input:

```json
{
    "goalName":"     Laptop     "
}
```

Stored in MongoDB:

```json
{
    "goalName":"Laptop"
}
```

Only leading and trailing spaces are removed.

---

# 6. Minimum Value (min)

Example:

```javascript
targetAmount:{
    type:Number,
    min:1
}
```

Purpose:

Prevents invalid numeric values.

Examples:

❌

```json
{
    "targetAmount":0
}
```

❌

```json
{
    "targetAmount":-100
}
```

✔

```json
{
    "targetAmount":1000
}
```

---

# 7. Default Value

Example:

```javascript
status:{
    type:String,
    default:"active"
}
```

If the client does not send the `status` field, Mongoose automatically inserts:

```text
active
```

Example Request:

```json
{
    "goalName":"Buy Bike",
    "targetAmount":90000
}
```

Stored Document:

```json
{
    "goalName":"Buy Bike",
    "targetAmount":90000,
    "status":"active"
}
```

---

# 8. Enum Validator

Example:

```javascript
status:{
    type:String,
    enum:["active","completed"]
}
```

Allowed Values:

✔ active

✔ completed

Rejected Values:

❌ pending

❌ running

❌ etc

Only the values listed inside the enum array are accepted.

---

# 9. Complete Schema

```javascript
const goalSchema = new mongoose.Schema({

    goalName:{
        type:String,
        required:true,
        trim:true
    },

    targetAmount:{
        type:Number,
        required:true,
        min:1
    },

    status:{
        type:String,
        default:"active",
        enum:["active","completed"]
    }

});
```

---

# 10. Validation Flow

```text
Client

   │

   ▼

Request Body

   │

   ▼

Express Route

   │

   ▼

Controller

   │

   ▼

Goal.create(req.body)

   │

   ▼

Mongoose Schema Validation

   │

 ┌──────────────┴───────────────┐

 ▼                              ▼

Valid Data                  Invalid Data

 │                              │

 ▼                              ▼

MongoDB                  Validation Error
```

---

# 11. Key Points

* Validation occurs before saving the document.
* Validation protects the database.
* `required` makes a field mandatory.
* `trim` removes extra spaces.
* `min` enforces a minimum numeric value.
* `default` inserts a value automatically.
* `enum` restricts allowed values.

---

# Summary

Schema Validation ensures that only valid data is stored in MongoDB. Mongoose provides validators such as `required`, `trim`, `min`, `default`, and `enum` to enforce business rules and maintain data integrity.

---

# Commands Used

```javascript
required

trim

min

default

enum     ......
```

---

# Notes

Validation Middleware protects incoming requests, while Schema Validation protects the database. Together, they provide multiple layers of data validation in Project Udaan.

---