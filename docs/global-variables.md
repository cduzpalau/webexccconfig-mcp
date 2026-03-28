# Global Variables API Documentation

## 1. List Global Variable(s)
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/v2/cad-variable`
- **Query Parameters:** `filter`, `attributes`, `search`, `page`, `pageSize`

## 2. Get specific Global Variable by ID
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/cad-variable/{id}`

## 3. Create a new Global Variable
**Method:** `POST`
**Endpoint:** `/organization/{orgid}/cad-variable`
- **Request Body:** `CadVariableDTO`
  - `name` (string, required)
  - `variableType` (string, required): STRING, INTEGER, DATE_TIME, BOOLEAN, DECIMAL
  - `defaultValue` (string, required)

## 4. Update specific Global Variable by ID
**Method:** `PUT`
**Endpoint:** `/organization/{orgid}/cad-variable/{id}`
- **Request Body:** `CadVariableDTO` (Full object update)

## 5. Delete specific Global Variable by ID
**Method:** `DELETE`
**Endpoint:** `/organization/{orgid}/cad-variable/{id}`

## 6. Bulk export Global Variable(s)
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/cad-variable/bulk-export`

## 7. Bulk save Global Variable(s)
**Method:** `POST`
**Endpoint:** `/organization/{orgid}/cad-variable/bulk`

## 8. Get reportable count for Global Variable(s)
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/cad-variable/reportable-count`

## 9. List references for a specific Global Variable
**Method:** `GET`
**Endpoint:** `/organization/{orgid}/cad-variable/{id}/incoming-references`
- **Query Parameters:** `type`

## 10. Purge inactive Global Variable(s)
**Method:** `POST`
**Endpoint:** `/organization/{orgid}/cad-variable/purge-inactive-entities`
