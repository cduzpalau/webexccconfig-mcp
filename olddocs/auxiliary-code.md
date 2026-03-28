# Auxiliary Code API Documentation

## 1. Bulk Export Auxiliary Code(s)
- **Method:** `GET`
- **URL:** `/organization/{orgid}/auxiliary-code/bulk-export`
- **Description:** Export all Auxiliary Code(s) in a given organization.
- **Path Parameters:**
  - `orgid` (required, string): Organization ID.
- **Query Parameters:**
  - `page` (integer, default: 0): Page number.
  - `pageSize` (integer, default: 50): Number of items per page.
- **Response (200 OK):** `BulkExportDTOAuxCodeBulkExportDTO`
  ```json
  {
    "pageNumber": 0,
    "pageSize": 50,
    "totalResources": 100,
    "rel": "last",
    "resources": [
      {
        "name": "Sales-Query",
        "description": "Wrap-up code for sales query",
        "defaultCode": "00734874-4732-43bb-bfff-d1e75d309eb1",
        "workTypeName": "WRAP_UP_CODE"
      }
    ]
  }
  ```

## 2. Bulk Partial Update Auxiliary Code(s)
- **Method:** `PATCH`
- **URL:** `/organization/{orgid}/auxiliary-code/bulk`
- **Description:** Update specific properties for multiple Auxiliary codes in bulk.
- **Request Body:** `BulkRequestDTOAuxiliaryCodeDTO`
  ```json
  {
    "items": [
      {
        "item": {
          "id": "26e2df70-0f77-41b8-8e8f-1d76e92c9638",
          "burnoutInclusion": "EXCLUDED"
        },
        "itemIdentifier": 0,
        "requestAction": "SAVE"
      }
    ]
  }
  ```
- **Response (207 Multi-Status):** `BulkResponseDTO`

## 3. Bulk Save Auxiliary Code(s)
- **Method:** `POST`
- **URL:** `/organization/{orgid}/auxiliary-code/bulk`
- **Description:** Create, update, or delete Auxiliary Code(s) in bulk.
- **Request Body:** `BulkRequestDTOAuxiliaryCodeDTO`
  ```json
  {
    "items": [
      {
        "itemIdentifier": 10,
        "item": {
          "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
          "id": "93912f11-6017-404b-bf14-5331890b1797",
          "version": 1,
          "name": "Sales-Query",
          "description": "Wrap-up code for sales query",
          "defaultCode": true,
          "active": true
        },
        "requestAction": "SAVE"
      }
    ]
  }
  ```

## 4. Create a New Auxiliary Code
- **Method:** `POST`
- **URL:** `/organization/{orgid}/auxiliary-code`
- **Description:** Create a single new Auxiliary Code.
- **Request Body:** `AuxiliaryCodeDTO`
  - `name` (required, string)
  - `description` (string)
  - `defaultCode` (boolean)
  - `workTypeName` (string): e.g., `IDLE_CODE`, `WRAP_UP_CODE`
  - `burnoutInclusion` (string): `INCLUDED`, `EXCLUDED`, or `NOT_APPLICABLE`
- **Response (201 Created):** Returns the created `AuxiliaryCodeDTO`.

## 5. Delete Specific Auxiliary Code by ID
- **Method:** `DELETE`
- **URL:** `/organization/{orgid}/auxiliary-code/{id}`
- **Description:** Delete an Auxiliary Code by its ID.

## 6. Get Specific Auxiliary Code by ID
- **Method:** `GET`
- **URL:** `/organization/{orgid}/auxiliary-code/{id}`
- **Description:** Retrieve details of an existing Auxiliary Code.

## 7. List Auxiliary Code(s)
- **Method:** `GET`
- **URL:** `/organization/{orgid}/v2/auxiliary-code`
- **Description:** Retrieve a paginated list of Auxiliary Codes.
- **Query Parameters:** `filter`, `attributes`, `search`, `page`, `pageSize`, `desktopProfileFilter`, `supervisedUserId`.
- **Response (200 OK):**
  ```json
  {
    "meta": { "total": 100, "page": 0, "pageSize": 50 },
    "data": [ { "id": "uuid", "name": "Lunch", "workTypeName": "IDLE_CODE" } ]
  }
  ```

## 8. List References for a Specific Auxiliary Code
- **Method:** `GET`
- **URL:** `/organization/{orgid}/auxiliary-code/{id}/incoming-references`
- **Description:** Find entities (like Desktop Profiles) referencing this code.

## 9. Purge Inactive Auxiliary Code(s)
- **Method:** `POST`
- **URL:** `/organization/{orgid}/auxiliary-code/purge-inactive-entities`
- **Description:** Remove inactive codes older than the configured interval.

## 10. Update Specific Auxiliary Code by ID
- **Method:** `PUT`
- **URL:** `/organization/{orgid}/auxiliary-code/{id}`
- **Description:** Completely update an existing Auxiliary Code.
- **Request Body:** `AuxiliaryCodeDTO` (similar to Create).
