# Skill Profile API Documentation

## 1. Bulk export Skill Profile(s)
**Method:** `GET`
**Endpoint:** `/organization/{orgId}/skill-profile/bulk-export`

## 2. Bulk save Skill Profile(s)
**Method:** `POST`
**Endpoint:** `/organization/{orgid}/skill-profile/bulk`

## 3. Create a new Skill Profile
**Method:** `POST`
**Endpoint:** `/organization/{orgid}/skill-profile`
- **Request Body:** `name`, `description`, `activeSkills`, `activeEnumSkills`

## 4. Delete specific Skill Profile by ID
**Method:** `DELETE`
**Endpoint:** `/organization/{orgid}/skill-profile/{id}`

## 5. Get specific Skill Profile by ID
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/skill-profile/{id}`

## 6. List references for a specific Skill Profile
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/skill-profile/{id}/incoming-references`

## 7. List Skill Profile(s)
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/v2/skill-profile`
- **Query Parameters:** `filter`, `attributes`, `search`, `page`, `pageSize`, `singleObjectResponse`

## 8. Update specific Skill Profile by ID
**Method:** `PUT`
**Endpoint:** `/organization/{orgid}/skill-profile/{id}`
