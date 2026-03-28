[Home](https://developer.webex.com/)/[Dial Number](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-number)/List references for a specific Dialed Number Mapping

Webex Contact Center

Version 1

Dial Number

# List references for a specific Dialed Number Mapping

**Operation Id:** getIncomingReferences\_12

**Description:**

Retrieve a list of all entities that have reference to an existing Dialed Number Mapping by ID in a given organization.

GET/organization/ **{orgid}/dial-number/{id}**/incoming-references

## Request Parameters

#### Path

orgidrequiredstring

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

example = "2f9eecc5-0472-4549-9a83-2afdae0d4ba1"

idrequiredstring

ID of this contact center resource.

example = "af9eecc5-0472-4549-9a83-2afdae0d4ba0"

#### Query

typestring

Entity type of the other entity that has a reference to this specific entity.

example = "type\_text"

pageinteger

Defines the number of displayed page. The page number starts from 0.

default = 0

pageSizeinteger

Defines the number of items to be displayed on a page. If the number specified is more than allowed max page size, the API will automatically adjust the page size to the max page size.

example = 100, default = 100

## Responses

Status: 200

OK

Schema DefinitionExample Body

- -EntityReferenceInfoDTO


Entity Reference Information containing a description, metadata, and a list of referenced entities.








  - description:string


    Description about the reference information.

  - +meta:MetaDataReferencesPagingInfo


    Metadata of response for references with paging information.




    - page:integer


      Current page number.

    - pageSize:integer


      Page size for current data set.

    - totalPages:integer


      Number of pages.

    - totalRecords:integer


      Total number of items.

    - currentEntity:string


      Name of the current entity.

    - orgid:string


      Organization ID.

    - links:object


      Map of pagination links with `self`, `next`, `prev`, `last`, and `first`.

    - referencedEntities:string\[\]


      List of referenced entities.
  - +data:EntityInfo\[\]


    List of referenced entities.




    - version:integer


      Version of the entity.

    - createdDate:string


      Created date of the entity.

    - id:string


      ID of the entity.

    - lastModifiedDate:string


      Last modified date of the entity.

    - name:string


      The name of the entity.

    - additionalAttributes:object


      A map containing additional attributes of entity where both the key and value are Strings.

```json
{
    "description": "Entity with id: 0aab73f3-8c55-4ddb-9a81-3cfee5404dc6 is referred in other entities.",
    "meta": {
        "orgid": "c79b0bd0-2164-4bcc-b267-c3f0d4c6f322",
        "page": 0,
        "pageSize": 100,
        "totalPages": 1,
        "totalRecords": 1,
        "referencedEntities": [ "team" ],
        "currentEntity": "team"
    },
    "data": [\
        {\
            "id": "fe6ecc66-bbe8-4cf3-8185-0aad052095f1",\
            "name": "Sandbox Team AgentType - oebg"\
        }\
    ]
}
```

Status: 401

Unauthorized Operation

Schema DefinitionExample Body

- -ApiErrorResponse


API Error Response containing error details.








  - trackingId:string


    An opaque identifier for mapping protocol failures to service internal codes. When specified in a request, it can be used for correlating events across services.

  - +error:ErrorDetails


    Detailed error information including a set of error messages.




    - key:string


      An application-defined error code.

    - reason:string


      Reason for the failure.

    - +message:OperationError\[\]


      A set of error messages.




      - description:string


        A human-readable explanation for the occurrence of an error

      - entity:string


        The entity on which the error occurred

      - +references:EntityInfo\[\]


        References to entities related to the error




        - version:integer


          Version of the entity.

        - createdDate:string


          Created date of the entity.

        - id:string


          ID of the entity.

        - lastModifiedDate:string


          Last modified date of the entity.

        - name:string


          The name of the entity.

        - additionalAttributes:object


          A map containing additional attributes of entity where both the key and value are Strings.

```json
{
    "trackingId": "ccconfig_af9eecc5-0472-4549-9a83-2afdae0d4ba0",
    "error": {
        "key": "401",
        "reason": "Test reason",
        "message": [\
            {\
                "description": "Test error",\
                "code": "401",\
                "entity": "cc_user",\
                "references": []\
            }\
        ]
    }
}
```

Status: 403

Operation is forbidden

Schema DefinitionExample Body

- -ApiErrorResponse


API Error Response containing error details.








  - trackingId:string


    An opaque identifier for mapping protocol failures to service internal codes. When specified in a request, it can be used for correlating events across services.

  - +error:ErrorDetails


    Detailed error information including a set of error messages.




    - key:string


      An application-defined error code.

    - reason:string


      Reason for the failure.

    - +message:OperationError\[\]


      A set of error messages.




      - description:string


        A human-readable explanation for the occurrence of an error

      - entity:string


        The entity on which the error occurred

      - +references:EntityInfo\[\]


        References to entities related to the error




        - version:integer


          Version of the entity.

        - createdDate:string


          Created date of the entity.

        - id:string


          ID of the entity.

        - lastModifiedDate:string


          Last modified date of the entity.

        - name:string


          The name of the entity.

        - additionalAttributes:object


          A map containing additional attributes of entity where both the key and value are Strings.

```json
{
    "trackingId": "ccconfig_af9eecc5-0472-4549-9a83-2afdae0d4ba0",
    "error": {
        "key": "403",
        "reason": "Test reason",
        "message": [\
            {\
                "description": "Test error",\
                "code": "403",\
                "entity": "cc_user",\
                "references": []\
            }\
        ]
    }
}
```

Status: 404

Resource not found or URI is invalid

Schema DefinitionExample Body

- -ApiErrorResponse


API Error Response containing error details.








  - trackingId:string


    An opaque identifier for mapping protocol failures to service internal codes. When specified in a request, it can be used for correlating events across services.

  - +error:ErrorDetails


    Detailed error information including a set of error messages.




    - key:string


      An application-defined error code.

    - reason:string


      Reason for the failure.

    - +message:OperationError\[\]


      A set of error messages.




      - description:string


        A human-readable explanation for the occurrence of an error

      - entity:string


        The entity on which the error occurred

      - +references:EntityInfo\[\]


        References to entities related to the error




        - version:integer


          Version of the entity.

        - createdDate:string


          Created date of the entity.

        - id:string


          ID of the entity.

        - lastModifiedDate:string


          Last modified date of the entity.

        - name:string


          The name of the entity.

        - additionalAttributes:object


          A map containing additional attributes of entity where both the key and value are Strings.

```json
{
    "trackingId": "ccconfig_af9eecc5-0472-4549-9a83-2afdae0d4ba0",
    "error": {
        "key": "404",
        "reason": "Test reason",
        "message": [\
            {\
                "description": "Test error",\
                "code": "404",\
                "entity": "cc_user",\
                "references": []\
            }\
        ]
    }
}
```

Status: 429

Too many requests have been sent in a given amount of time and the request has been rate limited

Schema DefinitionExample Body

- -ApiErrorResponse


API Error Response containing error details.








  - trackingId:string


    An opaque identifier for mapping protocol failures to service internal codes. When specified in a request, it can be used for correlating events across services.

  - +error:ErrorDetails


    Detailed error information including a set of error messages.




    - key:string


      An application-defined error code.

    - reason:string


      Reason for the failure.

    - +message:OperationError\[\]


      A set of error messages.




      - description:string


        A human-readable explanation for the occurrence of an error

      - entity:string


        The entity on which the error occurred

      - +references:EntityInfo\[\]


        References to entities related to the error




        - version:integer


          Version of the entity.

        - createdDate:string


          Created date of the entity.

        - id:string


          ID of the entity.

        - lastModifiedDate:string


          Last modified date of the entity.

        - name:string


          The name of the entity.

        - additionalAttributes:object


          A map containing additional attributes of entity where both the key and value are Strings.

```json
{
    "trackingId": "ccconfig_af9eecc5-0472-4549-9a83-2afdae0d4ba0",
    "error": {
        "key": "429",
        "reason": "Test reason",
        "message": [\
            {\
                "description": "Test error",\
                "code": "429",\
                "entity": "cc_user",\
                "references": []\
            }\
        ]
    }
}
```

Status: 500

An Unexpected Error Occurred

Schema DefinitionExample Body

- -ApiErrorResponse


API Error Response containing error details.








  - trackingId:string


    An opaque identifier for mapping protocol failures to service internal codes. When specified in a request, it can be used for correlating events across services.

  - +error:ErrorDetails


    Detailed error information including a set of error messages.




    - key:string


      An application-defined error code.

    - reason:string


      Reason for the failure.

    - +message:OperationError\[\]


      A set of error messages.




      - description:string


        A human-readable explanation for the occurrence of an error

      - entity:string


        The entity on which the error occurred

      - +references:EntityInfo\[\]


        References to entities related to the error




        - version:integer


          Version of the entity.

        - createdDate:string


          Created date of the entity.

        - id:string


          ID of the entity.

        - lastModifiedDate:string


          Last modified date of the entity.

        - name:string


          The name of the entity.

        - additionalAttributes:object


          A map containing additional attributes of entity where both the key and value are Strings.

```json
{
    "trackingId": "ccconfig_af9eecc5-0472-4549-9a83-2afdae0d4ba0",
    "error": {
        "key": "500",
        "reason": "Test reason",
        "message": [\
            {\
                "description": "Test error",\
                "code": "500",\
                "entity": "cc_user",\
                "references": []\
            }\
        ]
    }
}
```

Configuration

Configuration is not available on this doc

ParametersCode Snippets

GET/organization//dial-number/ **{id}**/incoming-references

orgid\*

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

id\*

ID of this contact center resource.

### Query Params

Add Query Parameters

### Headers

Use personal access token

\*/\*

Add Headers

Run

#### Response:

Data

Click “Run” to get sample response

CurlPythonNodejs

```bash
Copycurl -L --request GET \
--url https://api.wxcc-us1.cisco.com/organization//dial-number/{id}/incoming-references \
--header 'Authorization: Bearer ' \
--header 'Accept: */*'
```

```python
Copyimport requests

url = "https://api.wxcc-us1.cisco.com/organization//dial-number/{id}/incoming-references"

payload = None

headers = {
    "Authorization": "Bearer ",
    "Accept": "*/*"
}

response = requests.request('GET', url, headers=headers, data = payload)

print(response.text.encode('utf8'))
```

```javascript
Copyvar request = require('request');

headers = {
    "Authorization": "Bearer ",
    "Accept": "*/*"
}
body = null;
var options = {
    method: 'GET',
    url: 'https://api.wxcc-us1.cisco.com/organization//dial-number/{id}/incoming-references',
    headers,
    body,
};

request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
```