[Home](https://developer.webex.com/)/[Agent Personal Greeting](https://developer.webex.com/webex-contact-center/docs/api/v1/agent-personal-greeting)/List Greeting File(s)

Webex Contact Center

Version 3

Agent Personal Greeting Files

# List Greeting File(s)

**Operation Id:** getAllV2ConfigWithMetaData

**Description:**

Retrieve a list of Greeting File(s) in a given organization.

GET/organization/ **{orgid}**/v3/agent-personal-greeting

## Request Parameters

#### Path

orgidrequiredstring

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

example = "2f9eecc5-0472-4549-9a83-2afdae0d4ba1"

#### Query

filterstring

Specify a filter based on which the results will be fetched. Supported fields are : firstname, lastname, email, ciUserId and attribute tag

The examples below show some search queries

- id=="57efb0e6-5af0-4245-a67d-d3c5045cdb6e"
- id!="57efb0e6-5af0-4245-a67d-d3c5045cdb6e"
- id=in=("57efb0e6-5af0-4245-a67d-d3c5045cdb6e","a421e0b2-732e-46f3-a057-39160a53afb9")
- id=out=("57efb0e6-5af0-4245-a67d-d3c5045cdb6e","a421e0b2-732e-46f3-a057-39160a53afb9")

This parameter uses the RSQL query syntax, a URI-friendly format for expressing criteria for filtering REST entities. For more information about RSQL in general, see [this reference](https://www.here.com/docs/bundle/data-client-library-developer-guide-java-scala/page/client/rsql.html). For a list of supported operators, see [this syntax guide](https://github.com/perplexhub/rsql-jpa-specification#rsql-syntax-reference).

Note: values to be used in the filter syntax should not contain spaces. If they do, please enclose them in quotes to apply the filter.

example = "id=="2f9eecc5-0472-4549-9a83-2afdae0d4ba1""

searchstring

Filter data based on the search keyword.Supported search columns(firstName, lastName, email, attributeTag)

The examples below show some search queries

- "Cisco"
- field=="firstName";value=="Cisco"
- fields=in=("firstName","email");value=="Cisco"

example = "contact center"

attributesstring

Specify the attributes to be returned. By default, all attributes are returned along with the specified columns. All attributes are supported.

example = "id"

pageinteger

Defines the number of displayed page. The page number starts from 0.

default = 0

pageSizeinteger

Defines the number of items to be displayed on a page. If the number specified is more than allowed max page size, the API will automatically adjust the page size to the max page size.

example = 100, default = 100

includeAgentDetailsboolean

If includeAgentDetails is set to true then projection, filtering, searching, and sorting on agent firstName, lastName and email will be enabled.

default = false

## Responses

Status: 200

OK

Schema DefinitionExample Body

- -object





  - +meta:MetaDataWithPagingInfo


    Metadata of response with paging information




    - page:integer


      Current page number.

    - pageSize:integer


      Page size for current data set.

    - totalPages:integer


      Number of pages.

    - totalRecords:integer


      Total number of items.

    - orgid:string


      Organization ID.

    - links:object


      Map of pagination links with `self`, `next`, `prev`, `last`, and `first`.
  - +data:AgentPersonalGreetingDTO\_AgentPersonalGreetingsWithGreetingPurpose\[\]

    - createdTime:integer


      This is the created time of the entity.

    - lastUpdatedTime:integer


      This is the updated time of the entity.

    - version:integer


      The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

    - agentId\*:string


      Agent Id with which this greeting file is to be associated with.

    - audioFile:string

    - blobId:string


      Identifier for the audio file.

    - ciUserId:string


      Id of the Agent in common identity with whom this greeting file is to be associated with.

    - contentType\*:string


      Indicates Content-Type of the Audio file. It can take one of these values: AUDIO\_WAV, AUDIO\_X\_WAV

      enum = \["AUDIO\_WAV", "TEXT\_HTML", "TEXT\_PHP", "AUDIO\_X\_WAV", "APPLICATION\_OCTET\_STREAM"\]

    - email:string


      Email of the Agent with whom this greeting file is to be associated with.

    - firstName:string


      First Name of the Agent with whom this greeting file is to be associated with.

    - greetingPurposeId:string


      Id of the greeting purpose

    - greetingPurposeName:string


      Name of the greeting purpose

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
    "meta": {
        "orgid": "2f9eecc5-0472-4549-9a83-2afdae0d4ba1",
        "page": 1,
        "pageSize": 100,
        "totalPages": 1,
        "totalRecords": 1000,
        "links": {
            "next": "/organization/bde75a64-f4d5-4ffc-a239-feb607c17ef8/entity-name?page=2&pageSize=10",
            "last": "/organization/bde75a64-f4d5-4ffc-a239-feb607c17ef8/entity-name?page=3&pageSize=10",
            "prev": "/organization/bde75a64-f4d5-4ffc-a239-feb607c17ef8/entity-name?page=0&pageSize=10",
            "self": "/organization/bde75a64-f4d5-4ffc-a239-feb607c17ef8/entity-name?page=1&pageSize=10",
            "first": "/organization/bde75a64-f4d5-4ffc-a239-feb607c17ef8/entity-name?page=0&pageSize=10"
        }
    },
    "data": [\
        {\
            "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
            "id": "93912f11-6017-404b-bf14-5331890b1797",\
            "version": 1,\
            "name": "WelcomeMessage.wav",\
            "contentType": "AUDIO_WAV",\
            "blobId": "audio-file_a7c700d5-2fac-4a6c-9a16-eb2f2b42d7a8",\
            "url": "https://cjp-ccone-devus1-ivr-media.s3.amazonaws.com/bde75a64-f4d5-4ffc-a239-feb607c17ef8/",\
            "agentId": "955fe2b9-ba25-4de9-92b0-6cb055d5b432",\
            "firstName": "John",\
            "lastName": "Doe",\
            "email": "JohnDoe@example.com",\
            "agentActive": true,\
            "ciUserId": "c71876ae-ddfa-4049-9a1b-298535152578",\
            "greetingPurposeId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
            "greetingPurposeName": "en",\
            "audioFile": "string",\
            "createdTime": 0,\
            "lastUpdatedTime": 0\
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

GET/organization//v3/agent-personal-greeting

orgid\*

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

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
--url https://api.wxcc-us1.cisco.com/organization//v3/agent-personal-greeting \
--header 'Authorization: Bearer ' \
--header 'Accept: */*'
```

```python
Copyimport requests

url = "https://api.wxcc-us1.cisco.com/organization//v3/agent-personal-greeting"

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
    url: 'https://api.wxcc-us1.cisco.com/organization//v3/agent-personal-greeting',
    headers,
    body,
};

request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
```