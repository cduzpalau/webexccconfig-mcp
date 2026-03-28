[Home](https://developer.webex.com/)/[Agent Personal Greeting](https://developer.webex.com/webex-contact-center/docs/api/v1/agent-personal-greeting)/Create a new Greeting File

Webex Contact Center

Version 1

Deprecated: This operation has been marked as deprecated, which means it could be removed at some point in the future.

Agent Personal Greeting Files

# Create a new Greeting File

**Operation Id:** createConfig\_28

**Description:**

Create a new agent personal greeting File for a given organization.

POST/organization/ **{orgid}**/agent-personal-greeting

## Request Parameters

#### Path

orgidrequiredstring

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

example = "2f9eecc5-0472-4549-9a83-2afdae0d4ba1"

#### Request body

Select Example

application/json

Schema DefinitionExample Body

- -object





  - audioFile\*:string

  - +agentPersonalGreetingInfo\*:AgentPersonalGreetingDTO\_AgentPersonalGreetingsWithAttributeTag

    - createdTime:integer


      This is the created time of the entity.

    - lastUpdatedTime:integer


      This is the updated time of the entity.

    - version:integer


      The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

    - agentId\*:string


      Agent Id with which this greeting file is to be associated with.

    - attributeTag:string


      This is used to identify the purpose of a greeting.

    - audioFile:string

    - blobId:string


      Identifier for the audio file.

    - ciUserId:string


      Id of the Agent in common identity with whom this greeting file is to be associated with.

    - contentType\*:string


      Indicates Content-Type of the Audio file. It can take one of these values: AUDIO\_WAV, AUDIO\_X\_WAV. Valid values are 'AUDIO\_WAV', 'TEXT\_HTML', 'TEXT\_PHP', 'AUDIO\_X\_WAV', 'APPLICATION\_OCTET\_STREAM'

      enum = \["AUDIO\_WAV", "TEXT\_HTML", "TEXT\_PHP", "AUDIO\_X\_WAV", "APPLICATION\_OCTET\_STREAM"\]

    - email:string


      Email of the Agent with whom this greeting file is to be associated with.

    - firstName:string


      First Name of the Agent with whom this greeting file is to be associated with.

    - id:string


      ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

    - lastName:string


      Last Name of the Agent with whom this greeting file is to be associated with.

    - name\*:string


      A name for the Agent's personal greeting file. It should have valid extension i.e. .wav

    - organizationId:string


      ID of the contact center organization. This field is required for all bulk save operations.

    - url:string


      Audio file download url.

    - agentActive:boolean


      Indicates whether the Agent with whom this greeting file is to be associated with is active or not active

```json
{
    "agentPersonalGreetingInfo": {
        "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
        "id": "93912f11-6017-404b-bf14-5331890b1797",
        "version": 1,
        "name": "WelcomeMessage.wav",
        "contentType": "AUDIO_WAV",
        "blobId": "audio-file_a7c700d5-2fac-4a6c-9a16-eb2f2b42d7a8",
        "url": "https://cjp-ccone-devus1-ivr-media.s3.amazonaws.com/bde75a64-f4d5-4ffc-a239-feb607c17ef8/",
        "agentId": "955fe2b9-ba25-4de9-92b0-6cb055d5b432",
        "attributeTag": "ENVIP",
        "firstName": "John",
        "lastName": "Doe",
        "email": "JohnDoe@example.com",
        "agentActive": true,
        "ciUserId": "c71876ae-ddfa-4049-9a1b-298535152578",
        "audioFile": "string",
        "createdTime": 0,
        "lastUpdatedTime": 0
    },
    "audioFile": "string"
}
```

## Responses

Status: 200

OK

Schema DefinitionExample Body

- -AgentPersonalGreetingDTO\_AgentPersonalGreetingsWithAttributeTag





  - createdTime:integer


    This is the created time of the entity.

  - lastUpdatedTime:integer


    This is the updated time of the entity.

  - version:integer


    The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

  - agentId\*:string


    Agent Id with which this greeting file is to be associated with.

  - attributeTag:string


    This is used to identify the purpose of a greeting.

  - audioFile:string

  - blobId:string


    Identifier for the audio file.

  - ciUserId:string


    Id of the Agent in common identity with whom this greeting file is to be associated with.

  - contentType\*:string


    Indicates Content-Type of the Audio file. It can take one of these values: AUDIO\_WAV, AUDIO\_X\_WAV. Valid values are 'AUDIO\_WAV', 'TEXT\_HTML', 'TEXT\_PHP', 'AUDIO\_X\_WAV', 'APPLICATION\_OCTET\_STREAM'

    enum = \["AUDIO\_WAV", "TEXT\_HTML", "TEXT\_PHP", "AUDIO\_X\_WAV", "APPLICATION\_OCTET\_STREAM"\]

  - email:string


    Email of the Agent with whom this greeting file is to be associated with.

  - firstName:string


    First Name of the Agent with whom this greeting file is to be associated with.

  - id:string


    ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

  - lastName:string


    Last Name of the Agent with whom this greeting file is to be associated with.

  - name\*:string


    A name for the Agent's personal greeting file. It should have valid extension i.e. .wav

  - organizationId:string


    ID of the contact center organization. This field is required for all bulk save operations.

  - url:string


    Audio file download url.

  - agentActive:boolean


    Indicates whether the Agent with whom this greeting file is to be associated with is active or not active

```json
{
    "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "id": "93912f11-6017-404b-bf14-5331890b1797",
    "version": 1,
    "name": "WelcomeMessage.wav",
    "contentType": "AUDIO_WAV",
    "blobId": "audio-file_a7c700d5-2fac-4a6c-9a16-eb2f2b42d7a8",
    "url": "https://cjp-ccone-devus1-ivr-media.s3.amazonaws.com/bde75a64-f4d5-4ffc-a239-feb607c17ef8/",
    "agentId": "955fe2b9-ba25-4de9-92b0-6cb055d5b432",
    "attributeTag": "ENVIP",
    "firstName": "John",
    "lastName": "Doe",
    "email": "JohnDoe@example.com",
    "agentActive": true,
    "ciUserId": "c71876ae-ddfa-4049-9a1b-298535152578",
    "audioFile": "string",
    "createdTime": 0,
    "lastUpdatedTime": 0
}
```

Status: 400

The request was invalid and cannot be served. An accompanying error message will explain further

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
        "key": "400",
        "reason": "Test reason",
        "message": [\
            {\
                "description": "Test error",\
                "code": "400",\
                "entity": "cc_user",\
                "references": []\
            }\
        ]
    }
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

