# Multimedia Profile API Documentation

## 1. List Multimedia Profile(s)
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/v2/multimedia-profile`
- **Query Parameters:** `filter`, `attributes`, `search`, `page`, `pageSize`

## 2. Create a new Multimedia Profile
**Method:** `POST`
**Endpoint:** `/organization/{orgid}/multimedia-profile`
- **Request Body:** `MultimediaProfileDTO`
  - `name` (string, required)
  - `chat`, `email`, `social` (integer, max 5, required)
  - `telephony` (integer, max 1, required)
  - `blendingMode` (string, required): `BLENDED`, `BLENDED_REALTIME`, or `EXCLUSIVE`

## 3. Get specific Multimedia Profile by ID
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/multimedia-profile/{id}`

## 4. Update specific Multimedia Profile by ID
**Method:** `PUT`
**Endpoint:** `/organization/{orgid}/multimedia-profile/{id}`

## 5. Delete specific Multimedia Profile by ID
**Method:** `DELETE`
**Endpoint:** `/organization/{orgid}/multimedia-profile/{id}`

## 6. List references for a specific Multimedia Profile
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/multimedia-profile/{id}/incoming-references`

## 7. Bulk export Multimedia Profile(s)
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/multimedia-profile/bulk-export`

## 8. Bulk save Multimedia Profile(s)
**Method:** `POST`
**Endpoint:** `/organization/{orgid}/multimedia-profile/bulk`

## 9. Purge inactive Multimedia Profile(s)
**Method:** `POST`
**Endpoint:** `/organization/{orgid}/multimedia-profile/purge-inactive-entities`
