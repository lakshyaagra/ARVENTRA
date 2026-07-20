# Assets Module

## Objective

In this milestone, we built the complete **Asset Management Module** for Project Udaan. The module allows authenticated users to create, view, update, delete, search, filter, sort, and paginate their financial assets while ensuring proper validation, authentication, and resource ownership.

------------------------------------------------------------------------

# Features Implemented

## Asset Creation

-   Create a new asset.
-   Associate every asset with the logged-in user.
-   Validation middleware checks all incoming data before saving.

------------------------------------------------------------------------

## Asset Retrieval

Users can:

-   View all their assets.
-   View a single asset using its ID.
-   Access only their own assets.

------------------------------------------------------------------------

## Asset Updation

Users can update:

-   Asset Name
-   Category
-   Current Value
-   Purchase Value
-   Purchase Date
-   Institution
-   Notes

Validation is performed only on the fields supplied by the client.

------------------------------------------------------------------------

## Asset Deletion

Users can delete only their own assets.

------------------------------------------------------------------------

# Asset Schema

Fields implemented:

-   assetName
-   category
-   currentValue
-   purchaseValue
-   purchaseDate
-   institution
-   notes
-   user

------------------------------------------------------------------------

# Business Rules

The backend enforces:

-   Asset Name is required.
-   Current Value must be greater than 0.
-   Purchase Value cannot be negative.
-   Purchase Date cannot be in the future.
-   Category must be one of the predefined categories.
-   Institution cannot be an empty string.
-   Notes cannot be an empty string.

------------------------------------------------------------------------

# Supported Asset Categories

-   bank
-   cash
-   fixed-deposit
-   recurring-deposit
-   mutual-fund
-   stock
-   gold
-   property
-   crypto
-   epf
-   ppf
-   vehicle
-   business
-   other

------------------------------------------------------------------------

# Validation Middleware

## validateAsset

Used while creating an asset.

Validates:

-   Asset Name
-   Category
-   Current Value
-   Purchase Value
-   Purchase Date
-   Institution
-   Notes

------------------------------------------------------------------------

## validateUpdateAsset

Used while updating an asset.

Allows partial updates.

Validates only the fields provided by the client.

------------------------------------------------------------------------

# Security

Every asset belongs to a single authenticated user.

Queries always use:

``` javascript
{
    _id: id,
    user: req.user.id
}
```

This prevents users from accessing or modifying other users' assets.

------------------------------------------------------------------------

# Controllers

Implemented:

-   createAsset
-   getAssets
-   getAssetById
-   updateAssetById
-   deleteAssetById

------------------------------------------------------------------------

# Supported Query Parameters

## Sorting

``` text
GET /assets?sort=assetName
GET /assets?sort=currentValue&order=desc
```

## Searching

``` text
GET /assets?search=Gold
```

## Filtering

``` text
GET /assets?category=mutual-fund
```

## Pagination

``` text
GET /assets?page=2&limit=10
```

Response includes:

-   Current Page
-   Total Pages
-   Total Assets
-   Has Next Page
-   Has Previous Page

------------------------------------------------------------------------

# Routes

``` text
POST   /assets
GET    /assets
GET    /assets/:id
PUT    /assets/:id
DELETE /assets/:id
```

------------------------------------------------------------------------

# Middleware Flow

``` text
Client
   │
   ▼
Auth Middleware
   │
   ▼
Validation Middleware
   │
   ▼
Asset Controller
   │
   ▼
MongoDB
   │
   ▼
Response
```

------------------------------------------------------------------------

# Important Concepts Learned

-   Resource Ownership
-   Authentication
-   Authorization
-   Validation Middleware
-   Partial Updates
-   Search using Regex
-   Category Filtering
-   Sorting
-   Pagination
-   Route Protection
-   REST API Design

------------------------------------------------------------------------

# Commands Used

``` javascript
Asset.create()
Asset.find()
Asset.findOne()
asset.save()
asset.deleteOne()
Asset.countDocuments()
Object.assign()
```

------------------------------------------------------------------------

# Summary

The Assets Module provides complete CRUD functionality with strong validation, authentication authorization, searching, filtering, sorting, and pagination. It follows the same backend architecture as the Goals and Loans modules, ensuring consistency throughout Project Udaan.
