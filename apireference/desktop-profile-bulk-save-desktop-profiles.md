[Home](https://developer.webex.com/)/[Desktop Profile](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-profile)/Bulk save Desktop Profile(s)

Webex Contact Center

Version 1

Desktop Profile

# Bulk save Desktop Profile(s)

**Operation Id:** saveAllConfig\_24

**Description:**

Create, Update or delete Desktop Profile(s) in bulk in a given organization.

POST/organization/ **{orgid}**/agent-profile/bulk

## Request Parameters

#### Path

orgidrequiredstring

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

example = "2f9eecc5-0472-4549-9a83-2afdae0d4ba1"

#### Request body

Schema DefinitionExample Body

- -BulkRequestDTOAgentProfileDTO





  - +items:BulkRequestItemDTOAgentProfileDTO\[\]

    - itemIdentifier:integer


      Unique item identifier for a bulk operation.

    - requestAction:string


      Identifier for action type. Possible values can be SAVE and DELETE.

    - +item:AgentProfileDTO

      - autoWrapAfterSeconds:integer


        This setting allows auto wrap-up after seconds

      - timeoutDesktopInactivityMins:integer


        This setting occurs only if you enabled time out desktop inactivity feature. Specify time in minute(s).

      - version:integer


        The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

      - accessBuddyTeam\*:string


        Specify the teams that the agents can select from the Agent drop-down list on the Agent Desktop. It can take one of these values:



        ALL — To make the agents on all teams available.



        SPECIFIC — To make agents on specific teams available, then select teams from the drop-down list



        NONE — If you do not want to make any teams available for consultation, conference, or call transfer.



        . Valid values are 'SPECIFIC', 'ALL', 'PROVISIONED\_VALUE', 'NONE'

        enum = \["SPECIFIC", "ALL", "PROVISIONED\_VALUE", "NONE"\]

      - accessEntryPoint\*:string


        Specify the entry points that the agents can select from the Entry Point drop-down list on the Agent Desktop.It can take one of these values:



        ALL — To make all entry points available.



        SPECIFIC — To make specific entry points available



        NONE — If you do not want to make any entry points available as transfer targets.



        . Valid values are 'SPECIFIC', 'ALL', 'PROVISIONED\_VALUE', 'NONE'

        enum = \["SPECIFIC", "ALL", "PROVISIONED\_VALUE", "NONE"\]

      - accessIdleCode\*:string


        Specify the Idle codes that the agents can select in Agent Desktop.It can take one of these values:



        ALL — To make all idle codes available.



        SPECIFIC — To make specific codes available.



        . Valid values are 'SPECIFIC', 'ALL', 'PROVISIONED\_VALUE', 'NONE'

        enum = \["SPECIFIC", "ALL", "PROVISIONED\_VALUE", "NONE"\]

      - accessQueue\*:string


        Specify the queues that the agents can select from the Queue drop-down list on the Agent Desktop.It can take one of these values:



        ALL — To make all queues available.



        SPECIFIC — To make specific queues available



        NONE — If you do not want to make any queues available as transfer targets.



        . Valid values are 'SPECIFIC', 'ALL', 'PROVISIONED\_VALUE', 'NONE'

        enum = \["SPECIFIC", "ALL", "PROVISIONED\_VALUE", "NONE"\]

      - accessWrapUpCode\*:string


        Specify the wrap-up codes that the agents can select when they wrap up a contact.It can take one of these values:



        ALL — To make all wrap-up codes available.



        SPECIFIC — To make specific codes available.



        . Valid values are 'SPECIFIC', 'ALL', 'PROVISIONED\_VALUE', 'NONE'

        enum = \["SPECIFIC", "ALL", "PROVISIONED\_VALUE", "NONE"\]

      - addressBookId:string


        Specify the address book id that includes the speed-dial numbers that the agent can select to make outdial and consult calls.

      - agentDNValidation\*:string


        Specify Unrestricted to allow agents to use any DN to log in to the Agent Desktop.

        To restrict the DN that the agent can enter, select one of the following.

        Provisioned Value restricts the login DN to the default value that you provision for the agent.

        Validation Criteria restricts the login DN to the format specified in the Validation Criteria setting.

        . Valid values are 'SPECIFIC', 'ALL', 'PROVISIONED\_VALUE', 'NONE'

        enum = \["SPECIFIC", "ALL", "PROVISIONED\_VALUE", "NONE"\]

      - agentDNValidationCriteria:string


        This setting occurs only if you select Validation Criteria in the Validation For Agent DN. Valid values are 'SPECIFIC', 'ALL', 'PROVISIONED\_VALUE', 'NONE'

        enum = \["SPECIFIC", "ALL", "PROVISIONED\_VALUE", "NONE"\]

      - description:string


        (Optional) Enter a description of the profile.

      - id:string


        ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

      - name\*:string


        Enter a name for the agent profile.

      - organizationId:string


        ID of the contact center organization. It is required to define for the following operations - All bulk save operations

      - outdialANIId:string


        This setting occurs only if you enabled Outdial. Specify the Outdial ANI id that the agent can use to make outdial calls.

      - outdialEntryPointId:string


        If you enabled Outdial, specify the entry point id that the agent can use to make outdial calls.

      - parentType\*:string


        This can be the following



        ORGANIZATION: The agent profile is available to all sites at your enterprise.



        SITE: The agent profile is available to a specific site.

        enum = \["ORGANIZATION", "SITE"\]

      - siteId:string


        Identifier for a site which is a physical contact center location under the control of your enterprise.

      - active\*:boolean


        Specify whether the agent profile is active or not Active.

      - agentAvailableAfterOutdial:boolean


        Enabled if you want the agent to go into the Available state after completing and wrapping up an outdial call. The agent can also manually select an Idle state from the STATUS NOW drop-down list before selecting a wrap-up code.

      - allowAutoWrapUpExtension:boolean


        Indicates whether to allow auto wrap-up extension(true) or not(false).

      - autoAnswer:boolean


        Indicates whether incoming calls on the Agent Desktop need to be answered automatically(true) or not(false).

      - autoWrapUp:boolean


        Indicates whether to allow auto wrap-up(true) or not(false).

      - consultToQueue:boolean


        Indicates whether you want the agent to be able to select a queue in the Queue drop-down list as a target for a consultation or not.

      - dialPlanEnabled:boolean


        Indicates whether you want the agent to be able to make ad-hoc outdial calls(true) or not(false).

      - lastAgentRouting:boolean


        This setting use only if your administrator enables the Last Agent Routing feature for your enterprise. Indicates whether to allow Last Agent Routing check box on the Agent Desktop during wrap-up(true) or not(false).

      - outdialEnabled:boolean


        Indicates whether you want the agent to be able to make outdial calls(true) or not(false).

      - screenPopup:boolean


        Indicates whether to allow external pop-up screens(true) or not(false).

      - showUserDetailsMS:boolean


        Specify whether the show user details of microsoft account user enabled or not

      - showUserDetailsWebex:boolean


        Specify whether the show user details of webex account user enabled or not

      - stateSynchronizationMS:boolean


        Specify whether the state synchronization of microsoft account user enabled or not

      - stateSynchronizationWebex:boolean


        Specify whether the state synchronization of webex account user enabled or not

      - systemDefault:boolean


        Indicates whether the created resource is system created or not

      - timeoutDesktopInactivityCustomEnabled:boolean


        This setting enabled time out desktop inactivity feature.

      - agentDNValidationCriterions:string\[\]


        This setting specify the list that occurs only if you select Validation Criteria in the Validation For Agent DN.

      - buddyTeams:string\[\]


        Specify the teams list that the agents can select from the Agent drop-down list on the Agent Desktop.

      - dialPlans:string\[\]


        This setting appears only if Dial Plan is enabled. select the dial plans that determine the inputs that the system accepts in the Start a new call field.

      - entryPoints:string\[\]


        Specify the entry points list that the agents can select from the Entry Point drop-down list on the Agent Desktop.

      - idleCodes:string\[\]


        Specify the Idle codes list that the agents can select in Agent Desktop.

      - loginVoiceOptions:string\[\]


        Login voice options.

        enum = \["AGENT\_DN", "EXTENSION", "BROWSER"\]

      - queues:string\[\]


        Specify the queues list that the agents can select from the Queue drop-down list on the Agent Desktop.

      - thresholdRules:string\[\]


        The Agent Thresholds page appears only if your enterprise uses the Threshold Alerts feature.

        If your enterprise uses the Agent Threshold Alerts feature, the page also provides settings to specify the thresholds associated with the agent.

      - wrapUpCodes:string\[\]


        Specify the wrap-up codes list that the agents can select when they wrap up a contact.

      - +viewableStatistics\*:ViewableStatisticsDTO


        Specifies the Statistics that agent of this profile can view.





        - version:integer


          The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

        - accessQueueStats\*:string


          This setting controls whether the agent can view statistics for all or some queues in the Agent Personal Statistics tab.It can take one of these values:



          ALL — To enable the agent to display statistics for all queues.



          SPECIFIC — Select Queues drop-down list to enable the agent to display statistics for specific queues.



          NONE — To prevent the agent from displaying queue statistics.



          . Valid values are 'SPECIFIC', 'ALL', 'PROVISIONED\_VALUE', 'NONE'

          enum = \["SPECIFIC", "ALL", "PROVISIONED\_VALUE", "NONE"\]

        - accessTeamStats\*:string


          This setting controls whether the agent can view statistics for all or some teams in the Agent Personal Statistics tab.It can take one of these values:



          ALL — To enable the agent to display statistics for all teams.



          SPECIFIC — Select Teams drop-down list to enable the agent to display statistics for specific teams.



          NONE — To prevent the agent from displaying teams statistics.



          . Valid values are 'SPECIFIC', 'ALL', 'PROVISIONED\_VALUE', 'NONE'

          enum = \["SPECIFIC", "ALL", "PROVISIONED\_VALUE", "NONE"\]

        - id:string


          ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

        - organizationId:string


          ID of the contact center organization. It is required to define for the following operations - All bulk save operations

        - agentStats:boolean


          Indicates whether you want the agents to view their personal statistics in Agent Desktop or not.

        - loggedInTeamStats:boolean


          Indicates whether the agent can view statistics for the team or not.

        - contactServiceQueues:string\[\]


          This setting should be specified when Access Queue Statistics is SPECIFIC.

        - teams:string\[\]


          This setting should be specified when Access Team Statistics is SPECIFIC.

```json
{
    "items": [\
        {\
            "itemIdentifier": 10,\
            "item": {\
                "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
                "id": "93912f11-6017-404b-bf14-5331890b1797",\
                "version": 1,\
                "name": "Agent-Profile(Auto WrapUp)",\
                "description": "This profile allows agent to auto wrap-up time and extend the wrap-up time.",\
                "parentType": "SITE",\
                "siteId": "8e6bb6da-2a78-4768-bef9-7e229f92af22",\
                "screenPopup": true,\
                "lastAgentRouting": true,\
                "autoWrapUp": true,\
                "autoAnswer": true,\
                "autoWrapAfterSeconds": 15,\
                "agentAvailableAfterOutdial": true,\
                "allowAutoWrapUpExtension": true,\
                "accessWrapUpCode": "ALL",\
                "wrapUpCodes": [\
                    "WrapUp_Sale",\
                    "WrapUp_Field"\
                ],\
                "accessIdleCode": "ALL",\
                "idleCodes": [\
                    "aux_code_sale",\
                    "aux_code2"\
                ],\
                "accessQueue": "ALL",\
                "queues": [\
                    "apim_queue_516789",\
                    "apim_queue_6123456"\
                ],\
                "accessEntryPoint": "ALL",\
                "entryPoints": [\
                    "apim_entry_516789",\
                    "apim_entry_6123456"\
                ],\
                "accessBuddyTeam": "ALL",\
                "buddyTeams": [\
                    "5_Jan_Testing",\
                    "7_Feb_Testing"\
                ],\
                "consultToQueue": true,\
                "outdialEnabled": true,\
                "outdialEntryPointId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
                "outdialANIId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
                "addressBookId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
                "dialPlanEnabled": true,\
                "dialPlans": [\
                    "US",\
                    "Any Format"\
                ],\
                "agentDNValidation": "SPECIFIC",\
                "agentDNValidationCriteria": "SPECIFIC",\
                "agentDNValidationCriterions": [\
                    "DN_5_Sept",\
                    "DN_7_Jan"\
                ],\
                "loginVoiceOptions": [\
                    "AGENT_DN",\
                    "EXTENSION",\
                    "BROWSER"\
                ],\
                "viewableStatistics": {\
                    "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
                    "id": "93912f11-6017-404b-bf14-5331890b1797",\
                    "version": 1,\
                    "agentStats": true,\
                    "accessQueueStats": "SPECIFIC",\
                    "contactServiceQueues": [\
                        "apim_queue_516789",\
                        "apim_queue_6123456"\
                    ],\
                    "loggedInTeamStats": true,\
                    "accessTeamStats": "SPECIFIC",\
                    "teams": [\
                        "apim_team_516789",\
                        "apim_team_6123456"\
                    ]\
                },\
                "thresholdRules": [\
                    "Threshold_monitor_agent",\
                    "Threshold_call_data"\
                ],\
                "active": true,\
                "timeoutDesktopInactivityCustomEnabled": true,\
                "showUserDetailsMS": true,\
                "stateSynchronizationMS": true,\
                "showUserDetailsWebex": true,\
                "stateSynchronizationWebex": true,\
                "timeoutDesktopInactivityMins": 5,\
                "systemDefault": false\
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

POST/organization//agent-profile/bulk

orgid\*

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

Request Body (Form)Request Body (JSON)

BulkRequestDTOAgentProfileDTO

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
Copycurl -L --request POST \
--url https://api.wxcc-us1.cisco.com/organization//agent-profile/bulk \
--header 'Authorization: Bearer ' \
--header 'Content-Type: application/json' \
--header 'Accept: */*' \
--data '{}'
```

```python
Copyimport requests

url = "https://api.wxcc-us1.cisco.com/organization//agent-profile/bulk"

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
    url: 'https://api.wxcc-us1.cisco.com/organization//agent-profile/bulk',
    headers,
    body,
};

request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
```