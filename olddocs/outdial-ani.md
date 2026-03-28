# Outdial ANI API Documentation

## 1. Bulk export Outdial ANI(s)
**Method:** `GET`
**Endpoint:** `/organization/{orgId}/outdial-ani/bulk-export`

## 2. Bulk save Outdial ANI Entry(s)
**Method:** `POST`
**Endpoint:** `/organization/{orgid}/outdial-ani/{outDialAniId}/entry/bulk`

## 3. Bulk save Outdial ANI(s)
**Method:** `POST`
**Endpoint:** `/organization/{orgid}/outdial-ani/bulk`

## 4. Create a new Outdial ANI
**Method:** `POST`
**Endpoint:** `/organization/{orgid}/outdial-ani`
- **Request Body:** `OutdialANIDTO` (`name`, `description`)

## 5. Create a new Outdial ANI Entry
**Method:** `POST`
**Endpoint:** `/organization/{orgid}/outdial-ani/{outDialAniId}/entry`
- **Request Body:** `OutdialANIEntryDTO` (`name`, `number`)

## 6. Delete specific Outdial ANI by ID
**Method:** `DELETE`
**Endpoint:** `/organization/{orgId}/outdial-ani/{id}`

## 7. Delete specific Outdial ANI Entry by ID
**Method:** `DELETE`
**Endpoint:** `/organization/{orgid}/outdial-ani/{outDialAniId}/entry/{id}`

## 8. Get specific Outdial ANI by ID
**Method:** `GET`
**Endpoint:** `/organization/{orgId}/outdial-ani/{id}`

## 9. Get specific Outdial ANI Entry by ID
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/outdial-ani/{outDialAniId}/entry/{id}`

## 10. List Outdial ANI Entry(s)
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/outdial-ani/{outDialAniId}/entry`

## 11. List Outdial ANI(s)
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/v2/outdial-ani`
- **Query Params:** `filter`, `attributes`, `search`, `page`, `pageSize`, `singleObjectResponse`

## 12. List references for a specific Outdial ANI
**Method:** `GET`
**Endpoint:** `/organization/{orgId}/outdial-ani/{id}/incoming-references`

## 13. Update specific Outdial ANI by ID
**Method:** `PUT`
**Endpoint:** `/organization/{orgId}/outdial-ani/{id}`

## 14. Update specific Outdial ANI Entry by ID
**Method:** `PUT`
**Endpoint:** `/organization/{orgid}/outdial-ani/{outDialAniId}/entry/{id}`
