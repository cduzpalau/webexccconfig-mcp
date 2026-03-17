Global Variables

# Update specific Global Variable by ID

**Operation Id:** updateConfig\_22

**Description:**

Update an existing Global Variable by ID in a given organization. Required fields in payload are agentEditable, variableType, agentViewable, reportable, active, defaultValue.

PUT/organization/ **{orgid}/cad-variable/{id}**

## Request Parameters

#### Path

orgidrequiredstring

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

example = "2f9eecc5-0472-4549-9a83-2afdae0d4ba1"

idrequiredstring

ID of the Global Variable.

example = "2f9eecc5-0472-4549"

#### Request body

Schema DefinitionExample Body

- -CadVariableDTO





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
    "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "id": "93912f11-6017-404b-bf14-5331890b1797",
    "version": 1,
    "name": "Global Variable",
    "description": "Global Variable to describe meta-data.",
    "active": true,
    "agentEditable": true,
    "variableType": "INTEGER",
    "defaultValue": "Default Value",
    "reportable": false,
    "agentViewable": true,
    "sensitive": true,
    "desktopLabel": "Desktop Label",
    "systemDefault": false
}
```

## Responses

Status: 200

OK

Schema DefinitionExample Body

- -CadVariableDTO





  - createdTime:integerreadOnly


    Creation time(in epoch millis) of this resource.

  - lastUpdatedTime:integerreadOnly


    Time(in epoch millis) when this resource was last updated.

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
    "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "id": "93912f11-6017-404b-bf14-5331890b1797",
    "version": 1,
    "name": "Global Variable",
    "description": "Global Variable to describe meta-data.",
    "active": true,
    "agentEditable": true,
    "variableType": "INTEGER",
    "defaultValue": "Default Value",
    "reportable": false,
    "agentViewable": true,
    "sensitive": true,
    "desktopLabel": "Desktop Label",
    "systemDefault": false,
    "createdTime": 1617536244000,
    "lastUpdatedTime": 1617536244000
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

Status: 404

Resource not found or URI is invalid

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

Status: 412

Resource referred in other entity(s). Please get all the reference entities info by invoking Get incoming-references api.

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