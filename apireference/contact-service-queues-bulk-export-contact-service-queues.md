[Home](https://developer.webex.com/)/[Contact Service Queues](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues)/Bulk export Contact Service Queue(s)

Webex Contact Center

Version 1

Contact Service Queue

# Bulk export Contact Service Queue(s)

**Operation Id:** bulkExport\_16

**Description:**

Export all Contact Service Queue(s) in a given organization.

GET/organization/ **{orgid}**/contact-service-queue/bulk-export

## Request Parameters

#### Path

orgidrequiredstring

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

example = "2f9eecc5-0472-4549-9a83-2afdae0d4ba1"

#### Query

typerequiredstring

Indicates the queue type; can be INBOUND or OUTBOUND.

example = "INBOUND", enum = \["INBOUND", "OUTBOUND"\]

pageinteger

Defines the number of displayed page. The page number starts from 0.

default = 0

pageSizeinteger

Defines the number of items to be displayed on a page. If the number specified is more than allowed max page size, the API will automatically adjust the page size to the max page size.

example = 100, default = 100

## Responses

Status: 200

OK

Schema DefinitionExample Body

- -BulkExportDTOContactServiceQueueBulkExportDTO





  - pageNumber:integer


    Current page number

  - pageSize:integer


    Page size for current data set

  - totalResources:integer


    Total number of items

  - rel:string


    Indicates whether more pages exist. When 'next' there are more pages available, otherwise 'last'.

  - +resources:ContactServiceQueueBulkExportDTO\[\]

    - maxTimeInQueue:integer

    - recordingPauseDuration:integer

    - channelType:string

    - defaultMusicInQueueMediaFile:string

    - description:string

    - imiOrgType:string

    - name:string

    - queueRoutingType:string

    - routingType:string

    - serviceLevelThreshold:string

    - skillBasedRoutingType:string

    - timezone:string

    - type:string

    - manuallyAssignable:boolean

    - monitoringPermitted:boolean

    - outdialCampaignEnabled:boolean

    - parkingPermitted:boolean

    - pauseRecordingPermitted:boolean

    - recordingAllCallsPermitted:boolean

    - recordingPermitted:boolean

    - agents:string\[\]

    - +callDistributionGroups:CallDistributionGroupBulkExportDTO\[\]

      - duration:integer

      - order:integer

      - +agentGroups:AgentGroupsBulkExportDTO\[\]

        - siteName:string

        - teamName:string
    - +queueSkillRequirements:QueueSkillRequirementDTO\[\]


      Skill requirement for the queue




      - createdTime:integerreadOnly


        Creation time(in epoch millis) of this resource.

      - lastUpdatedTime:integerreadOnly


        Time(in epoch millis) when this resource was last updated.

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
    "totalResources": 100,
    "pageNumber": 0,
    "pageSize": 50,
    "rel": "last",
    "resources": [\
        {\
            "name": "string",\
            "description": "string",\
            "type": "string",\
            "channelType": "string",\
            "routingType": "string",\
            "monitoringPermitted": true,\
            "parkingPermitted": true,\
            "recordingPermitted": true,\
            "recordingAllCallsPermitted": true,\
            "pauseRecordingPermitted": true,\
            "recordingPauseDuration": 0,\
            "maxTimeInQueue": 0,\
            "defaultMusicInQueueMediaFile": "string",\
            "serviceLevelThreshold": "string",\
            "timezone": "string",\
            "imiOrgType": "string",\
            "skillBasedRoutingType": "string",\
            "outdialCampaignEnabled": true,\
            "queueRoutingType": "string",\
            "callDistributionGroups": [\
                {\
                    "agentGroups": [\
                        {\
                            "teamName": "string",\
                            "siteName": "string"\
                        }\
                    ],\
                    "order": 0,\
                    "duration": 0\
                }\
            ],\
            "queueSkillRequirements": [\
                {\
                    "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
                    "id": "93912f11-6017-404b-bf14-5331890b1797",\
                    "version": 1,\
                    "skillId": "af9eecc5-0472-4549-9a83-2afdae0d4ba0",\
                    "skillName": "German Speaking",\
                    "skillType": "BOOLEAN",\
                    "condition": "IS_NOT",\
                    "skillValue": "Credit card SME",\
                    "createdTime": 1617536244000,\
                    "lastUpdatedTime": 1617536244000\
                }\
            ],\
            "agents": [ "string" ],\
            "manuallyAssignable": true\
        }\
    ]
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


          Unique version identifier.

        - createdDate:string


          A date for creation.

        - id:string


          id

        - lastModifiedDate:string


          A date for last modified.

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


          Unique version identifier.

        - createdDate:string


          A date for creation.

        - id:string


          id

        - lastModifiedDate:string


          A date for last modified.

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


          Unique version identifier.

        - createdDate:string


          A date for creation.

        - id:string


          id

        - lastModifiedDate:string


          A date for last modified.

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


          Unique version identifier.

        - createdDate:string


          A date for creation.

        - id:string


          id

        - lastModifiedDate:string


          A date for last modified.

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


          Unique version identifier.

        - createdDate:string


          A date for creation.

        - id:string


          id

        - lastModifiedDate:string


          A date for last modified.

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

GET/organization//contact-service-queue/bulk-export

orgid\*

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

### Query Params

INBOUND

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
--url https://api.wxcc-us1.cisco.com/organization//contact-service-queue/bulk-export?type= \
--header 'Authorization: Bearer ' \
--header 'Accept: */*'
```

```python
Copyimport requests

url = "https://api.wxcc-us1.cisco.com/organization//contact-service-queue/bulk-export?type="

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
    url: 'https://api.wxcc-us1.cisco.com/organization//contact-service-queue/bulk-export?type=',
    headers,
    body,
};

request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
```