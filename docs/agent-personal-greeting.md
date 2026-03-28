# Agent Personal Greeting API

## Overview
Enables you to upload/download .wav agent personal greeting files. Greeting files will be played to the customer at the beginning of the call before the agent starts answering the call.

## Operations

### Create a new Greeting File (Deprecated)
- **Method**: POST
- **Endpoint**: `/organization/{orgid}/agent-personal-greeting`
- **Description**: Create a new agent personal greeting File for a given organization.
- **Path Parameters**:
  - `orgid` (string, required): Organization ID.
- **Request Body**:
  - `audioFile` (string, required): Audio file content.
  - `agentPersonalGreetingInfo` (object, required):
    - `organizationId` (string, required)
    - `name` (string, required): A name for the Agent's personal greeting file. Should have valid extension i.e. .wav
    - `contentType` (string): AUDIO_WAV...
- **Example Body**:
```json
{
  "audioFile": "base64_encoded_content",
  "agentPersonalGreetingInfo": {
    "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "name": "WelcomeMessage.wav",
    "contentType": "AUDIO_WAV"
  }
}
```

### Create a new Greeting File using v2 API
- **Method**: POST
- **Endpoint**: `/organization/{orgid}/v2/agent-personal-greeting`
- **Description**: Create a new agent personal greeting File using v2 API.
- **Path Parameters**:
  - `orgid` (string, required)
- **Request Body**:
  - `audioFile` (string, required)
  - `agentPersonalGreetingInfo` (object, required):
    - `organizationId` (string, required)
    - `name` (string, required)
    - `greetingPurpose` (string): PERSONAL_GREETING, CALL_WHISPER, etc.
- **Example Body**:
```json
{
  "audioFile": "base64_encoded_content",
  "agentPersonalGreetingInfo": {
    "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "name": "WelcomeMessage.wav",
    "greetingPurpose": "PERSONAL_GREETING"
  }
}
```

### Delete References 1
- **Method**: POST
- **Endpoint**: `/organization/{orgid}/agent-personal-greeting/delete-reference`
- **Description**: Delete references for a greeting file.
- **Path Parameters**:
  - `orgid` (string, required)
- **Request Body**:
  - `references` (object)

### Delete specific Greeting File by ID (Deprecated)
- **Method**: DELETE
- **Endpoint**: `/organization/{orgid}/agent-personal-greeting/{id}`
- **Description**: Delete an existing Greeting File by ID.
- **Path Parameters**:
  - `orgid` (string, required)
  - `id` (string, required): Resource ID of the Greeting File.

### Delete specific Greeting File by ID using v2 API
- **Method**: DELETE
- **Endpoint**: `/organization/{orgid}/v2/agent-personal-greeting/{id}`
- **Description**: Delete an existing Greeting File by ID using v2 API.
- **Path Parameters**:
  - `orgid` (string, required)
  - `id` (string, required)

### Get All Config With Meta Data
- **Method**: GET
- **Endpoint**: `/organization/{orgid}/v2/agent-personal-greeting`
- **Description**: Retrieve all configurations with meta data.
- **Path Parameters**:
  - `orgid` (string, required)
- **Query Parameters**:
  - `filter` (string): Filter results.
  - `search` (string): Search string.
  - `page` (integer)
  - `pageSize` (integer)

### Get specific Greeting File by ID (Deprecated)
- **Method**: GET
- **Endpoint**: `/organization/{orgid}/agent-personal-greeting/{id}`
- **Description**: Retrieve an existing Greeting File by ID.
- **Path Parameters**:
  - `orgid` (string, required)
  - `id` (string, required)
- **Query Parameters**:
  - `includeUrl` (boolean)

### Get specific Greeting File by ID using v2 API
- **Method**: GET
- **Endpoint**: `/organization/{orgid}/v2/agent-personal-greeting/{id}`
- **Description**: Retrieve an existing Greeting File by ID using v2 API.
- **Path Parameters**:
  - `orgid` (string, required)
  - `id` (string, required)
- **Query Parameters**:
  - `includeUrl` (boolean)

### List Greeting File(s)
- **Method**: GET
- **Endpoint**: `/organization/{orgid}/v3/agent-personal-greeting`
- **Description**: Retrieve a list of Greeting File(s) in a given organization.
- **Path Parameters**:
  - `orgid` (string, required)
- **Query Parameters**:
  - `filter` (string)
  - `page` (integer)
  - `pageSize` (integer)

### Partially update Greeting File by ID (Deprecated)
- **Method**: PATCH
- **Endpoint**: `/organization/{orgid}/agent-personal-greeting/{id}`
- **Description**: Partially update Greeting File by ID.
- **Path Parameters**:
  - `orgid` (string, required)
  - `id` (string, required)
- **Request Body**:
  - `attributeTag` (string)
  - `greetingPurposeId` (string)

### Partially update Greeting File by ID using v2 API
- **Method**: PATCH
- **Endpoint**: `/organization/{orgid}/v2/agent-personal-greeting/{id}`
- **Description**: Partially update Greeting File by ID using v2 API.
- **Path Parameters**:
  - `orgid` (string, required)
  - `id` (string, required)
- **Request Body**:
  - `attributeTag` (string)
  - `greetingPurposeId` (string)

### Update specific Greeting File by ID (Deprecated)
- **Method**: PUT
- **Endpoint**: `/organization/{orgid}/agent-personal-greeting/{id}`
- **Description**: Update specific Greeting File by ID.
- **Path Parameters**:
  - `orgid` (string, required)
  - `id` (string, required)
- **Request Body**: Same as Create (v1).