Status: 409

Similar entity is already present

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
        "key": "409",
        "reason": "Test reason",
        "message": [\
            {\
                "description": "Test error",\
                "code": "409",\
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

POST/organization//agent-personal-greeting

orgid\*

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

Request Body (Form)Request Body (JSON)

AgentPersonalGreetingDTO\_AgentPersonalGreetingsWithAttributeTag\*

organizationId

ID of the contact center organization. This field is required for all bulk save operations.

id

ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

version

The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

name\*

A name for the Agent's personal greeting file. It should have valid extension i.e. .wav

contentType\*

Indicates Content-Type of the Audio file. It can take one of these values: AUDIO\_WAV, AUDIO\_X\_WAV. Valid values are 'AUDIO\_WAV', 'TEXT\_HTML', 'TEXT\_PHP', 'AUDIO\_X\_WAV', 'APPLICATION\_OCTET\_STREAM'

AUDIO\_WAVTEXT\_HTMLTEXT\_PHPAUDIO\_X\_WAVAPPLICATION\_OCTET\_STREAM

blobId

Identifier for the audio file.

url

Audio file download url.

agentId\*

Agent Id with which this greeting file is to be associated with.

attributeTag

This is used to identify the purpose of a greeting.

firstName

First Name of the Agent with whom this greeting file is to be associated with.

lastName

Last Name of the Agent with whom this greeting file is to be associated with.

email

Email of the Agent with whom this greeting file is to be associated with.

Indicates whether the Agent with whom this greeting file is to be associated with is active or not active

agentActive

ciUserId

Id of the Agent in common identity with whom this greeting file is to be associated with.

audioFile

Upload File

createdTime

This is the created time of the entity.

lastUpdatedTime

This is the updated time of the entity.

audioFile\*

Upload File

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
--url https://api.wxcc-us1.cisco.com/organization//agent-personal-greeting \
--header 'Authorization: Bearer ' \
--header 'Content-Type: application/json' \
--header 'Accept: */*' \
--data '{ "agentPersonalGreetingInfo": {} }'
```

```python
Copyimport requests

url = "https://api.wxcc-us1.cisco.com/organization//agent-personal-greeting"

payload = '''{ "agentPersonalGreetingInfo": {} }'''

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
body = `{ "agentPersonalGreetingInfo": {} }`;

var options = {
    method: 'POST',
    url: 'https://api.wxcc-us1.cisco.com/organization//agent-personal-greeting',
    headers,
    body,
};

request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
```