Version 3

Contact Service Queue

# List Contact Service Queue(s)

**Operation Id:** getAllFilteredConfigWithMetaDataV3

**Description:**

Retrieve a list of Contact Service Queue(s) in a given organization.

Note: Array fields are removed from List API. If all fields are required please fetch Id's and use get-by-id API.

GET/organization/ **{orgid}**/v3/contact-service-queue

## Request Parameters

#### Path

orgidrequiredstring

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

example = "2f9eecc5-0472-4549-9a83-2afdae0d4ba1"

#### Query

filterstring

Specify a filter based on which the results will be fetched. All the fields are supported except: organizationId, queueSkillRequirements, xspVersion, createdTime, lastUpdatedTime

The examples below show some search queries

- id=="57efb0e6-5af0-4245-a67d-d3c5045cdb6e"
- id!="57efb0e6-5af0-4245-a67d-d3c5045cdb6e"
- id=in=("57efb0e6-5af0-4245-a67d-d3c5045cdb6e","a421e0b2-732e-46f3-a057-39160a53afb9")
- id=out=("57efb0e6-5af0-4245-a67d-d3c5045cdb6e","a421e0b2-732e-46f3-a057-39160a53afb9")

This parameter uses the RSQL query syntax, a URI-friendly format for expressing criteria for filtering REST entities. For more information about RSQL in general, see [this reference](https://www.here.com/docs/bundle/data-client-library-developer-guide-java-scala/page/client/rsql.html). For a list of supported operators, see [this syntax guide](https://github.com/perplexhub/rsql-jpa-specification#rsql-syntax-reference).

Note: values to be used in the filter syntax should not contain space, and if so kindly bound it with quotes to apply filter.

example = "id=="2f9eecc5-0472-4549-9a83-2afdae0d4ba1""

attributesstring

Specify the attributes to be returned.Default all attributes are returned along with specified columns. All Attributes are supported except (callDistributionGroups,queueSkillRequirements,links)

example = "id"

searchstring

Filter data based on the search keyword.Supported search columns(name, description)

The examples below show some search queries

- "Cisco"
- field=="name";value=="Cisco"
- fields=in=("name","description");value=="Cisco"

example = "contact center"

pageinteger

Defines the number of displayed page. The page number starts from 0.

default = 0

pageSizeinteger

Defines the number of items to be displayed on a page. If the number specified is more than allowed max page size, the API will automatically adjust the page size to the max page size.

example = 100, default = 100

desktopProfileFilterboolean

If set to true, the API will return only the data that the user has access to according to its Desktop Profile. If set to false, the API will not check for Desktop Profile level access.

default = false

provisioningViewboolean

If set to true, the API will only return data that user has access to, according to User Profile. If set to false and desktopProfileFilter query parameter is not specified, the API will add user associated data, based on desktop.

default = false

singleObjectResponseboolean

Specifiy whether to include array fields in the response, This query param should use only if the response contain single record, if we are using for multiple objects response query param not supported and throws an exception.

default = false

## Responses

Status: 200

OK

Schema DefinitionExample Body

- -ResponseEnvelopeContactServiceQueueDTO





  - meta:object

  - +data:ContactServiceQueueDTO\[\]

    - agentsLastUpdatedTime:integer


      The date when the agents list was last modified.

    - createdTime:integerreadOnly


      Creation time(in epoch millis) of this resource.

    - lastUpdatedTime:integerreadOnly


      Time(in epoch millis) when this resource was last updated.

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

      Once created, channelType cannot be modified.

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



      QUEUE\_BASED

      enum = \["TEAM\_BASED", "SKILL\_BASED", "AGENT\_BASED"\]

    - queueType\*:string


      This can be the following



      INBOUND



      OUTBOUND

      enum = \["INBOUND", "OUTBOUND"\]

    - routingType\*:string


      This can be one of the following



      LONGEST\_AVAILABLE\_AGENT



      SKILLS\_BASED(skillBasedRoutingType is mandatory to define)

      enum = \["LONGEST\_AVAILABLE\_AGENT", "SKILLS\_BASED", "CIRCULAR", "LINEAR"\]

    - skillBasedRoutingType:string


      This can be the following



      LONGEST\_AVAILABLE\_AGENT



      BEST\_AVAILABLE\_AGENT

      enum = \["LONGEST\_AVAILABLE\_AGENT", "BEST\_AVAILABLE\_AGENT"\]

    - socialChannelType:string


      This can be the following



      MESSAGEBIRD



      MESSENGER

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

      - assistantSkillUpdatedTime:integerreadOnly


        Time(in epoch millis) when assistant skill mapping was last updated.

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
    "meta": {},
    "data": [\
        {\
            "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
            "id": "93912f11-6017-404b-bf14-5331890b1797",\
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
            "controlFlowScriptUrl": "https://flow-control.produs1.ciscoccservice.com/31f1c57f-4fa1-417b-b5c5-6feb6abea062/royal-enfield",\
            "ivrRequeueUrl": "https://www.youtube.com",\
            "overflowNumber": "1245677",\
            "vendorId": "AB123CSDR",\
            "routingType": "SKILLS_BASED",\
            "skillBasedRoutingType": "BEST_AVAILABLE_AGENT",\
            "queueRoutingType": "TEAM_BASED",\
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
            "agents": [\
                {\
                    "id": "16c93b13-f1e9-4a4f-bc47-957b9075a56f",\
                    "ciUserId": "660e0a5a-8230-47d7-ae98-047fb180e1ff"\
                }\
            ],\
            "callDistributionGroups": [\
                {\
                    "agentGroups": [\
                        {\
                            "teamId": "76cf35bc-12df-49ef-88e1-c86226d8a645"\
                        }\
                    ],\
                    "order": 1,\
                    "duration": 0\
                }\
            ],\
            "xspVersion": "xsp-24.0",\
            "subscriptionId": "04d0bdf6-6d6a-4aae-8a8a-71c9152e6478",\
            "assistantSkill": {\
                "assistantSkillId": "af9eecc5-0472-4549-9a83-2afdae0d4ba0",\
                "assistantSkillUpdatedTime": 1617536244000\
            },\
            "systemDefault": false,\
            "manuallyAssignable": false,\
            "agentsLastUpdatedByUserName": "string",\
            "agentsLastUpdatedByUserEmailPrefix": "string",\
            "agentsLastUpdatedTime": 0,\
            "createdTime": 1617536244000,\
            "lastUpdatedTime": 1617536244000\
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