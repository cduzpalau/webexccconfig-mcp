# Audio Files API Documentation

## 1. Create a new Audio File
**Method:** POST
**URL:** `/organization/{orgid}/audio-file`

### Request Parameters
#### Path Parameters
- `orgid` (string, required): Organization ID to be used for this operation.

### Request Body
The request is a **multipart/form-data** body containing:
- `audioFileInfo` (JSON metadata, required): See `AudioFileInfoDTO` below.
- `audioFile` (Binary, required): The actual `.wav` file content.

#### AudioFileInfoDTO Schema:
- `organizationId` (string, required): ID of the contact center organization.
- `id` (string, optional): ID of this contact center resource (system-generated for new resources).
- `version` (integer, optional): Resource version (starts at 0).
- `name` (string, required): A name for the audio file (e.g., `WelcomeMessage.wav`).
- `contentType` (string, required): Media type (e.g., `AUDIO_WAV`, `AUDIO_X_WAV`, `APPLICATION_OCTET_STREAM`).
- `description` (string, optional): A short description of the file.

### Responses
- **200 OK**: Successfully created.

---

## 2. Delete specific Audio File by ID
**Method:** DELETE
**URL:** `/organization/{orgid}/audio-file/{id}`

### Request Parameters
#### Path Parameters
- `orgid` (string, required): Organization ID.
- `id` (string, required): Resource ID of the Audio File.

### Responses
- **200 OK**: Successfully deleted.

---

## 3. Get specific Audio File by ID
**Method:** GET
**URL:** `/organization/{orgid}/audio-file/{id}`

### Request Parameters
#### Path Parameters
- `orgid` (string, required): Organization ID.
- `id` (string, required): Resource ID.

#### Query Parameters
- `includeUrl` (boolean, optional): If true, includes the S3 URL for downloading the file.

### Responses
- **200 OK**: Returns the `AudioFileInfoDTO`.

---

## 4. List Audio File(s)
**Method:** GET
**URL:** `/organization/{orgid}/v2/audio-file`

### Request Parameters
#### Path Parameters
- `orgid` (string, required): Organization ID.

#### Query Parameters
- `filter` (string): RSQL filter for searching.
- `attributes` (string): Comma-separated list of fields to return.
- `page` (integer): Page number (starts at 0).
- `pageSize` (integer): Number of items per page.

### Responses
- **200 OK**: Returns an array of `AudioFileInfoDTO` objects.

---

## 5. List references for a specific Audio File
**Method:** GET
**URL:** `/organization/{orgid}/audio-file/{id}/incoming-references`

### Request Parameters
#### Path Parameters
- `orgid` (string, required): Organization ID.
- `id` (string, required): Resource ID.

### Responses
- **200 OK**: Returns the list of referencing entities.

---

## 6. Partially update Audio File by ID
**Method:** PATCH
**URL:** `/organization/{orgid}/audio-file/{id}`

### Request Body
- `description` (string): New description for the audio file.

### Responses
- **200 OK**: Successfully updated.

---

## 7. Update specific Audio File by ID
**Method:** PUT
**URL:** `/organization/{orgid}/audio-file/{id}`

### Request Parameters
#### Path Parameters
- `orgid` (string, required): Organization ID.
- `id` (string, required): Resource ID.

### Request Body
**Multipart/form-data** containing:
- `audioFileInfo` (JSON): Updated metadata.
- `audioFile` (Binary): New audio content.

### Responses
- **200 OK**: Successfully updated.
