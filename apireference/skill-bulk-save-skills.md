[Home](https://developer.webex.com/)/[Skill](https://developer.webex.com/webex-contact-center/docs/api/v1/skill)/Bulk save Skill(s)

Webex Contact Center

Version 1

Skill

# Bulk save Skill(s)

**Operation Id:** saveAllConfig\_4

**Description:**

Create, Update or delete Skill(s) in bulk in a given organization.

POST/organization/ **{orgid}**/skill/bulk

## Request Parameters

#### Path

orgidrequiredstring

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

example = "2f9eecc5-0472-4549-9a83-2afdae0d4ba1"

#### Request body

Schema DefinitionExample Body

- -BulkRequestDTOSkillDTO





  - +items:BulkRequestItemDTOSkillDTO\[\]

    - itemIdentifier:integer


      Unique item identifier for a bulk operation.

    - requestAction:string


      Identifier for action type. Possible values can be SAVE and DELETE.

    - +item:SkillDTO

      - serviceLevelThreshold\*:integer


        Allows to set the time that a customer request can be in a queue before the system flags it as outside the service level.



        If the agent completes a customer service request within this time interval, the system considers it within the service level.

        It is required only for a create or an update operation.

      - version:integer


        The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

      - description:string


        Indicates the description of the skill.

      - id:string


        ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

      - name\*:string


        Indicates the name of the skill. Once created, name cannot be modified.

      - organizationId:string


        ID of the contact center organization. It is required to define for the following operations - All bulk save operations

      - skillType\*:string


        This can be of the following types



        PROFICIENCY: id = 0



        BOOLEAN: id = 1



        TEXT: id = 2



        ENUM: id = 3



        Once created, skillType cannot be modified.

        . Valid values are 'Proficiency', 'Boolean', 'Text', 'enum'

        enum = \["Proficiency", "Boolean", "Text", "enum"\]

      - active\*:boolean


        Indicates the status of the skill whether it is active(when true) or not active(when false). It is required only during a create or an update operation.

      - +enumSkillValues:EnumSkillValueDTO\[\]


        If skillType is enum, the skill can take different sub-values which are defined with this field. For instance, a skill named "tech support" may have enumSkillValues for "windows", "macOS" and "linux".




        - version:integer


          The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

        - description:string


          Indicates the description of the enumSkillValue.

        - id:string


          ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

        - name\*:string


          Indicates the name of the enumSkillValue.

        - organizationId:string


          ID of the contact center organization. It is required to define for the following operations - All bulk save operations

        - skillId:string


          Represents the skillId of the enumSkillValue.

```json
{
    "items": [\
        {\
            "itemIdentifier": 10,\
            "item": {\
                "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
                "id": "93912f11-6017-404b-bf14-5331890b1797",\
                "version": 1,\
                "name": "German Speaking",\
                "description": "Skill to speak fluent German.",\
                "serviceLevelThreshold": 0,\
                "enumSkillValues": [\
                    {\
                        "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
                        "id": "93912f11-6017-404b-bf14-5331890b1797",\
                        "version": 1,\
                        "name": "MacOS support",\
                        "description": "Ability to troubleshoot macOS issues.",\
                        "skillId": "93912f11-6017-404b-bf14-5331890b1797"\
                    }\
                ],\
                "active": true,\
                "skillType": "BOOLEAN"\
            },\
            "requestAction": "SAVE"\
        }\
    ]
}
```

## Responses

Status: 207

Multi-Status

Schema DefinitionExample Body

- -BulkResponseDTO





  - +items:BulkResponseItemDTO\[\]

    - itemIdentifier:integer


      Unique item identifier for a bulk operation.

    - status:integer


      Indicates the error status code.

    - href:string


      The resource URI of an entity.

    - operationType:string


      The kind of operation desired of an entity.

      enum = \["CREATE", "UPDATE", "DELETE", "GET"\]

    - +apiError:ApiErrorResponse

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
    "items": [\
        {\
            "apiError": {\
                "error": {\
                    "key": "400",\
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
                    ],\
                    "reason": "dependency exists"\
                },\
                "trackingId": "ccconfig_c1a4fcef-aee2-4dea-8977-29f594760552"\
            },\
            "href": "/api/organization/6705c69d-4585-42ad-bfc3-79cc485dfb15/team/7b26d174-0016-4682-9858-65918e05f85",\
            "itemIdentifier": 10,\
            "operationType": "CREATE",\
            "status": 400\
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

POST/organization//skill/bulk

orgid\*

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

Request Body (Form)Request Body (JSON)

BulkRequestDTOSkillDTO

items

Add items

### Query Params

### Headers

Use personal access token

application/json

\*/\*

Add Headers

Run

#### Response:

Data

Click “Run” to get sample response

CurlPythonNodejs

```bash
Copycurl -L --request POST \
--url https://api.wxcc-us1.cisco.com/organization//skill/bulk \
--header 'Authorization: Bearer ' \
--header 'Content-Type: application/json' \
--header 'Accept: */*' \
--data '{}'
```

```python
Copyimport requests

url = "https://api.wxcc-us1.cisco.com/organization//skill/bulk"

payload = '''{}'''

headers = {
    "Authorization": "Bearer ",
    "Content-Type": "application/json",
    "Accept": "*/*"
}

response = requests.request('POST', url, headers=headers, data = payload)

print(response.text.encode('utf8'))
```

```javascript
Copyvar request = require('request');

headers = {
    "Authorization": "Bearer ",
    "Content-Type": "application/json",
    "Accept": "*/*"
}
body = `{}`;

var options = {
    method: 'POST',
    url: 'https://api.wxcc-us1.cisco.com/organization//skill/bulk',
    headers,
    body,
};

request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
```