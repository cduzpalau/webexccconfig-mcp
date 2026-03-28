# Resource Collection API Documentation

## 1. Bulk partial update Resource Collections
**Method:** `PATCH`
**Endpoint:** `/organization/{orgid}/resource-collection/bulk`
- **Request Body:** Bulk items array of `SAVE` / `DELETE`

## 2. Create a new Resource Collection
**Method:** `POST`
**Endpoint:** `/organization/{orgid}/resource-collection`
- **Request Body:** `name`, `description`, etc.

## 3. Delete specific Resource Collection by ID
**Method:** `DELETE`
**Endpoint:** `/organization/{orgid}/resource-collection/{id}`

## 4. Get specific Resource Collection by ID
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/resource-collection/{id}`

## 5. List references for a specific Resource Collection
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/resource-collection/{id}/incoming-references`

## 6. List Resource Collections
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/v2/resource-collection`
- **Query Parameters:** `filter`, `attributes`, `search`, `page`, `pageSize`

## 7. Update resource with default resource collection
**Method:** `POST`
**Endpoint:** `/organization/{orgid}/resource-collection/update-resource`
- **Request Body:** `resourceId`, `resourceType`, `resourceCollections`

## 8. Update specific Resource Collection by ID
**Method:** `PUT`
**Endpoint:** `/organization/{orgid}/resource-collection/{id}`
