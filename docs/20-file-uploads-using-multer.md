# File Uploads Using Multer

# 1. Introduction

Web applications often require users to upload files such as:

* Profile Pictures
* Goal Images
* Documents
* Certificates
* Reports

Express cannot process uploaded files on its own because files are sent using **multipart/form-data** instead of JSON.

Multer solves this problem.

---

# 2. Why Express Cannot Upload Files

Express understands requests like:

```json
{
    "name":"Lakshya",
    "email":"lakshya@gmail.com"
}
```

using

```javascript
express.json()
```

However, image files are binary data and cannot be represented as JSON.

Browsers therefore send uploaded files using:

```text
multipart/form-data
```

Express cannot parse this format by itself.

---

# 3. What is Multer?

Multer is Express middleware that processes file uploads.

It extracts uploaded files from multipart/form-data requests and provides them through:

```javascript
req.file
```

or

```javascript
req.files
```

Text fields continue to be available inside:

```javascript
req.body
```

---

# 4. Flow of File Upload

```
User
   │
Choose Image
   │
   ▼
Browser
   │
multipart/form-data
   │
   ▼
Express
   │
   ▼
Multer
   │
   ├────────► req.body
   │
   ├────────► req.file
   │
   ▼
uploads/
```

---

# 5. Disk Storage

Multer stores uploaded files temporarily inside a folder.

Example:

```javascript
const storage = multer.diskStorage({

    destination:(req,file,cb)=>{

        cb(null,"uploads/");

    },

    filename:(req,file,cb)=>{

        cb(null,Date.now()+path.extname(file.originalname));

    }

});
```

---

# 6. destination()

Determines where the uploaded file should be stored.

Example:

```javascript
cb(null,"uploads/");
```

---

# 7. filename()

Determines the stored filename.

Instead of

```
profile.png
```

Multer generates

```
1723968156701.png
```

using

```javascript
Date.now()
```

to avoid duplicate filenames.

---

# 8. File Filter

Only image files should be accepted.

Example:

```javascript
const allowedTypes=[
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
];
```

Non-image files are rejected.

---

# 9. File Size Limit

Large uploads should be restricted.

Example:

```javascript
limits:{
    fileSize:5*1024*1024
}
```

Maximum upload size:

```
5 MB
```

---

# 10. Creating Multer Instance

```javascript
const upload=multer({

    storage,

    fileFilter,

    limits:{
        fileSize:5*1024*1024
    }

});
```

---

# 11. Using Multer

Single file upload:

```javascript
upload.single("image")
```

Multiple files:

```javascript
upload.array("documents",5)
```

---

# 12. req.body vs req.file

Suppose the request contains:

```
Name: Lakshya

Email: lakshya@gmail.com

Image: profile.png
```

Then

```javascript
req.body
```

contains

```javascript
{
    name:"Lakshya",

    email:"lakshya@gmail.com"
}
```

and

```javascript
req.file
```

contains

```javascript
{
    originalname:"profile.png",

    filename:"1723968156701.png",

    mimetype:"image/png",

    destination:"uploads/",

    path:"uploads/1723968156701.png",

    size:32623
}
```

---

# 13. Testing

Method:

```
POST
```

Body:

```
form-data
```

Key:

```
image
```

Type:

```
File
```

Expected result:

* File appears inside uploads folder.
* req.file contains uploaded file information.

---

# 14. Why We Don't Store Files in MongoDB

MongoDB is designed to store structured data.

Instead of storing image files, MongoDB stores only the image URL.

Example:

```javascript
{
    profilePicture:
    "https://res.cloudinary.com/projectudaan..../profile.png"
}
```

---

# 15. Why Multer Uses Temporary Storage

Files are first stored temporarily inside the server.

Later they are uploaded to Cloudinary.

After successful upload, the temporary file is deleted.

Flow:

```
Browser

↓

Multer

↓

uploads/

↓

Cloudinary

↓

Delete Local File

↓

MongoDB (Store URL)
```

---

# Summary

Multer is Express middleware used to process multipart/form-data requests. It extracts uploaded files, temporarily stores them on the server, and provides file information through req.file while normal form fields remain available inside req.body. In production applications, uploaded files are generally moved to cloud storage such as Cloudinary, and only their URLs are stored in MongoDB.

---

# Commands Used

```bash
npm install multer
```

---

# Files Created

```
config/multer.js

uploads/
```

---