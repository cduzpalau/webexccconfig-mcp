# Address Book API

## Overview
Address Book is available at Webex Contact Center Agent DESKTOP. Agents can make outbound calls using Address Books. Agents can be given access to an address book from which they can select an entry or dial for outbound calls instead of entering a number manually in the 'Start a New Call' field.

## Address Book Operations

### List Address Book(s)
- **Method**: `GET`
- **Endpoint**: `/organization/{orgid}/v3/address-book`
- **Description**: Retrieves a list of address books.
- **Query Parameters**: `filter`, `attributes`, `search`, `page`, `pageSize`.

### Create a new Address Book
- **Method**: `POST`
- **Endpoint**: `/organization/{orgid}/v3/address-book`
- **Description**: Creates a new address book.
- **Request Body**:
  - `name` (string, required)
  - `parentType` (string, required: 'ORGANIZATION' or 'SITE')
  - `description` (string)
  - `version` (integer)
  - `siteId` (string, applicable if SITE parentType)
```json
{
  "name": "Global Address Book",
  "parentType": "ORGANIZATION",
  "description": "Company-wide contacts",
  "version": 1
}
```

### Get specific Address Book by ID
- **Method**: `GET`
- **Endpoint**: `/organization/{orgid}/v3/address-book/{id}`
- **Description**: Retrieves a single address book's details.

### Update specific Address Book by ID
- **Method**: `PUT`
- **Endpoint**: `/organization/{orgid}/v3/address-book/{id}`
- **Description**: Update an existing Address book.
- **Request Body**:
  - `name` (string)
  - `description` (string)
  - `version` (integer)

### Delete specific Address Book by ID
- **Method**: `DELETE`
- **Endpoint**: `/organization/{orgid}/v3/address-book/{id}`

### Bulk export Address Book(s)
- **Method**: `GET`
- **Endpoint**: `/organization/{orgid}/address-book/bulk-export`
- **Description**: Exports all address books and their entries in one operation.

### List references for a specific Address Book
- **Method**: `GET`
- **Endpoint**: `/organization/{orgid}/address-book/{id}/incoming-references`
- **Description**: Lists other entities (like entry points) that reference the address book.

## Address Book Entry Operations

### List Address Book Entry(s)
- **Method**: `GET`
- **Endpoint**: `/organization/{orgid}/v2/address-book/{addressBookId}/entry`
- **Query Parameters**: `filter`, `attributes`, `search`, `page`, `pageSize`.

### Create a new Address Book Entry
- **Method**: `POST`
- **Endpoint**: `/organization/{orgid}/address-book/{addressBookId}/entry`
- **Request Body**: Includes `name` (required), `number` (required), `organizationId`, and `version`.

### Get specific Address Book Entry by ID
- **Method**: `GET`
- **Endpoint**: `/organization/{orgid}/address-book/{addressBookId}/entry/{id}`

### Update specific Address Book Entry by ID
- **Method**: `PUT`
- **Endpoint**: `/organization/{orgid}/address-book/{addressBookId}/entry/{id}`
- **Request Body**: Allows updating `name`, `number`, and `version`.

### Delete specific Address Book Entry by ID
- **Method**: `DELETE`
- **Endpoint**: `/organization/{orgid}/address-book/{addressBookId}/entry/{id}`

### Bulk save Address Book Entry(s)
- **Method**: `POST`
- **Endpoint**: `/organization/{orgid}/address-book/{addressBookId}/entry/bulk`
- **Description**: Allows creating, updating, or deleting multiple entries in a single request using an `items` array with `operation` flags (`CREATE`, `UPDATE`, `DELETE`).
