Version 1

Audio Files

# Create a new Audio File

**Operation Id:** createConfig\_26

**Description:**

Create a new Audio File in a given organization.

POST/organization/ **{orgid}**/audio-file

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

  - +audioFileInfo\*:AudioFileInfoDTO

    - version:integer


      The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

    - audioFile:string

    - blobId:string


      Identifier for the audio file.

    - contentType\*:string


      Indicates Content-Type of the Audio file. It can take one of these values: AUDIO\_WAV, AUDIO\_X\_WAV. Valid values are 'AUDIO\_WAV', 'TEXT\_HTML', 'TEXT\_PHP', 'AUDIO\_X\_WAV', 'APPLICATION\_OCTET\_STREAM'

      enum = \["AUDIO\_WAV", "TEXT\_HTML", "TEXT\_PHP", "AUDIO\_X\_WAV", "APPLICATION\_OCTET\_STREAM"\]

    - description:string


      A short description of the dial plan.

    - id:string


      ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

    - name\*:string


      A name for the Agent's personal greeting file. It should have valid extension i.e. .wav

    - organizationId:string


      ID of the contact center organization. It is required to define for the following operations - All bulk save operations

    - url:string


      Audio file download url.

    - systemDefault:boolean


      Indicates whether the created resource is system created or not

```json
{
    "audioFileInfo": {
        "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
        "id": "93912f11-6017-404b-bf14-5331890b1797",
        "version": 1,
        "name": "WelcomeMessage.wav",
        "contentType": "AUDIO_WAV",
        "blobId": "audio-file_a7c700d5-2fac-4a6c-9a16-eb2f2b42d7a8",
        "url": "https://cjp-ccone-devus1-ivr-media.s3.amazonaws.com/bde75a64-f4d5-4ffc-a239-feb607c17ef8/",
        "description": "Required for transferring calls to Queues",
        "systemDefault": false,
        "audioFile": "string"
    },
    "audioFile": "string"
}
```

## Responses

Status: 200

OK

Schema DefinitionExample Body

- -AudioFileInfoDTO





  - createdTime:integerreadOnly


    Creation time(in epoch millis) of this resource.

  - lastUpdatedTime:integerreadOnly


    Time(in epoch millis) when this resource was last updated.

  - version:integer


    The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

  - audioFile:string

  - blobId:string


    Identifier for the audio file.

  - contentType\*:string


    Indicates Content-Type of the Audio file. It can take one of these values: AUDIO\_WAV, AUDIO\_X\_WAV. Valid values are 'AUDIO\_WAV', 'TEXT\_HTML', 'TEXT\_PHP', 'AUDIO\_X\_WAV', 'APPLICATION\_OCTET\_STREAM'

    enum = \["AUDIO\_WAV", "TEXT\_HTML", "TEXT\_PHP", "AUDIO\_X\_WAV", "APPLICATION\_OCTET\_STREAM"\]

  - description:string


    A short description of the dial plan.

  - id:string


    ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

  - name\*:string


    A name for the Agent's personal greeting file. It should have valid extension i.e. .wav

  - organizationId:string


    ID of the contact center organization. It is required to define for the following operations - All bulk save operations

  - url:string


    Audio file download url.

  - systemDefault:boolean


    Indicates whether the created resource is system created or not

```json
{
    "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "id": "93912f11-6017-404b-bf14-5331890b1797",
    "version": 1,
    "name": "WelcomeMessage.wav",
    "contentType": "AUDIO_WAV",
    "blobId": "audio-file_a7c700d5-2fac-4a6c-9a16-eb2f2b42d7a8",
    "url": "https://cjp-ccone-devus1-ivr-media.s3.amazonaws.com/bde75a64-f4d5-4ffc-a239-feb607c17ef8/",
    "description": "Required for transferring calls to Queues",
    "systemDefault": false,
    "audioFile": "string",
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