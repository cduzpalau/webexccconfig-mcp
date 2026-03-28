# Contact Service Queues API Documentation

## 1. Add or remove agents/users to/from an agent based queue
*   **Method**: `POST`
*   **URL**: `/organization/{orgid}/v2/contact-service-queue/{id}/reassign-agents`
*   **Description**: Used by a supervisor to add or remove agents to/from an agent-based queue they have access to.
*   **Request Body (JSON)**:
    ```json
    {
      "add": ["agentId1", "agentId2"],
      "remove": ["agentId3"]
    }
    ```

## 2. Bulk export Contact Service Queue(s)
*   **Method**: `GET`
*   **URL**: `/organization/{orgid}/contact-service-queue/bulk-export`
*   **Description**: Export all CSQs in a given organization.
*   **Query Parameters**:
    *   `type` (string, required): Queue type (`INBOUND` or `OUTBOUND`).
    *   `page` (integer): Page number (starts from 0).
    *   `pageSize` (integer): Number of items per page (default 100).

## 3. Bulk partial update Contact Service Queue(s)
*   **Method**: `PATCH`
*   **URL**: `/organization/{orgid}/contact-service-queue/bulk`
*   **Description**: Updates specific properties for multiple CSQs in bulk.

## 4. Bulk save Contact Service Queue(s)
*   **Method**: `POST`
*   **URL**: `/organization/{orgid}/contact-service-queue/v2/bulk`
*   **Description**: Create, update, or delete multiple CSQs in bulk.

## 5. Create a new Contact Service Queue
*   **Method**: `POST`
*   **URL**: `/organization/{orgid}/v2/contact-service-queue`
*   **Description**: Create a new CSQ.
*   **Key Request Fields**: `name`, `queueType`, `channelType`, `agentSelectionType`, `maxActiveContacts`, etc.

## 6. Delete specific Contact Service Queue by ID
*   **Method**: `DELETE`
*   **URL**: `/organization/{orgid}/contact-service-queue/{id}`
*   **Description**: Delete an existing CSQ by its ID.

## 7. List Contact Service Queue(s) (V3)
*   **Method**: `GET`
*   **URL**: `/organization/{orgid}/v3/contact-service-queue`
*   **Description**: Retrieve a list of CSQs with advanced filtering (RSQL).
*   **Query Parameters**: `filter`, `search`, `page`, `pageSize`, `attributes`.

## 8. Get specific Contact Service Queue by ID
*   **Method**: `GET`
*   **URL**: `/organization/{orgid}/v2/contact-service-queue/{id}`
*   **Description**: Retrieve detailed information for a specific CSQ.

## 9. Update specific Contact Service Queue by ID
*   **Method**: `PUT`
*   **URL**: `/organization/{orgid}/v2/contact-service-queue/{id}`
*   **Description**: Update an existing CSQ by its ID.

## 10. Purge inactive Contact Service Queue(s)
*   **Method**: `POST`
*   **URL**: `/organization/{orgid}/contact-service-queue/purge-queues`
*   **Description**: Purge CSQs that haven't been updated after a specific timestamp.
*   **Request Body**:
    ```json
    {
      "lastUpdatedTime": 1672531200000
    }
    ```

## 11. Other Retrieval Operations
*   `GET /organization/{orgid}/v2/contact-service-queue/by-user-id/{userid}/agent-based-queues`
*   `GET /organization/{orgid}/v2/contact-service-queue/by-user-id/{userid}/skill-based-queues`
*   `GET /organization/{orgid}/v2/contact-service-queue/by-user-id/{userid}/team-based-queues`
*   `GET /organization/{orgid}/contact-service-queue/{id}/incoming-references`
*   `POST /organization/{orgid}/contact-service-queue/fetch-manually-assignable-queues`
