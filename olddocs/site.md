# Site API Documentation

## 1. Bulk export Site(s)
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/site/bulk-export`

## 2. Bulk save Site(s)
**Method:** `POST`
**Endpoint:** `/organization/{orgid}/site/bulk`

## 3. Create a new Site
**Method:** `POST`
**Endpoint:** `/organization/{orgid}/site`
- **Request Body:** `name`, `active`, `multimediaProfileId`, `description`, `systemDefault`

## 4. Delete specific Site by ID
**Method:** `DELETE`
**Endpoint:** `/organization/{orgid}/site/{id}`

## 5. Get specific Site by ID
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/site/{id}`

## 6. List references for a specific Site
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/site/{id}/incoming-references`

## 7. List Site(s)
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/v2/site`
- **Query Parameters:** `filter`, `attributes`, `search`, `page`, `pageSize`

## 8. Purge inactive Site(s)
**Method:** `POST`
**Endpoint:** `/organization/{orgid}/site/purge-inactive-entities`

## 9. Update specific Site by ID
**Method:** `PUT`
**Endpoint:** `/organization/{orgid}/site/{id}`
