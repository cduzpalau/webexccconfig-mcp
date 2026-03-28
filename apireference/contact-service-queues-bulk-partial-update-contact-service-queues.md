[Home](https://developer.webex.com/)/[Contact Service Queues](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues)/Bulk partial update Contact Service Queue(s)

Webex Contact Center

Version 1

Contact Service Queue

# Bulk partial update Contact Service Queue(s)

**Operation Id:** patchAllConfig\_1

**Description:**

Update some or all properties for multiple Contact Service Queue(s) in bulk in a given organization.

PATCH/organization/ **{orgid}**/contact-service-queue/bulk

## Request Parameters

#### Path

orgidrequiredstring

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

example = "2f9eecc5-0472-4549-9a83-2afdae0d4ba1"

#### Request body

For each of the item to update,

We only need to provide the patch JSON.

Only the following properties are mandatory to identify unique item for update. Other properties are optional.

Mandatory Properties: \[id\]

All properties that can be updated via PUT Api are allowed to be updated.

To nullify a property or remove it, specify null as value for the Json property.

Valid value for requestAction property is 'SAVE'. It is optional property and default SAVE is assumed.

Schema DefinitionExample Body

- -BulkRequestDTOContactServiceQueueDTO


Unique item identifier for a bulk operation.








  - +items:BulkRequestItemDTOContactServiceQueueDTO\[\]

    - itemIdentifier:integer


      Unique item identifier for a bulk operation.

    - requestAction:string


      Identifier for action type. Possible values can be SAVE and DELETE.

    - +item:ContactServiceQueueDTO

      - agentsLastUpdatedTime:integer


        The date when the agents list was last modified.

      - maxActiveContacts\*:integer


        The maximum number of simultaneous contacts allowed for this queue. It does not support Social Channel Type.

      - maxTimeInQueue\*:integer


        The time in seconds after which the system distributes the queued customer request to the overflow number that you provision for this queue.

      - recordingPauseDuration:integer


        The duration in seconds of pause in recording.

        This setting is available only for the Telephony channel type.

      - serviceLevelThreshold\*:integer


        The time in seconds that a customer request can be in a queue before the system flags it as outside the service level. It does not support Social Channel Type.

      - version:integer


        The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

      - agentsLastUpdatedByUserEmailPrefix:string


        The email of the user who last modified the agents list.

      - agentsLastUpdatedByUserName:string


        The name of the user who last modified the agents list.

      - channelType\*:string


        Setting to indicate the channel type. Use uppercase. Supported channel types are:



        TELEPHONY, EMAIL, SOCIAL\_CHANNEL, and CHAT.



        For TELEPHONY channelType, the following fields are mandatory - recordingPermitted, ivrRequeueUrl, recordingAllCallsPermitted, monitoringPermitted, parkingPermitted, pauseRecordingPermitted, controlFlowScriptUrl, defaultMusicInQueueMediaFileId.



        An OUTBOUND queue type can be created with only a TELEPHONY channel type.

        Once created, channelType cannot be modified. Valid values are 'TELEPHONY', 'EMAIL', 'FAX', 'CHAT', 'VIDEO', 'OTHERS', 'SOCIAL\_CHANNEL'

        enum = \["TELEPHONY", "EMAIL", "FAX", "CHAT", "VIDEO", ...\]

      - controlFlowScriptUrl\*:string


        The URL for the queue or the default control script of the queue. If you do not use the routing strategy module to configure the control script, the system automatically populates the URL.

        This setting is available only for the Telephony channel type.

      - defaultMusicInQueueMediaFileId\*:string


        Identifies the default audio file which will be played for calls when they arrive or are waiting in queue.

        This setting is available only for the Telephony channel type.

      - description:string


        (Optional) A short description of the queue.

      - id:string


        ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

      - ivrRequeueUrl\*:string


        This setting is available only for the Telephony channel type.

      - name\*:string


        Name of the Contact Service Queue

      - organizationId:string


        ID of the contact center organization. It is required to define for the following operations - All bulk save operations

      - overflowNumber:string


        The destination phone number to which the system distributes the customer calls when they exceed the Maximum Time in Queue that you have set in the routing strategy.

        This setting is applicable only for the Telephony channel type and it is optional.

      - queueRoutingType\*:string


        This can be the following



        TEAM\_BASED



        QUEUE\_BASED. Valid values are 'TEAM\_BASED', 'SKILL\_BASED', 'AGENT\_BASED'

        enum = \["TEAM\_BASED", "SKILL\_BASED", "AGENT\_BASED"\]

      - queueType\*:string


        This can be the following



        INBOUND



        OUTBOUND

        enum = \["INBOUND", "OUTBOUND"\]

      - routingType\*:string


        This can be one of the following



        LONGEST\_AVAILABLE\_AGENT



        SKILLS\_BASED(skillBasedRoutingType is mandatory to define). Valid values are 'LONGEST\_AVAILABLE\_AGENT', 'SKILLS\_BASED', 'CIRCULAR', 'LINEAR'

        enum = \["LONGEST\_AVAILABLE\_AGENT", "SKILLS\_BASED", "CIRCULAR", "LINEAR"\]

      - skillBasedRoutingType:string


        This can be the following



        LONGEST\_AVAILABLE\_AGENT



        BEST\_AVAILABLE\_AGENT

        enum = \["LONGEST\_AVAILABLE\_AGENT", "BEST\_AVAILABLE\_AGENT"\]

      - socialChannelType:string


        This can be the following



        MESSAGEBIRD



        MESSENGER. Valid values are 'MESSAGEBIRD', 'MESSENGER', 'WHATSAPP', 'APPLE\_BUSINESS\_CHAT', 'GOOGLE\_BUSINESS\_MESSAGES'

        enum = \["MESSAGEBIRD", "MESSENGER", "WHATSAPP", "APPLE\_BUSINESS\_CHAT", "GOOGLE\_BUSINESS\_MESSAGES"\]

      - subscriptionId:string


        (Optional) Used to subscribe for recording events.

      - timezone:string


        (Optional) Any routing strategy for this queue uses the time zone that you select here.

      - vendorId:string


        The unique alphanumeric string that maps this queue to the vendor.

        This setting is available only for the Telephony channel type and it is optional.

      - xspVersion:string


        (Optional) Used to subscribe for recording events.

      - active\*:boolean


        Specify whether the queue is active or not active

      - checkAgentAvailability\*:boolean


        This setting specifies whether the system can exclude teams with no logged in agents for the relevant routing strategies. It does not support Social Channel Type.

      - manuallyAssignable:boolean


        Indicates whether the queue can be manually assigned or not

      - monitoringPermitted\*:boolean


        Indicates whether or not monitoring is permitted.

        This setting is available only for the Telephony channel type.

      - outdialCampaignEnabled:boolean


        Should be specified only for outdial queues; if enabled, then Call Distribution and Queue Routing Type can be specified.

      - parkingPermitted\*:boolean


        Indicates whether or not parking is permitted.

        This setting is available only for the Telephony channel type.

      - pauseRecordingPermitted\*:boolean


        Indicates whether or not pausing the recording is permitted.

        This setting is available only for the Telephony channel type.

      - recordingAllCallsPermitted\*:boolean


        Indicates whether or not recording all calls is permitted.

        This setting is available only for the Telephony channel type.

      - recordingPermitted\*:boolean


        Indicates whether or not recording is permitted.

        This setting is available only for the Telephony channel type.

      - systemDefault:boolean


        Indicates whether the created resource is system created or not

      - +assistantSkill:AssistantSkillMappingDTO

        - assistantSkillId:string


          Id of an Assistant Skill mapped to the Contact Service Queue
      - +agents:QueueAgentsDTO\[\]


        The list of agents for AgentBased queue




        - ciUserId:string


          Id of an agent in Common Identity

        - id\*:string


          Id of an agent in WxCC
      - +callDistributionGroups\*:CallDistributionGroupDTO\[\]


        Add a Call Distribution Group to associate one or more teams with this queue.

        Add multiple groups to distribute calls to more teams as time in queue progresses.

        Note that call distribution acts independently from other queue login defined in routing flows.




        - duration:integer


          (Optional)The duration in seconds after which a contact in queue will be distributed to this group.

          default = 0

        - order\*:integer


          The order of this call distribution group.

        - +agentGroups\*:AgentGroupDTO\[\]


          Indicates the agent groups who are part of this call distribution group.




          - teamId\*:string


            ID of a team
      - +queueSkillRequirements:QueueSkillRequirementDTO\[\]


        This can be the Queue with skill




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
    "items": [\
        {\
            "itemIdentifier": 10,\
            "item": {\
                "organizationId": "f53c8b54-34ca-43f6-ba05-08426a46e23d",\
                "id": "93912f11-4417-404b-bf14-5331890b1797",\
                "version": 1,\
                "name": "Queue-1",\
                "description": "Queue created by system",\
                "queueType": "INBOUND",\
                "checkAgentAvailability": true,\
                "channelType": "TELEPHONY",\
                "socialChannelType": "MESSENGER",\
                "serviceLevelThreshold": 0,\
                "maxActiveContacts": 5,\
                "maxTimeInQueue": 2,\
                "defaultMusicInQueueMediaFileId": "defaultmusic_on_hold.wav",\
                "timezone": "America/New_York",\
                "active": true,\
                "outdialCampaignEnabled": true,\
                "monitoringPermitted": true,\
                "parkingPermitted": true,\
                "recordingPermitted": true,\
                "recordingAllCallsPermitted": true,\
                "pauseRecordingPermitted": true,\
                "recordingPauseDuration": 2,\
                "controlFlowScriptUrl": "https://flow-control.produs1.ciscoccservice.com/31f1c57f-4fa1-12bd-b5c5-6feb6abea062/royal-enfield",\
                "ivrRequeueUrl": "https://www.youtube.com",\
                "overflowNumber": "1245677",\
                "vendorId": "AC123CSDR",\
                "routingType": "SKILLS_BASED",\
                "skillBasedRoutingType": "BEST_AVAILABLE_AGENT",\
                "queueRoutingType": "TEAM_BASED",\
                "queueSkillRequirements": [\
                    {\
                        "organizationId": "f53c4c54-46ca-43f6-ba05-08426a46e23d",\
                        "id": "93912f11-60d3-404b-bf14-5331890b1797",\
                        "version": 1,\
                        "skillId": "af9edfc5-0472-4549-9a83-2afdae0d4ba0",\
                        "skillName": "German Speaking",\
                        "skillType": "BOOLEAN",\
                        "condition": "IS_NOT",\
                        "skillValue": "Credit card SME"\
                    }\
                ],\
                "agents": [\
                    {\
                        "id": "16c93b45-f1e9-4a4f-bc47-957b9075a56f",\
                        "ciUserId": "660e125a-8230-47d7-ae98-047fb180e1ff"\
                    }\
                ],\
                "callDistributionGroups": [\
                    {\
                        "agentGroups": [\
                            {\
                                "teamId": "76cf3ddc-12df-49ef-88e1-c86226d8a645"\
                            }\
                        ],\
                        "order": 1,\
                        "duration": 0\
                    }\
                ],\
                "xspVersion": "xsp-24.0",\
                "subscriptionId": "04ddedf6-6d6a-4aae-8a8a-71c9152e6478",\
                "assistantSkill": {\
                    "assistantSkillId": "af9edsc5-0472-4549-9a83-2afdae0d4ba0"\
                },\
                "systemDefault": false,\
                "manuallyAssignable": false,\
                "agentsLastUpdatedByUserName": "string",\
                "agentsLastUpdatedByUserEmailPrefix": "string",\
                "agentsLastUpdatedTime": 0\
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

PATCH/organization//contact-service-queue/bulk

orgid\*

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

Request Body (Form)Request Body (JSON)

BulkRequestDTOContactServiceQueueDTO

Unique item identifier for a bulk operation.

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
Copycurl -L --request PATCH \
--url https://api.wxcc-us1.cisco.com/organization//contact-service-queue/bulk \
--header 'Authorization: Bearer ' \
--header 'Content-Type: application/json' \
--header 'Accept: */*' \
--data '{}'
```

```python
Copyimport requests

url = "https://api.wxcc-us1.cisco.com/organization//contact-service-queue/bulk"

payload = '''{}'''

headers = {
    "Authorization": "Bearer ",
    "Content-Type": "application/json",
    "Accept": "*/*"
}

response = requests.request('PATCH', url, headers=headers, data = payload)

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
    method: 'PATCH',
    url: 'https://api.wxcc-us1.cisco.com/organization//contact-service-queue/bulk',
    headers,
    body,
};

request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
```