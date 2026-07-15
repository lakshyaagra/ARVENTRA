# Cloudinary Image Upload

# 1. Introduction

Most real-world applications allow users to upload images, documents, videos, and other files.

Examples:

* Profile Pictures
* Product Images
* Blog Images
* Course Thumbnails
* Resume Uploads
* Medical Reports

If these files are stored only on the server, managing them becomes difficult as the application grows.

To solve this problem, companies use **Cloud Storage Services**.

Cloudinary is one of the most popular cloud storage services for images and videos.

---

# 2. What is Cloudinary?

Cloudinary is a cloud-based media management service.

It allows developers to:

* Upload images
* Store images
* Optimize images
* Resize images
* Compress images
* Delete images
* Deliver images through a CDN

Instead of storing images on our own server, Cloudinary stores them safely on its own servers.

---

# 3. Why Do We Need Cloudinary?

Suppose 10,000 users upload profile pictures.

If each image is 2 MB:

```
10000 × 2 MB = 20 GB
```

Now imagine:

* Goal Images
* Profile Pictures
* Reports
* Documents

Eventually the server storage becomes full.

Cloudinary solves this problem because the storage responsibility moves from our server to Cloudinary.

---

# 4. Problems with Local Storage

If images are stored only inside our project folder:

```
uploads/
```

Problems include:

* Server storage keeps increasing.
* Images are lost if the server crashes.
* Images disappear after redeployment.
* Multiple servers cannot easily share the same files.
* Backups become difficult.
* Scalability becomes poor.

Therefore local storage is suitable only for development and testing.

---

# 5. Why Not Store Images Inside MongoDB?

MongoDB is designed to store structured data.

Example:

```
User Name

Email

Password

Goal Name

Target Amount
```

Images are binary files.

Storing large images inside MongoDB:

* Makes the database unnecessarily large.
* Slows down database operations.
* Increases backup size.
* Reduces overall performance.

Instead, MongoDB stores only information about the uploaded image.

Usually:

```
public_id

secure_url
```

The actual image remains inside Cloudinary.

---

# 6. Why Only Store `public_id` and `secure_url`?

Cloudinary returns many properties after uploading an image.

Example:

```
asset_id
public_id
version
signature
width
height
format
created_at
bytes
url
secure_url
resource_type
folder

...
```

We do not need all of these.

For Project Udaan, only these are required:

```
public_id

secure_url
```

### Why `secure_url`?

Because it allows us to display the uploaded image.

Example:

```
https://res.cloudinary.com/...
```

### Why `public_id`?

Because Cloudinary deletes images using the public ID.

Example:

```
cloudinary.uploader.destroy(public_id)
```

Without the public ID, Cloudinary cannot identify which image should be deleted.

---

# 7. Multer vs Cloudinary

## Multer

Responsibilities:

* Receives uploaded file.
* Parses multipart/form-data.
* Stores temporarily.
* Makes the file available through:

```javascript
req.file
```

---

## Cloudinary

Responsibilities:

* Receives the file.
* Uploads it to the cloud.
* Stores it permanently.
* Returns image information.

---

# 8. Complete Upload Flow

```
Client

      │

      ▼

Choose Image

      │

      ▼

HTTP Request

      │

      ▼

Express Route

      │

      ▼

Multer

      │

      ▼

Temporary File

      │

      ▼

Cloudinary Upload

      │

      ▼

Cloudinary Server

      │

      ▼

Returns

public_id

secure_url

      │

      ▼

Store Inside MongoDB

      │

      ▼

Delete Temporary File

      │

      ▼

Response
```

---

# 9. Updating an Image

Suppose a user changes their profile picture.

Steps:

1. Upload new image.
2. Cloudinary returns new `public_id`.
3. Delete previous image using old `public_id`.
4. Save new image information in MongoDB.

Flow:

```
Old Image

↓

Delete from Cloudinary

↓

Upload New Image

↓

Save New public_id

↓

Save New secure_url
```

---

# 10. Deleting an Image

Deleting an image involves two platforms.

## Cloudinary

Delete actual image.

```
cloudinary.uploader.destroy(public_id)
```

---

## MongoDB

Delete or update the document containing:

```
public_id

secure_url
```

This keeps both Cloudinary and MongoDB synchronized.

---

# 11. Project Udaan Implementation

Current usage:

```
Authentication

↓

Profile Picture
```

Future usage:

* Goal Images
* Learning Thumbnails
* Report Attachments
* User Documents
* AI Generated Images (future)
* Other media uploads

---

# 12. Why Do We Delete the Temporary File?

When Multer uploads the image, it creates a temporary copy.

After Cloudinary successfully stores the image:

```
Server

↓

Temporary File

↓

Delete
```

Reason:

The file already exists safely inside Cloudinary.

Keeping the temporary copy wastes server storage.

---

# 13. Important Concepts

### Temporary Storage

Created by Multer.

---

### Permanent Storage

Provided by Cloudinary.

---

### Image URL

Used by the frontend.

---

### Public ID

Used internally by Cloudinary.

---

### MongoDB

Stores only the image information.

---

# 14. Advantages of Cloudinary

* Unlimited scalability (depending on plan).
* Automatic image optimization.
* CDN support.
* Secure HTTPS URLs.
* Easy deletion.
* Easy replacement.
* Fast image delivery.
* Production-ready.

---

# 15. Common Mistakes

### ❌ Saving Images Inside MongoDB

Only save:

```
public_id

secure_url
```

---

### ❌ Forgetting to Delete Temporary Files

Always remove Multer's temporary file after a successful upload.

---

### ❌ Forgetting to Delete Old Images

When replacing an image:

1. Delete old Cloudinary image.
2. Upload new image.
3. Update MongoDB.

Otherwise unused images keep occupying Cloudinary storage.

---

### ❌ Deleting Only MongoDB Document

Deleting the database document does **not** remove the image from Cloudinary.

Both must be synchronized.

---

# Summary

Cloudinary is a cloud-based media storage platform that stores images outside our server, making applications scalable and production-ready. Multer receives uploaded files and temporarily stores them before Cloudinary uploads them permanently. MongoDB stores only the image metadata (`public_id` and `secure_url`) while Cloudinary stores the actual image. Proper synchronization between Cloudinary and MongoDB ensures efficient storage management and prevents orphaned files.

---

# Commands Used

```javascript
cloudinary.uploader.upload()

cloudinary.uploader.destroy()

fs.unlinkSync()

req.file
```

---

# Code Written

* Cloudinary Configuration
* Multer Configuration
* Upload API
* Delete API
* Update Image Logic

---

# Notes

* Multer only handles file uploads.
* Cloudinary permanently stores the uploaded image.
* MongoDB stores only image information.
* `secure_url` is used to display the image.
* `public_id` is used to delete or replace the image.
* Always remove temporary files after a successful upload.
* Always delete old Cloudinary images when replacing them.

---

