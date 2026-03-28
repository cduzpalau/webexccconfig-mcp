Version 1

Skill Profile

# Create a new Skill Profile

**Operation Id:** createConfig\_6

**Description:**

Create a new Skill Profile in a given organization.

POST/organization/ **{orgid}**/skill-profile

## Request Parameters

#### Path

orgidrequiredstring

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

example = "2f9eecc5-0472-4549-9a83-2afdae0d4ba1"

#### Request body

Schema DefinitionExample Body

- -SkillProfileDTO





  - version:integer


    The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

  - description:string


    A short description of the skill profile.

  - id:string


    ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

  - name\*:string


    Indicates the name of the skill Profile. It is required only during a create or an update operation.

  - organizationId:string


    ID of the contact center organization. It is required to define for the following operations - All bulk save operations

  - +activeEnumSkills:ActiveEnumSkillDTO\[\]


    Indicates a value that represents a skill the agent has.




    - version:integer


      The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

    - enumSkillId:string


      Enum skill ID, included only if 'includeSkillDetails' is true.

    - enumSkillName:string


      Enum skill name, included in the payload only if 'includeSkillDetails' is true.

    - enumSkillValue:string


      Enum skill value, included only if 'includeSkillDetails' is true.

    - enumSkillValueId\*:string


      ID of the enumSkillValue.

    - id:string


      ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

    - organizationId:string


      ID of the contact center organization. It is required to define for the following operations - All bulk save operations
  - +activeSkills\*:ActiveSkillDTO\[\]


    In activeSkills and activeEnumSkills at least one skill is mandatory.




    - proficiencyValue:integer


      A number between 0 and 10 to indicate how proficient the agent is in this skill.

    - version:integer


      The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

    - id:string


      ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

    - organizationId:string


      ID of the contact center organization. It is required to define for the following operations - All bulk save operations

    - skillId\*:string


      Indicates a value that represents a skill the agent has.

    - skillName:string


      Name of the skill, included in the payload only when 'includeSkillDetails' is true.

    - textValue:string


      A short textual description that represents a skill the agent has.

    - booleanValue\*:boolean


      Indicates whether the agent has this skill (True) or does not have the skill (False).

```json
{
    "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "id": "93912f11-6017-404b-bf14-5331890b1797",
    "version": 1,
    "name": "German Speaker",
    "description": "Required for transferring out-dial calls to Queues",
    "activeSkills": [\
        {\
            "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
            "id": "93912f11-6017-404b-bf14-5331890b1797",\
            "version": 1,\
            "textValue": "Credit card SME",\
            "booleanValue": true,\
            "proficiencyValue": 1,\
            "skillId": "FRENCH",\
            "skillName": "Customer Support"\
        }\
    ],
    "activeEnumSkills": [\
        {\
            "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
            "id": "93912f11-6017-404b-bf14-5331890b1797",\
            "version": 1,\
            "enumSkillValueId": "93912f11-6017-404b-bf14-5331890b1797",\
            "enumSkillName": "Language",\
            "enumSkillValue": "English",\
            "enumSkillId": "56912f11-6017-404b-bf14-5331890b1456"\
        }\
    ]
}
```

## Responses

Status: 201

Created

Schema DefinitionExample Body

- -SkillProfileDTO





  - createdTime:integerreadOnly


    Creation time(in epoch millis) of this resource.

  - lastUpdatedTime:integerreadOnly


    Time(in epoch millis) when this resource was last updated.

  - version:integer


    The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

  - description:string


    A short description of the skill profile.

  - id:string


    ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

  - name\*:string


    Indicates the name of the skill Profile. It is required only during a create or an update operation.

  - organizationId:string


    ID of the contact center organization. It is required to define for the following operations - All bulk save operations

  - +activeEnumSkills:ActiveEnumSkillDTO\[\]


    Indicates a value that represents a skill the agent has.




    - createdTime:integerreadOnly


      Creation time(in epoch millis) of this resource.

    - lastUpdatedTime:integerreadOnly


      Time(in epoch millis) when this resource was last updated.

    - version:integer


      The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

    - enumSkillId:string


      Enum skill ID, included only if 'includeSkillDetails' is true.

    - enumSkillName:string


      Enum skill name, included in the payload only if 'includeSkillDetails' is true.

    - enumSkillValue:string


      Enum skill value, included only if 'includeSkillDetails' is true.

    - enumSkillValueId\*:string


      ID of the enumSkillValue.

    - id:string


      ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

    - organizationId:string


      ID of the contact center organization. It is required to define for the following operations - All bulk save operations
  - +activeSkills\*:ActiveSkillDTO\[\]


    In activeSkills and activeEnumSkills at least one skill is mandatory.




    - createdTime:integerreadOnly


      Creation time(in epoch millis) of this resource.

    - lastUpdatedTime:integerreadOnly


      Time(in epoch millis) when this resource was last updated.

    - proficiencyValue:integer


      A number between 0 and 10 to indicate how proficient the agent is in this skill.

    - version:integer


      The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

    - id:string


      ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

    - organizationId:string


      ID of the contact center organization. It is required to define for the following operations - All bulk save operations

    - skillId\*:string


      Indicates a value that represents a skill the agent has.

    - skillName:string


      Name of the skill, included in the payload only when 'includeSkillDetails' is true.

    - textValue:string


      A short textual description that represents a skill the agent has.

    - booleanValue\*:boolean


      Indicates whether the agent has this skill (True) or does not have the skill (False).

```json
{
    "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "id": "93912f11-6017-404b-bf14-5331890b1797",
    "version": 1,
    "name": "German Speaker",
    "description": "Required for transferring out-dial calls to Queues",
    "activeSkills": [\
        {\
            "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
            "id": "93912f11-6017-404b-bf14-5331890b1797",\
            "version": 1,\
            "textValue": "Credit card SME",\
            "booleanValue": true,\
            "proficiencyValue": 1,\
            "skillId": "FRENCH",\
            "createdTime": 1617536244000,\
            "lastUpdatedTime": 1617536244000,\
            "skillName": "Customer Support"\
        }\
    ],
    "activeEnumSkills": [\
        {\
            "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
            "id": "93912f11-6017-404b-bf14-5331890b1797",\
            "version": 1,\
            "enumSkillValueId": "93912f11-6017-404b-bf14-5331890b1797",\
            "createdTime": 1617536244000,\
            "lastUpdatedTime": 1617536244000,\
            "enumSkillName": "Language",\
            "enumSkillValue": "English",\
            "enumSkillId": "56912f11-6017-404b-bf14-5331890b1456"\
        }\
    ],
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