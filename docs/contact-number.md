# Contact Number API Documentation

## 1. Bulk export Contact Number(s)
- **Method**: `GET`
- **Endpoint**: `/organization/{orgid}/contact-number/bulk-export`
- **Description**: Export all Contact Number(s) in a given organization.
- **Path Parameters**:
    - `orgid` (string, required): Organization ID.
- **Query Parameters**:
    - `page` (integer, default 0): Defines the number of displayed page.
    - `pageSize` (integer, default 10, example 100): Defines the number of items to be displayed on a page.
- **Responses**:
    - **200 OK**:
      ```json
      {
        "totalResources": 100,
        "pageNumber": 0,
        "pageSize": 50,
        "rel": "last",
        "resources": [
          {
            "number": "string"
          }
        ]
      }
      ```

## 2. Bulk save Contact Number(s)
- **Method**: `POST`
- **Endpoint**: `/organization/{orgid}/contact-number/bulk`
- **Description**: Create, Update or delete Contact Number(s) in bulk in a given organization.
- **Path Parameters**:
    - `orgid` (string, required): Organization ID.
- **Request Body**:
    - **Schema**: `BulkRequestDTOContactNumberDTO`
    - **Fields**:
        - `items` (array): List of bulk operation items.
            - `itemIdentifier` (integer): Unique item identifier for a bulk operation.
            - `requestAction` (string): Possible values: `SAVE`, `DELETE`.
            - `item` (object): `ContactNumberDTO`
                - `organizationId` (string): ID of the contact center organization.
                - `id` (string): ID of this contact center resource.
                - `version` (integer): The version of this resource.
                - `number` (string, required): The customized ani number.
    - **Example JSON**:
      ```json
      {
        "items": [
          {
            "itemIdentifier": 0,
            "requestAction": "SAVE",
            "item": {
              "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
              "id": "93912f11-6017-404b-bf14-5331890b1797",
              "version": 1,
              "number": "14033212"
            }
          }
        ]
      }
      ```

## 3. Create a new Contact Number
- **Method**: `POST`
- **Endpoint**: `/organization/{orgid}/contact-number`
- **Description**: Create a new Contact Number in a given organization.
- **Path Parameters**:
    - `orgid` (string, required): Organization ID.
- **Request Body**:
    - **Schema**: `ContactNumberDTO`
    - **Fields**:
        - `organizationId` (string): ID of the contact center organization.
        - `id` (string): ID of this contact center resource.
        - `version` (integer): The version of this resource.
        - `number` (string, required): The customized ani number.

## 4. Delete specific Contact Number by ID
- **Method**: `DELETE`
- **Endpoint**: `/organization/{orgid}/contact-number/{id}`
- **Description**: Delete an existing Contact Number by ID in a given organization.

## 5. Get specific Contact Number by ID
- **Method**: `GET`
- **Endpoint**: `/organization/{orgid}/contact-number/{id}`
- **Description**: Retrieve an existing Contact Number by ID in a given organization.

## 6. List all contact numbers(property - number)
- **Method**: `GET`
- **Endpoint**: `/organization/{orgid}/contact-number/all-numbers`
- **Description**: Retrieve a list of only contact numbers(property - number) from Contact Number(s) without pagination in a given organization.

## 7. List Contact Number(s)
- **Method**: `GET`
- **Endpoint**: `/organization/{orgid}/v2/contact-number`
- **Description**: Retrieve a list of Contact Number(s) in a given organization.
- **Query Parameters**:
    - `filter` (string): RSQL query syntax for filtering. Example: `id==in("...")`.
    - `attributes` (string): Specify the attributes to be returned.
    - `search` (string): Filter data based on the search keyword.
    - `page` (integer, default 0): Page number.
    - `pageSize` (integer, default 100): Number of items per page.

## 8. Update specific Contact Number by ID
- **Method**: `PUT`
- **Endpoint**: `/organization/{orgid}/contact-number/{id}`
- **Description**: Update an existing Contact Number by ID in a given organization.
- **Request Body**:
    - **Schema**: `ContactNumberDTO`
