# User Profiles API Documentation

## 1. Bulk export User Profiles
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/v3/user-profile/bulk-export`

## 2. Bulk save User Profiles
**Method:** `POST`
**Endpoint:** `/organization/{orgid}/v3/user-profile/bulk`

## 3. Create a new User Profile
**Method:** `POST`
**Endpoint:** `/organization/{orgid}/v3/user-profile`
- **Request Body:** `name`, `description`, `profileType`, `active`, `permissionAccessLevel`, `resourceAccessLevel`, etc.

## 4. Delete specific User Profile by ID
**Method:** `DELETE`
**Endpoint:** `/organization/{orgid}/v3/user-profile/{id}`

## 5. Get specific User Profile ACL by ID
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/v3/user-profile/{id}/acl`

## 6. Get specific User Profile by ID
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/v3/user-profile/{id}`

## 7. List references for a specific User Profile
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/v3/user-profile/{id}/incoming-references`

## 8. List user profiles
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/v3/user-profile`
- **Query Parameters:** `filter`, `attributes`, `search`, `page`, `pageSize`

## 9. Update specific User Profile by ID
**Method:** `PUT`
**Endpoint:** `/organization/{orgid}/v3/user-profile/{id}`
