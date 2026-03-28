# Desktop Profile API Documentation

## 1. List Desktop Profile(s)
- **Method:** `GET`
- **Endpoint:** `/organization/{orgid}/v2/agent-profile`
- **Query Parameters:** `filter`, `attributes`, `search`, `page`, `pageSize`, `singleObjectResponse`
- **Response (200 OK):**
  - `meta`: Paging info
  - `data`: Array of `AgentProfileResponseDTO`

## 2. Get specific Desktop Profile by ID
- **Method:** `GET`
- **Endpoint:** `/organization/{orgid}/agent-profile/{id}`
- **Response (200 OK):** `AgentProfileResponseDTO`

## 3. Create a new Desktop Profile
- **Method:** `POST`
- **Endpoint:** `/organization/{orgid}/agent-profile`
- **Request Body:** `AgentProfileDTO`
  - `name` (required)
  - `autoWrapAfterSeconds`
  - `timeoutDesktopInactivityMins`
  - `accessBuddyTeam`, `accessEntryPoint`, `accessIdleCode`, `accessQueue`, `accessWrapUpCode` (Enums: `SPECIFIC`, `ALL`, `PROVISIONED_VALUE`, `NONE`)
  - `agentDNValidation`, `agentDNValidationCriteria`
  - `siteId`, `addressBookId`
  - Arrays for specific access: `buddyTeams`, `entryPoints`, `idleCodes`, `queues`, `wrapUpCodes`
- **Response (201 Created):** `AgentProfileResponseDTO`

## 4. Update specific Desktop Profile by ID
- **Method:** `PUT`
- **Endpoint:** `/organization/{orgid}/agent-profile/{id}`
- **Request Body:** `AgentProfileDTO`
- **Response (200 OK):** `AgentProfileResponseDTO`

## 5. Delete specific Desktop Profile by ID
- **Method:** `DELETE`
- **Endpoint:** `/organization/{orgid}/agent-profile/{id}`
- **Response:** 204 No Content

## 6. Bulk export Desktop Profile(s)
- **Method:** `GET`
- **Endpoint:** `/organization/{orgid}/agent-profile/bulk-export`
- **Query Parameters:** `page`, `pageSize`

## 7. Bulk save Desktop Profile(s)
- **Method:** `POST`
- **Endpoint:** `/organization/{orgid}/agent-profile/bulk`
- **Request Body:** `BulkRequestDTOAgentProfileDTO`

## 8. List references for a specific Desktop Profile
- **Method:** `GET`
- **Endpoint:** `/organization/{orgid}/agent-profile/{id}/incoming-references`

## 9. Purge inactive Desktop Profile(s)
- **Method:** `POST`
- **Endpoint:** `/organization/{orgid}/agent-profile/purge`
- **Request Body:** `{ "purgeByDays": integer }`
