[Home](https://developer.webex.com/)/[Global Variables](https://developer.webex.com/webex-contact-center/docs/api/v1/global-variables)/Bulk save Global Variable(s)

Webex Contact Center

Version 1

Global Variables

# Bulk save Global Variable(s)

**Operation Id:** saveAllConfig\_18

**Description:**

Export all Global Variable(s) in a given organization.

POST/organization/ **{orgid}**/cad-variable/bulk

## Request Parameters

#### Path

orgidrequiredstring

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

example = "2f9eecc5-0472-4549-9a83-2afdae0d4ba1"

#### Request body

Schema DefinitionExample Body

- -BulkRequestDTOCadVariableDTO





  - +items:BulkRequestItemDTOCadVariableDTO\[\]

    - itemIdentifier:integer


      Unique item identifier for a bulk operation.

    - requestAction:string


      Identifier for action type. Possible values can be SAVE and DELETE.

    - +item:CadVariableDTO

      - version:integer


        The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

      - defaultValue\*:string


        A default value for the Global Variable.

      - description:string


        A the description for the Global Variable created.

      - desktopLabel:string


        A desktop label for the Global Variable created.

      - id:string


        ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

      - name\*:string


        A name for the Global Variable.

      - organizationId:string


        ID of the contact center organization. It is required to define for the following operations - All bulk save operations

      - variableType\*:string


        A valid Global Variable Type. The valid types are: String, Integer, DateTime, Boolean, Decimal. Valid values are 'STRING', 'INTEGER', 'DATE\_TIME', 'BOOLEAN', 'DECIMAL', 'String', 'Integer', 'DateTime', 'Boolean', 'Decimal'

        enum = \["STRING", "INTEGER", "DATE\_TIME", "BOOLEAN", "DECIMAL", ...\]

      - active\*:boolean


        Indicates whether the Global Variable is active or not.

      - agentEditable\*:boolean


        Indicates whether the Global Variable is editable in the Agent Desktop by the agent or not.

      - agentViewable\*:boolean


        Indicates whether the agent can view the Global Variable in Agent Desktop or not.

      - reportable\*:boolean


        Indicates whether the Global Variable is reportable or not.

      - sensitive:boolean


        Indicates whether the Global Variable is sensitive or not.

      - systemDefault:boolean


        Indicates whether the created resource is system created or not

```json
{
    "items": [\
        {\
            "itemIdentifier": 10,\
            "item": {\
                "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
                "id": "93912f11-6017-404b-bf14-5331890b1797",\
                "version": 1,\
                "name": "Global Variable",\
                "description": "Global Variable to describe meta-data.",\
                "active": true,\
                "agentEditable": true,\
                "variableType": "INTEGER",\
                "defaultValue": "Default Value",\
                "reportable": false,\
                "agentViewable": true,\
                "sensitive": true,\
                "desktopLabel": "Desktop Label",\
                "systemDefault": false\
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

POST/organization//cad-variable/bulk

orgid\*

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

Request Body (Form)Request Body (JSON)

BulkRequestDTOCadVariableDTO

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
--url https://api.wxcc-us1.cisco.com/organization//cad-variable/bulk \
--header 'Authorization: Bearer ' \
--header 'Content-Type: application/json' \
--header 'Accept: */*' \
--data '{}'
```

```python
Copyimport requests

url = "https://api.wxcc-us1.cisco.com/organization//cad-variable/bulk"

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
    url: 'https://api.wxcc-us1.cisco.com/organization//cad-variable/bulk',
    headers,
    body,
};

request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
```