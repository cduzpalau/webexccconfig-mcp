[Home](https://developer.webex.com/)/[Skill](https://developer.webex.com/webex-contact-center/docs/api/v1/skill)/Create a new Skill

Webex Contact Center

Version 1

Skill

# Create a new Skill

**Operation Id:** createConfig\_5

**Description:**

Create a new Skill in a given organization.

POST/organization/ **{orgid}**/skill

## Request Parameters

#### Path

orgidrequiredstring

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

example = "2f9eecc5-0472-4549-9a83-2afdae0d4ba1"

#### Request body

Schema DefinitionExample Body

- -SkillDTO





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
    "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "id": "93912f11-6017-404b-bf14-5331890b1797",
    "version": 1,
    "name": "German Speaking",
    "description": "Skill to speak fluent German.",
    "serviceLevelThreshold": 0,
    "enumSkillValues": [\
        {\
            "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
            "id": "93912f11-6017-404b-bf14-5331890b1797",\
            "version": 1,\
            "name": "MacOS support",\
            "description": "Ability to troubleshoot macOS issues.",\
            "skillId": "93912f11-6017-404b-bf14-5331890b1797"\
        }\
    ],
    "active": true,
    "skillType": "BOOLEAN"
}
```

## Responses

Status: 201

Created

Schema DefinitionExample Body

- -SkillDTO





  - createdTime:integerreadOnly


    Creation time(in epoch millis) of this resource.

  - lastUpdatedTime:integerreadOnly


    Time(in epoch millis) when this resource was last updated.

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




    - createdTime:integerreadOnly


      Creation time(in epoch millis) of this resource.

    - lastUpdatedTime:integerreadOnly


      Time(in epoch millis) when this resource was last updated.

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
    "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "id": "93912f11-6017-404b-bf14-5331890b1797",
    "version": 1,
    "name": "German Speaking",
    "description": "Skill to speak fluent German.",
    "serviceLevelThreshold": 0,
    "enumSkillValues": [\
        {\
            "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
            "id": "93912f11-6017-404b-bf14-5331890b1797",\
            "version": 1,\
            "name": "MacOS support",\
            "description": "Ability to troubleshoot macOS issues.",\
            "skillId": "93912f11-6017-404b-bf14-5331890b1797",\
            "createdTime": 1617536244000,\
            "lastUpdatedTime": 1617536244000\
        }\
    ],
    "active": true,
    "skillType": "BOOLEAN",
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

Configuration

Configuration is not available on this doc

ParametersCode Snippets

POST/organization//skill

orgid\*

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

Request Body (Form)Request Body (JSON)

SkillDTO

organizationId

ID of the contact center organization. It is required to define for the following operations - All bulk save operations

id

ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

version

The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

name\*

Indicates the name of the skill. Once created, name cannot be modified.

description

Indicates the description of the skill.

serviceLevelThreshold\*

Allows to set the time that a customer request can be in a queue before the system flags it as outside the service level.

If the agent completes a customer service request within this time interval, the system considers it within the service level.

It is required only for a create or an update operation.

enumSkillValues

Add enumSkillValues

Indicates the status of the skill whether it is active(when true) or not active(when false). It is required only during a create or an update operation.

active

skillType\*

This can be of the following types

PROFICIENCY: id = 0

BOOLEAN: id = 1

TEXT: id = 2

ENUM: id = 3

Once created, skillType cannot be modified.

. Valid values are 'Proficiency', 'Boolean', 'Text', 'enum'

ProficiencyBooleanTextenum

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
--url https://api.wxcc-us1.cisco.com/organization//skill \
--header 'Authorization: Bearer ' \
--header 'Content-Type: application/json' \
--header 'Accept: */*' \
--data '{}'
```

```python
Copyimport requests

url = "https://api.wxcc-us1.cisco.com/organization//skill"

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
    url: 'https://api.wxcc-us1.cisco.com/organization//skill',
    headers,
    body,
};

request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
```