[Home](https://developer.webex.com/)/[Multimedia Profile](https://developer.webex.com/webex-contact-center/docs/api/v1/multimedia-profile)/Create a new Multimedia Profile

Webex Contact Center

Version 1

Multimedia Profile

# Create a new Multimedia Profile

**Operation Id:** createConfig\_11

**Description:**

Create a new Multimedia Profile in a given organization.

POST/organization/ **{orgid}**/multimedia-profile

## Request Parameters

#### Path

orgidrequiredstring

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

example = "2f9eecc5-0472-4549-9a83-2afdae0d4ba1"

#### Request body

Schema DefinitionExample Body

- -MultimediaProfileDTO





  - chat\*:integer


    Define the upper limits for this channel type. It should range from 0 or 1(depends on the 'BlendingMode') to 5.

  - email\*:integer


    Define the upper limits for this channel type. It should range from 0 to 5.

  - social\*:integer


    Define the upper limits for this channel type. It should range from 0 to 5.

  - telephony\*:integer


    Define the upper limits for this channel type. It should be either 0 or 1(depends on the 'BlendingMode').

  - version:integer


    The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

  - blendingMode\*:string


    Blending mode can be one the following:



    BLENDED: This mode allows agents to handle multiple contacts of different channel types simultaneously. Number of contacts that you can set for Voice: 0â€“1 and for Chat, Email, and Social Channel: 0â€“5



    BLENDED\_REALTIME: This allows agents to handle a contact of one real-time channel at a time - either voice or chat. Along with this they can handle non-realtime contacts which include email and social channels. Number of contacts that you can set for Voice: 1 (mandatory), Chat: 1â€“5, Email and Social Channel: 0â€“5



    EXCLUSIVE: This mode allows agents to focus on one customer contact at a time.

  - description:string


    Enter a description for the multimedia profile.

  - id:string


    ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

  - name\*:string


    Enter the name for the multimedia profile. Generally, use names that indicate the type of the profile, such as Default Telephony Profile.

  - organizationId:string


    ID of the contact center organization. It is required to define for the following operations - All bulk save operations

  - active\*:boolean


    Specify whether the multimedia profile is active or not.

  - blendingModeEnabled\*:boolean


    Specify whether the blending mode is enabled or not for a multimedia profile.

  - systemDefault:boolean


    Indicates whether the created resource is system created or not

  - +manuallyAssignable:MultimediaProfileChannelDTO

    - chat\*:integer


      Define the upper limits for this channel type. It should range from 0 to 5.

    - email\*:integer


      Define the upper limits for this channel type. It should range from 0 to 10.

    - social\*:integer


      Define the upper limits for this channel type. It should range from 0 to 5.

    - telephony\*:integer


      Define the upper limits for this channel type. It should be either 0 or 1.

    - version:integer


      The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

    - id:string


      ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

    - organizationId:string


      ID of the contact center organization. It is required to define for the following operations - All bulk save operations

```json
{
    "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "id": "93912f11-6017-404b-bf14-5331890b1797",
    "version": 1,
    "name": "Default Telephony Profile",
    "description": "This multimedia profile is for Default Telephony Profile",
    "chat": 0,
    "email": 5,
    "telephony": 0,
    "social": 4,
    "active": true,
    "blendingModeEnabled": true,
    "blendingMode": "BLENDED",
    "systemDefault": false,
    "manuallyAssignable": {
        "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
        "id": "93912f11-6017-404b-bf14-5331890b1797",
        "version": 1,
        "telephony": 0,
        "chat": 5,
        "email": 5,
        "social": 4
    }
}
```

## Responses

Status: 200

OK

Schema DefinitionExample Body

- -MultimediaProfileDTO





  - chat\*:integer


    Define the upper limits for this channel type. It should range from 0 or 1(depends on the 'BlendingMode') to 5.

  - createdTime:integerreadOnly


    Creation time(in epoch millis) of this resource.

  - email\*:integer


    Define the upper limits for this channel type. It should range from 0 to 5.

  - lastUpdatedTime:integerreadOnly


    Time(in epoch millis) when this resource was last updated.

  - social\*:integer


    Define the upper limits for this channel type. It should range from 0 to 5.

  - telephony\*:integer


    Define the upper limits for this channel type. It should be either 0 or 1(depends on the 'BlendingMode').

  - version:integer


    The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

  - blendingMode\*:string


    Blending mode can be one the following:



    BLENDED: This mode allows agents to handle multiple contacts of different channel types simultaneously. Number of contacts that you can set for Voice: 0â€“1 and for Chat, Email, and Social Channel: 0â€“5



    BLENDED\_REALTIME: This allows agents to handle a contact of one real-time channel at a time - either voice or chat. Along with this they can handle non-realtime contacts which include email and social channels. Number of contacts that you can set for Voice: 1 (mandatory), Chat: 1â€“5, Email and Social Channel: 0â€“5



    EXCLUSIVE: This mode allows agents to focus on one customer contact at a time.

  - description:string


    Enter a description for the multimedia profile.

  - id:string


    ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

  - name\*:string


    Enter the name for the multimedia profile. Generally, use names that indicate the type of the profile, such as Default Telephony Profile.

  - organizationId:string


    ID of the contact center organization. It is required to define for the following operations - All bulk save operations

  - active\*:boolean


    Specify whether the multimedia profile is active or not.

  - blendingModeEnabled\*:boolean


    Specify whether the blending mode is enabled or not for a multimedia profile.

  - systemDefault:boolean


    Indicates whether the created resource is system created or not

  - +manuallyAssignable:MultimediaProfileChannelDTO

    - chat\*:integer


      Define the upper limits for this channel type. It should range from 0 to 5.

    - createdTime:integerreadOnly


      Creation time(in epoch millis) of this resource.

    - email\*:integer


      Define the upper limits for this channel type. It should range from 0 to 10.

    - lastUpdatedTime:integerreadOnly


      Time(in epoch millis) when this resource was last updated.

    - social\*:integer


      Define the upper limits for this channel type. It should range from 0 to 5.

    - telephony\*:integer


      Define the upper limits for this channel type. It should be either 0 or 1.

    - version:integer


      The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

    - id:string


      ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

    - organizationId:string


      ID of the contact center organization. It is required to define for the following operations - All bulk save operations

```json
{
    "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "id": "93912f11-6017-404b-bf14-5331890b1797",
    "version": 1,
    "name": "Default Telephony Profile",
    "description": "This multimedia profile is for Default Telephony Profile",
    "chat": 0,
    "email": 5,
    "telephony": 0,
    "social": 4,
    "active": true,
    "blendingModeEnabled": true,
    "blendingMode": "BLENDED",
    "systemDefault": false,
    "manuallyAssignable": {
        "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
        "id": "93912f11-6017-404b-bf14-5331890b1797",
        "version": 1,
        "telephony": 0,
        "chat": 5,
        "email": 5,
        "social": 4,
        "createdTime": 1617536244000,
        "lastUpdatedTime": 1617536244000
    },
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

POST/organization//multimedia-profile

orgid\*

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

Request Body (Form)Request Body (JSON)

MultimediaProfileDTO

organizationId

ID of the contact center organization. It is required to define for the following operations - All bulk save operations

id

ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

version

The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

name\*

Enter the name for the multimedia profile. Generally, use names that indicate the type of the profile, such as Default Telephony Profile.

description

Enter a description for the multimedia profile.

chat\*

Define the upper limits for this channel type. It should range from 0 or 1(depends on the 'BlendingMode') to 5.

email\*

Define the upper limits for this channel type. It should range from 0 to 5.

telephony\*

Define the upper limits for this channel type. It should be either 0 or 1(depends on the 'BlendingMode').

social\*

Define the upper limits for this channel type. It should range from 0 to 5.

Specify whether the multimedia profile is active or not.

active

Specify whether the blending mode is enabled or not for a multimedia profile.

blendingModeEnabled

blendingMode\*

Blending mode can be one the following:

BLENDED: This mode allows agents to handle multiple contacts of different channel types simultaneously. Number of contacts that you can set for Voice: 0â€“1 and for Chat, Email, and Social Channel: 0â€“5

BLENDED\_REALTIME: This allows agents to handle a contact of one real-time channel at a time - either voice or chat. Along with this they can handle non-realtime contacts which include email and social channels. Number of contacts that you can set for Voice: 1 (mandatory), Chat: 1â€“5, Email and Social Channel: 0â€“5

EXCLUSIVE: This mode allows agents to focus on one customer contact at a time.

Indicates whether the created resource is system created or not

systemDefault

MultimediaProfileChannelDTO

organizationId

ID of the contact center organization. It is required to define for the following operations - All bulk save operations

id

ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

version

The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

telephony\*

Define the upper limits for this channel type. It should be either 0 or 1.

chat\*

Define the upper limits for this channel type. It should range from 0 to 5.

email\*

Define the upper limits for this channel type. It should range from 0 to 10.

social\*

Define the upper limits for this channel type. It should range from 0 to 5.

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
--url https://api.wxcc-us1.cisco.com/organization//multimedia-profile \
--header 'Authorization: Bearer ' \
--header 'Content-Type: application/json' \
--header 'Accept: */*' \
--data '{}'
```

```python
Copyimport requests

url = "https://api.wxcc-us1.cisco.com/organization//multimedia-profile"

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
    url: 'https://api.wxcc-us1.cisco.com/organization//multimedia-profile',
    headers,
    body,
};

request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
```