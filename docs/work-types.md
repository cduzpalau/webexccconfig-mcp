# Work Types API Documentation

## 1. Bulk export Work Type(s)
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/work-type/bulk-export`

## 2. Bulk save Work Type(s)
**Method:** `POST`
**Endpoint:** `/organization/{orgid}/work-type/bulk`

## 3. Create a new Work Type
**Method:** `POST`
**Endpoint:** `/organization/{orgid}/work-type`
- **Request Body:** `name`, `description`, `workTypeCode` ('WRAP_UP_CODE' or 'IDLE_CODE'), `active`

## 4. Delete specific Work Type by ID
**Method:** `DELETE`
**Endpoint:** `/organization/{orgid}/work-type/{id}`

## 5. Get specific Work Type by ID
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/work-type/{id}`

## 6. List references for a specific Work Type
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/work-type/{id}/incoming-references`

## 7. List Work Type(s)
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/v2/work-type`
- **Query Parameters:** `filter`, `attributes`, `search`, `page`, `pageSize`

## 8. Purge inactive Work Type(s)
**Method:** `POST`
**Endpoint:** `/organization/{orgid}/work-type/purge-inactive-entities`

## 9. Update specific Work Type by ID
**Method:** `PUT`
**Endpoint:** `/organization/{orgid}/work-type/{id}`
