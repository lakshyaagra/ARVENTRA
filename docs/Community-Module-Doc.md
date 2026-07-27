# Community Module Documentation

## 1. Module Overview

The Community Module allows users to interact with financial learning content through discussions, blogs, questions, comments, and likes.

The purpose of this module is to create a community-driven financial learning environment where users can:

* Share financial experiences.
* Ask questions.
* Write educational blogs.
* Discuss financial topics.
* Interact through comments and likes.

The module is integrated with the Learning Module where discussions appear alongside educational content.

---

# 2. Module Features

## Discussion System

Users can create:

* Blogs
* Questions

Users can:

* View discussions.
* Update their own discussions.
* Delete their own discussions.

---

## Comment System

Users can:

* Add comments on discussions.
* View comments.
* Update their own comments.
* Delete their own comments.

---

## Like System

Users can:

* Like discussions.
* Unlike discussions.

The same API handles both operations using toggle functionality.

---

# 3. Database Architecture

## Collections

```
User

Discussion

Comment

Like
```

---

# 4. Discussion Schema

## Purpose

Stores user-created financial discussions.

Example:

```javascript
{
    user: ObjectId,

    title: "How should beginners start investing?",

    content: "I want to understand mutual funds.",

    type: "question",

    category: "investment",

    tags: [
        "mutual-funds",
        "beginner"
    ],

    likesCount: 10,

    commentsCount: 5
}
```

---

## Fields

| Field         | Type     | Description             |
| ------------- | -------- | ----------------------- |
| user          | ObjectId | Discussion creator      |
| title         | String   | Discussion title        |
| content       | String   | Main discussion content |
| type          | String   | blog/question           |
| category      | String   | Financial category      |
| tags          | Array    | Searchable tags         |
| likesCount    | Number   | Total likes             |
| commentsCount | Number   | Total comments          |

---

# 5. Comment Schema

## Purpose

Stores comments made on discussions.

Example:

```javascript
{
    discussion: ObjectId,

    user: ObjectId,

    comment:"Very useful information.",

    isEdited:false
}
```

---

## Fields

| Field      | Type     | Description         |
| ---------- | -------- | ------------------- |
| discussion | ObjectId | Related discussion  |
| user       | ObjectId | Comment author      |
| comment    | String   | Comment text        |
| isEdited   | Boolean  | Shows edited status |

---

# 6. Like Schema

## Purpose

Stores user likes on discussions.

Example:

```javascript
{
    discussion:ObjectId,

    user:ObjectId
}
```

---

## Unique Constraint

```javascript
likeSchema.index(
{
    discussion:1,
    user:1
},
{
    unique:true
}
);
```

## Reason

A user can like a discussion only once.

Example:

Allowed:

```
Rahul → Discussion A
```

Not allowed:

```
Rahul → Discussion A
Rahul → Discussion A
```

This prevents duplicate likes.

---

# 7. Validation Middleware

## Discussion Validation

File:

```
middleware/validateDiscussion.js
```

Validates:

* Title
* Content
* Type
* Category
* Tags

---

## Update Discussion Validation

File:

```
middleware/validateUpdateDiscussion.js
```

Validates only provided fields.

Example:

Updating only title:

```json
{
"title":"New Title"
}
```

Only title validation runs.

---

## Comment Validation

File:

```
middleware/validateComment.js
```

Validates:

* Comment required.
* Minimum length.
* Maximum length.

---

## Update Comment Validation

File:

```
middleware/validateUpdateComment.js
```

Validates edited comments.

---

# 8. Controllers

## Discussion Controller

File:

```
controllers/discussionController.js
```

---

## createDiscussion()

Creates a new discussion.

Flow:

```
Request

↓

Validate Data

↓

Attach Logged User

↓

Create Discussion

↓

Return Response
```

---

## getDiscussions()

Fetches discussions.

Supports:

* Category filtering.
* Pagination.
* Sorting.

---

## updateDiscussionById()

Updates only user's own discussion.

Security:

```javascript
{
_id:id,
user:req.user.id
}
```

ensures ownership.

---

## deleteDiscussionById()

Deletes user's own discussion.

---

# Comment Controller

File:

```
controllers/commentController.js
```

---

## createComment()

Creates a comment.

Flow:

```
Receive Discussion ID

↓

Check Discussion Exists

↓

Create Comment

↓

Increase commentsCount

↓

Return Comment
```

---

## getComments()

Fetches all comments of a discussion.

Uses:

```javascript
.populate("user","name")
```

to show comment author's name.

---

## updateCommentById()

Allows users to edit their own comments.

Updates:

```javascript
comment
```

Only.

---

## deleteCommentById()

Deletes user's comment.

Also decreases:

```javascript
commentsCount
```

using:

```javascript
$inc:{
commentsCount:-1
}
```

---

# Like Controller

File:

```
controllers/likeController.js
```

---

## toggleLike()

Handles:

* Like
* Unlike

Single endpoint:

```
POST /community/:id/like
```

---

## Logic

If like exists:

```
Delete Like

Decrease likesCount
```

Otherwise:

```
Create Like

Increase likesCount
```

---

# 9. Routes Architecture

```
routes/

discussionRoutes.js

commentRoutes.js

likeRoutes.js
```

---

# Discussion Routes

Base:

```
/community
```

| Method | Endpoint       | Purpose           |
| ------ | -------------- | ----------------- |
| POST   | /community     | Create discussion |
| GET    | /community     | Get discussions   |
| PATCH  | /community/:id | Update discussion |
| DELETE | /community/:id | Delete discussion |

---

# Comment Routes

| Method | Endpoint                | Purpose        |
| ------ | ----------------------- | -------------- |
| POST   | /community/:id/comments | Create comment |
| GET    | /community/:id/comments | Get comments   |
| PATCH  | /community/comments/:id | Update comment |
| DELETE | /community/comments/:id | Delete comment |

---

# Like Routes

| Method | Endpoint            | Purpose                |
| ------ | ------------------- | ---------------------- |
| POST   | /community/:id/like | Like/Unlike discussion |

---

# 10. Authentication Flow

All operations require authentication.

Flow:

```
User Login

↓

JWT Generated

↓

Token Sent With Request

↓

Auth Middleware

↓

req.user Created

↓

Controller Executes
```

---

# 11. Security Considerations

## Ownership Check

Users can modify only their own content.

Example:

```javascript
Discussion.findOne({

_id:id,

user:req.user.id

})
```

---

## Password Protection

User information populated:

Allowed:

```javascript
.populate(
"user",
"name"
)
```

Not allowed:

```
password
email
```

---

# 12. Final Folder Structure

```
backend/

├── controllers/

│
├── discussionController.js

│
├── commentController.js

│
└── likeController.js


├── models/

│
├── Discussion.js

│
├── Comment.js

│
└── Like.js


├── middleware/

│
├── validateDiscussion.js

│
├── validateUpdateDiscussion.js

│
├── validateComment.js

│
└── validateUpdateComment.js


└── routes/

    ├── discussionRoutes.js

    ├── commentRoutes.js

    └── likeRoutes.js
```

---
