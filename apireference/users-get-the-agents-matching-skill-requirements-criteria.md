[Home](https://developer.webex.com/)/[Users](https://developer.webex.com/webex-contact-center/docs/api/v1/users)/Get the agents matching skill requirements criteria

Webex Contact Center

Version 1

Users

# Get the agents matching skill requirements criteria

**Operation Id:** getUsersBySkillRequirements

**Description:**

This API can be used to fetch the agents who match the provided skill requirements criteria. Maximum of 50 skill requirements criteria can be passed in the request.

POST/organization/ **{orgid}**/user/fetch-by-skill-requirements

## Request Parameters

#### Path

orgidrequiredstring

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

example = "2f9eecc5-0472-4549-9a83-2afdae0d4ba1"

#### Query

searchstring

Filter data based on the search keyword.Supported search columns(firstName, lastName, email)

The examples below show some search queries

- "Cisco"
- field=="firstName";value=="Cisco"
- fields=in=("firstName","lastName");value=="Cisco"

example = "contact center"

pageinteger

Defines the number of displayed page. The page number starts from 0.

default = 0

pageSizeinteger

Defines the number of items to be displayed on a page. If the number specified is more than allowed max page size, the API will automatically adjust the page size to the max page size.

example = 100, default = 100

#### Request body

Schema DefinitionExample Body

- -object





  - +skillRequirements:QueueSkillRequirementDTO\[\]


    Skill requirement for the queue.




    - version:integer


      The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

    - condition\*:string


      Indicates a value that represents a skill the agent has.

    - id:string


      ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

    - organizationId:string


      ID of the contact center organization. It is required to define for the following operations - All bulk save operations

    - skillId\*:string


      Skill ID reference

    - skillName:string


      Indicates the name of the skill. Once created, name cannot be modified.

    - skillType:string


      This can be of the following types



      PROFICIENCY: id = 0



      BOOLEAN: id = 1



      TEXT: id = 2



      ENUM: id = 3



      Once created, skillType cannot be modified.

    - skillValue\*:string


      A short textual description that represents a skill the agent has.

```json
{
    "skillRequirements": [\
        {\
            "organizationId": "0271223b-91de-427d-872a-1b3c1bb746b9",\
            "id": "5e8cdad5-94da-4ffc-86d7-c904e4490626",\
            "skillId": "bc5658a9-5aa7-45ec-b960-43dcfc73c34d",\
            "skillName": "skillA",\
            "skillType": "TEXT",\
            "condition": "IS",\
            "skillValue": "abc"\
        },\
        {\
            "condition": "IS",\
            "skillValue": "8",\
            "skillName": "ProfSkillC",\
            "skillType": "PROFICIENCY",\
            "skillId": "c683cf8d-49e8-4e85-9e08-c8749affa9cc"\
        }\
    ]
}
```

## Responses

Status: 200

OK

Select Example

application/hal+json

Schema DefinitionExample Body

- -object





  - +meta:MetaDataWithPagingInfo


    Metadata of response with paging information




    - page:integer


      Current page number

    - pageSize:integer


      Page size for current data set

    - totalPages:integer


      Number of pages

    - totalRecords:integer


      Total number of items

    - orgid:string


      Org ID

    - links:object


      Map of pagination links with self, next, prev, last and first
  - +data:UserWithSkillDetailsDTO\[\]

    - createdTime:integerreadOnly


      Creation time(in epoch millis) of this resource.

    - lastUpdatedTime:integerreadOnly


      Time(in epoch millis) when this resource was last updated.

    - version:integer


      The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

    - email:string


      The email address of the user. Can be changed using Users Management in Cisco Webex Control Hub.

    - firstName:string


      The first name of the user. Can be changed using Users Management in Cisco Webex Control Hub.

    - id:string


      ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

    - lastName:string


      The last name of the user. Can be changed using Users Management in Cisco Webex Control Hub.

    - organizationId:string


      ID of the contact center organization. It is required to define for the following operations - All bulk save operations.

    - skillProfileName:string


      The skillProfileName of the user. Can be changed using skill Management in Cisco Webex Control Hub.

```json
{
    "meta": {
        "orgid": "2f9eecc5-0472-4549-9a83-2afdae0d4ba1",
        "page": 1,
        "pageSize": 100,
        "totalPages": 1,
        "totalRecords": 1000,
        "links": {
            "next": "/organization/bde75a64-f4d5-4ffc-a239-feb607c17ef8/cad-variable?page=2&pageSize=10",
            "last": "/organization/bde75a64-f4d5-4ffc-a239-feb607c17ef8/cad-variable?page=3&pageSize=10",
            "prev": "/organization/bde75a64-f4d5-4ffc-a239-feb607c17ef8/cad-variable?page=0&pageSize=10",
            "self": "/organization/bde75a64-f4d5-4ffc-a239-feb607c17ef8/cad-variable?page=1&pageSize=10",
            "first": "/organization/bde75a64-f4d5-4ffc-a239-feb607c17ef8/cad-variable?page=0&pageSize=10"
        }
    },
    "data": [\
        {\
            "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
            "id": "93912f11-6017-404b-bf14-5331890b1797",\
            "version": 1,\
            "firstName": "John1",\
            "lastName": "Wick1",\
            "email": "johnwick1@company.com",\
            "skillProfileName": "skillprofileName",\
            "createdTime": 1617536244000,\
            "lastUpdatedTime": 1617536244000\
        }\
    ]
}
```

Status: 400

The request was invalid and cannot be served. An accompanying error message will explain further

Schema DefinitionExample Body

- -ApiErrorResponse





  - trackingId:string


    An opaque identifier for mapping protocol failures to service internal codes.



    When specified in a request, it can be used for co-relating events across services

  - +error:ErrorDetails


    Error description..




    - key:string


      An application defined error code.

    - reason:string


      Reason for the failure.

    - +message:OperationError\[\]

      - description:string


        A human readable explanation for the occurrence of an error

      - entity:string


        entity

      - +references:EntityInfo\[\]

        - version:integer

        - createdDate:string

        - id:string


          id

        - lastModifiedDate:string

        - name:string


          name

        - additionalAttributes:object


          A map containing additional attributes of entity where both the key and value are Strings.

```json
{
    "trackingId": "ccconfig_c1a4fcef-aee2-4dea-8977-29f594760552",
    "error": {
        "key": "4xx/5xx",
        "message": [\
            {\
                "description": "siteId: not found for given orgId.",\
                "entity": "string",\
                "references": [\
                    {\
                        "id": "string",\
                        "name": "string"\
                    }\
                ]\
            }\
        ],
        "reason": "dependency exists"
    }
}
```

Status: 401

Unauthorized Operation

Schema DefinitionExample Body

- -ApiErrorResponse





  - trackingId:string


    An opaque identifier for mapping protocol failures to service internal codes.



    When specified in a request, it can be used for co-relating events across services

  - +error:ErrorDetails


    Error description..




    - key:string


      An application defined error code.

    - reason:string


      Reason for the failure.

    - +message:OperationError\[\]

      - description:string


        A human readable explanation for the occurrence of an error

      - entity:string


        entity

      - +references:EntityInfo\[\]

        - version:integer

        - createdDate:string

        - id:string


          id

        - lastModifiedDate:string

        - name:string


          name

        - additionalAttributes:object


          A map containing additional attributes of entity where both the key and value are Strings.

```json
{
    "trackingId": "ccconfig_c1a4fcef-aee2-4dea-8977-29f594760552",
    "error": {
        "key": "4xx/5xx",
        "message": [\
            {\
                "description": "siteId: not found for given orgId.",\
                "entity": "string",\
                "references": [\
                    {\
                        "id": "string",\
                        "name": "string"\
                    }\
                ]\
            }\
        ],
        "reason": "dependency exists"
    }
}
```

Status: 403

Operation is forbidden

Schema DefinitionExample Body

- -ApiErrorResponse





  - trackingId:string


    An opaque identifier for mapping protocol failures to service internal codes.



    When specified in a request, it can be used for co-relating events across services

  - +error:ErrorDetails


    Error description..




    - key:string


      An application defined error code.

    - reason:string


      Reason for the failure.

    - +message:OperationError\[\]

      - description:string


        A human readable explanation for the occurrence of an error

      - entity:string


        entity

      - +references:EntityInfo\[\]

        - version:integer

        - createdDate:string

        - id:string


          id

        - lastModifiedDate:string

        - name:string


          name

        - additionalAttributes:object


          A map containing additional attributes of entity where both the key and value are Strings.

```json
{
    "trackingId": "ccconfig_c1a4fcef-aee2-4dea-8977-29f594760552",
    "error": {
        "key": "4xx/5xx",
        "message": [\
            {\
                "description": "siteId: not found for given orgId.",\
                "entity": "string",\
                "references": [\
                    {\
                        "id": "string",\
                        "name": "string"\
                    }\
                ]\
            }\
        ],
        "reason": "dependency exists"
    }
}
```

Status: 409

Similar entity is already present

Schema DefinitionExample Body

- -ApiErrorResponse





  - trackingId:string


    An opaque identifier for mapping protocol failures to service internal codes.



    When specified in a request, it can be used for co-relating events across services

  - +error:ErrorDetails


    Error description..




    - key:string


      An application defined error code.

    - reason:string


      Reason for the failure.

    - +message:OperationError\[\]

      - description:string


        A human readable explanation for the occurrence of an error

      - entity:string


        entity

      - +references:EntityInfo\[\]

        - version:integer

        - createdDate:string

        - id:string


          id

        - lastModifiedDate:string

        - name:string


          name

        - additionalAttributes:object


          A map containing additional attributes of entity where both the key and value are Strings.

```json
{
    "trackingId": "ccconfig_c1a4fcef-aee2-4dea-8977-29f594760552",
    "error": {
        "key": "4xx/5xx",
        "message": [\
            {\
                "description": "siteId: not found for given orgId.",\
                "entity": "string",\
                "references": [\
                    {\
                        "id": "string",\
                        "name": "string"\
                    }\
                ]\
            }\
        ],
        "reason": "dependency exists"
    }
}
```

Status: 429

Too many requests have been sent in a given amount of time and the request has been rate limited

Schema DefinitionExample Body

- -ApiErrorResponse





  - trackingId:string


    An opaque identifier for mapping protocol failures to service internal codes.



    When specified in a request, it can be used for co-relating events across services

  - +error:ErrorDetails


    Error description..




    - key:string


      An application defined error code.

    - reason:string


      Reason for the failure.

    - +message:OperationError\[\]

      - description:string


        A human readable explanation for the occurrence of an error

      - entity:string


        entity

      - +references:EntityInfo\[\]

        - version:integer

        - createdDate:string

        - id:string


          id

        - lastModifiedDate:string

        - name:string


          name

        - additionalAttributes:object


          A map containing additional attributes of entity where both the key and value are Strings.

```json
{
    "trackingId": "ccconfig_c1a4fcef-aee2-4dea-8977-29f594760552",
    "error": {
        "key": "4xx/5xx",
        "message": [\
            {\
                "description": "siteId: not found for given orgId.",\
                "entity": "string",\
                "references": [\
                    {\
                        "id": "string",\
                        "name": "string"\
                    }\
                ]\
            }\
        ],
        "reason": "dependency exists"
    }
}
```

Status: 500

An Unexpected Error Occurred

Schema DefinitionExample Body

- -ApiErrorResponse





  - trackingId:string


    An opaque identifier for mapping protocol failures to service internal codes.



    When specified in a request, it can be used for co-relating events across services

  - +error:ErrorDetails


    Error description..




    - key:string


      An application defined error code.

    - reason:string


      Reason for the failure.

    - +message:OperationError\[\]

      - description:string


        A human readable explanation for the occurrence of an error

      - entity:string


        entity

      - +references:EntityInfo\[\]

        - version:integer

        - createdDate:string

        - id:string


          id

        - lastModifiedDate:string

        - name:string


          name

        - additionalAttributes:object


          A map containing additional attributes of entity where both the key and value are Strings.

```json
{
    "trackingId": "ccconfig_c1a4fcef-aee2-4dea-8977-29f594760552",
    "error": {
        "key": "4xx/5xx",
        "message": [\
            {\
                "description": "siteId: not found for given orgId.",\
                "entity": "string",\
                "references": [\
                    {\
                        "id": "string",\
                        "name": "string"\
                    }\
                ]\
            }\
        ],
        "reason": "dependency exists"
    }
}
```

Configuration

Configuration is not available on this doc

ParametersCode Snippets

POST/organization//user/fetch-by-skill-requirements

orgid\*

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

Request Body (Form)Request Body (JSON)

skillRequirements

Add skillRequirements

### Query Params

Add Query Parameters

### Headers

Use personal access token

application/json

application/hal+json

Add Headers

Run

#### Response:

Data

Click “Run” to get sample response

CurlPythonNodejs

```bash
Copycurl -L --request POST \
--url https://api.wxcc-us1.cisco.com/organization//user/fetch-by-skill-requirements \
--header 'Authorization: Bearer ' \
--header 'Content-Type: application/json' \
--header 'Accept: application/hal+json' \
--data '{}'
```

```python
Copyimport requests

url = "https://api.wxcc-us1.cisco.com/organization//user/fetch-by-skill-requirements"

payload = '''{}'''

headers = {
    "Authorization": "Bearer ",
    "Content-Type": "application/json",
    "Accept": "application/hal+json"
}

response = requests.request('POST', url, headers=headers, data = payload)

print(response.text.encode('utf8'))
```

```javascript
Copyvar request = require('request');

headers = {
    "Authorization": "Bearer ",
    "Content-Type": "application/json",
    "Accept": "application/hal+json"
}
body = `{}`;

var options = {
    method: 'POST',
    url: 'https://api.wxcc-us1.cisco.com/organization//user/fetch-by-skill-requirements',
    headers,
    body,
};

request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
```