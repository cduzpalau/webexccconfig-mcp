# Entry Point API Documentation

## 1. Bulk export Entry Point(s)
**Method:** `GET`
**Endpoint:** `/organization/{orgId}/entry-point/bulk-export`
- **Query Parameters:** `type` (Enum: INBOUND, OUTBOUND, Required), `page`, `pageSize`

## 2. Bulk save Entry Point(s)
**Method:** `POST`
**Endpoint:** `/organization/{orgId}/entry-point/bulk`
- **Request Body:** `BulkRequestDTOEntryPointDTO` (Array of items with `requestAction` and `item`)

## 3. Create a new Entry Point
**Method:** `POST`
**Endpoint:** `/organization/{orgId}/entry-point`
- **Request Body:** `EntryPointDTO`
  - `name` (string, required)
  - `entryPointType` (string, required): `INBOUND` or `OUTBOUND`
  - `serviceLevelThreshold` (integer, required)
  - `maximumActiveContacts` (integer, required)

## 4. Delete specific Entry Point by ID
**Method:** `DELETE`
**Endpoint:** `/organization/{orgId}/entry-point/{id}`

## 5. Get specific Entry Point by ID
**Method:** `GET`
**Endpoint:** `/organization/{orgId}/entry-point/{id}`
- **Query Parameters:** `includeNames`

## 6. List Entry Point(s)
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/v2/entry-point`
- **Query Parameters:** `filter`, `attributes`, `search`, `page`, `pageSize`
