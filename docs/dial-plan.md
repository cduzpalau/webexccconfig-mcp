# Dial Plan API Documentation

## 1. Bulk export Dial Plan(s)
- **Method:** `GET`
- **Endpoint:** `/organization/{orgid}/dial-plan/bulk-export`

## 2. Bulk save Dial Plan(s)
- **Method:** `POST`
- **Endpoint:** `/organization/{orgid}/dial-plan/bulk`

## 3. Create a new Dial Plan
- **Method:** `POST`
- **Endpoint:** `/organization/{orgid}/dial-plan`
- **Request Body (DialPlanDTO):**
  - `name` (string, required): Enter the name for the dial plan.
  - `regularExpression` (string, required): A regular expression specifies the format of the phone number.
  - `prefix` (string): (Optional) Enter a prefix.
  - `strippedChars` (string): Specify characters to strip.
  - `description` (string): A short description of the dial plan.

## 4. Delete specific Dial Plan by ID
- **Method:** `DELETE`
- **Endpoint:** `/organization/{orgid}/dial-plan/{id}`

## 5. Get specific Dial Plan by ID
- **Method:** `GET`
- **Endpoint:** `/organization/{orgid}/dial-plan/{id}`

## 6. List Dial Plan(s)
- **Method:** `GET`
- **Endpoint:** `/organization/{orgid}/v2/dial-plan`
- **Query Parameters:** `filter`, `attributes`, `search`, `page`, `pageSize`

## 7. List references for a specific Dial Plan
- **Method:** `GET`
- **Endpoint:** `/organization/{orgid}/dial-plan/{id}/incoming-references`
- **Query Parameters:** `type`, `page`, `pageSize`

## 8. Update specific Dial Plan by ID
- **Method:** `PUT`
- **Endpoint:** `/organization/{orgid}/dial-plan/{id}`
- **Request Body (DialPlanDTO)**: Same as Create.
