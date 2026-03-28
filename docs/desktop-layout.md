# Desktop Layout API Documentation

## 1. Bulk export Desktop Layout(s)
*   **Method:** `GET`
*   **URL:** `/organization/{orgid}/desktop-layout/bulk-export`
*   **Path Parameters:**
    *   `orgid` (string, required): Organization ID.
*   **Query Parameters:**
    *   `page` (integer): Page number.
    *   `pageSize` (integer): Number of items per page.
*   **Description:** Export all Desktop Layout(s) in a given organization.
*   **Response (200 OK):** `BulkExportDTODesktopLayoutDTO`

## 2. Bulk save Desktop Layout(s)
*   **Method:** `POST`
*   **URL:** `/organization/{orgid}/desktop-layout/bulk`
*   **Path Parameters:**
    *   `orgid` (string, required): Organization ID.
*   **Description:** Create, update, or delete Desktop Layout(s) in bulk.
*   **Request Body:** `BulkRequestDTODesktopLayoutDTO`
    *   `items[].itemIdentifier` (integer)
    *   `items[].requestAction` (`SAVE`, `DELETE`)
    *   `items[].item` (`DesktopLayoutDTO`)
        *   `name` (string, required)
        *   `description` (string)
        *   `json` (string, required): The JSON layout string.
*   **Response (207 Multi-Status):** `BulkResponseDTO`

## 3. Create a new Desktop Layout
*   **Method:** `POST`
*   **URL:** `/organization/{orgid}/desktop-layout`
*   **Path Parameters:**
    *   `orgid` (string, required): Organization ID.
*   **Description:** Create a single new Desktop Layout.
*   **Request Body:** `DesktopLayoutDTO`
    *   `name` (string, required)
    *   `description` (string)
    *   `json` (string, required): Layout JSON.
*   **Response (201 Created):** `DesktopLayoutDTO`

## 4. Delete specific Desktop Layout by ID
*   **Method:** `DELETE`
*   **URL:** `/organization/{orgid}/desktop-layout/{id}`
*   **Path Parameters:**
    *   `orgid` (string, required): Organization ID.
    *   `id` (string, required): Resource ID.
*   **Description:** Delete an existing Desktop Layout by ID.
*   **Response:** 204 No Content

## 5. Get specific Desktop Layout by ID
*   **Method:** `GET`
*   **URL:** `/organization/{orgid}/desktop-layout/{id}`
*   **Path Parameters:**
    *   `orgid`, `id`
*   **Description:** Retrieve an existing Desktop Layout by ID.
*   **Response (200 OK):** `DesktopLayoutDTO`

## 6. List Desktop Layout(s)
*   **Method:** `GET`
*   **URL:** `/organization/{orgid}/v2/desktop-layout`
*   **Query Parameters:** `filter`, `attributes`, `search`, `page`, `pageSize`
*   **Description:** Retrieve a paginated list of Desktop Layout(s).
*   **Response (200 OK):**
    *   `meta` (page, pageSize, totalRecords, etc.)
    *   `data` (`DesktopLayoutDTO` array)

## 7. List references for a specific Desktop Layout
*   **Method:** `GET`
*   **URL:** `/organization/{orgid}/desktop-layout/{id}/incoming-references`
*   **Description:** Find entities referencing this Desktop Layout.
*   **Response (200 OK):** `ReferenceListDTO`

## 8. Purge inactive Desktop Layout(s)
*   **Method:** `POST`
*   **URL:** `/organization/{orgid}/desktop-layout/purge-inactive-entities`
*   **Description:** Purge inactive entities.
