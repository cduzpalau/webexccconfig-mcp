# Dial Number API Documentation

## 1. Bulk export Dialed Number Mapping(s)
- **Method:** `GET`
- **URL:** `/organization/{orgid}/dial-number/bulk-export`

## 2. Bulk save Dialed Number Mapping(s)
- **Method:** `POST`
- **URL:** `/organization/{orgid}/dial-number/bulk`

## 3. Create a new Dialed Number Mapping
- **Method:** `POST`
- **URL:** `/organization/{orgid}/dial-number`
- **Request Body (DialledNumberEntryPointDTO):**
  - `dialledNumber` (string)
  - `entryPointId` (string, required)
  - `entryPointName` (string, required)
  - `dialledNumberType`: `PSTN_NUMBER`, `BRIDGE_NUMBER`, `WXC_NUMBER`, `SOCIAL_MESSAGING`, `MWA_NUMBER`.

## 4. Delete all Dialed Number Mapping(s)
- **Method:** `DELETE`
- **URL:** `/organization/{orgid}/dial-number`

## 5. Delete specific Dialed Number Mapping by ID
- **Method:** `DELETE`
- **URL:** `/organization/{orgid}/dial-number/{id}`

## 6. Get specific Dialed Number Mapping by ID
- **Method:** `GET`
- **URL:** `/organization/{orgid}/dial-number/{id}`

## 7. List only dialed numbers
- **Method:** `GET`
- **URL:** `/organization/{orgid}/dial-number/numbers-only`
- **Description:** Returns a flat list of dialed numbers (strings) without pagination.

## 8. List Dialed Number Mapping(s)
- **Method:** `GET`
- **URL:** `/organization/{orgid}/v3/dial-number`
- **Query Parameters:** `filter`, `search`, `page`, `pageSize`, `includeEntryPointName`.

## 9. List references for a specific Dialed Number Mapping
- **Method:** `GET`
- **URL:** `/organization/{orgid}/dial-number/{id}/incoming-references`

## 10. Update specific Dialed Number Mapping by ID
- **Method:** `PUT`
- **URL:** `/organization/{orgid}/dial-number/{id}`
- **Request Body:** `DialledNumberEntryPointDTO`
