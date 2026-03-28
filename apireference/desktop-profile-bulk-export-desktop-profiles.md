[Home](https://developer.webex.com/)/[Desktop Profile](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-profile)/Bulk export Desktop Profile(s)

Webex Contact Center

Version 1

Desktop Profile

# Bulk export Desktop Profile(s)

**Operation Id:** bulkExport\_21

**Description:**

Export all Desktop Profile(s) in a given organization.

GET/organization/ **{orgid}**/agent-profile/bulk-export

## Request Parameters

#### Path

orgidrequiredstring

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

example = "2f9eecc5-0472-4549-9a83-2afdae0d4ba1"

#### Query

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

- -BulkExportDTOAgentProfileBulkExportDTO





  - pageNumber:integer


    Current page number

  - pageSize:integer


    Page size for current data set

  - totalResources:integer


    Total number of items

  - rel:string


    Indicates whether more pages exist. When 'next' there are more pages available, otherwise 'last'.

  - +resources:AgentProfileBulkExportDTO\[\]

    - autoWrapAfterSeconds:integer


      This setting allows auto wrap-up after seconds

    - accessBuddyTeam\*:string


      Specify the teams that the agents can select from the Agent drop-down list on the Agent Desktop. It can take one of these values:



      ALL — To make the agents on all teams available.



      SPECIFIC — To make agents on specific teams available, then select teams from the drop-down list



      NONE — If you do not want to make any teams available for consultation, conference, or call transfer.

    - accessEntryPoint\*:string


      Specify the entry points that the agents can select from the Entry Point drop-down list on the Agent Desktop.It can take one of these values:



      ALL — To make all entry points available.



      SPECIFIC — To make specific entry points available



      NONE — If you do not want to make any entry points available as transfer targets.

    - accessIdleCode\*:string


      Specify the Idle codes that the agents can select in Agent Desktop.It can take one of these values:



      ALL — To make all idle codes available.



      SPECIFIC — To make specific codes available.

    - accessQueue\*:string


      Specify the queues that the agents can select from the Queue drop-down list on the Agent Desktop.It can take one of these values:



      ALL — To make all queues available.



      SPECIFIC — To make specific queues available



      NONE — If you do not want to make any queues available as transfer targets.

    - accessQueueStats\*:string


      This setting controls whether the agent can view statistics for all or some queues in the Agent Personal Statistics tab.It can take one of these values:



      ALL — To enable the agent to display statistics for all queues.



      SPECIFIC — Select Queues drop-down list to enable the agent to display statistics for specific queues.



      NONE — To prevent the agent from displaying queue statistics.

    - accessTeamStats\*:string


      This setting controls whether the agent can view statistics for all or some teams in the Agent Personal Statistics tab.It can take one of these values:



      ALL — To enable the agent to display statistics for all teams.



      SPECIFIC — Select Teams drop-down list to enable the agent to display statistics for specific teams.



      NONE — To prevent the agent from displaying teams statistics.

    - accessWrapUpCode\*:string


      Specify the wrap-up codes that the agents can select when they wrap up a contact.It can take one of these values:



      ALL — To make all wrap-up codes available.



      SPECIFIC — To make specific codes available.



      enum = \["ALL", "SPECIFIC"\]

    - addressBook:string


      Specify the address book id that includes the speed-dial numbers that the agent can select to make outdial and consult calls.

    - agentDNValidation\*:string


      Specify Unrestricted to allow agents to use any DN to log in to the Agent Desktop.

      To restrict the DN that the agent can enter, select one of the following.

      Provisioned Value restricts the login DN to the default value that you provision for the agent.

      Validation Criteria restricts the login DN to the format specified in the Validation Criteria setting.

    - agentDNValidationCriteria:string


      This setting occurs only if you select Validation Criteria in the Validation For Agent DN.

    - description:string


      (Optional) Enter a description of the profile.

    - name\*:string


      Enter a name for the agent profile.

    - outdialANI:string


      This setting occurs only if you enabled Outdial. Specify the Outdial ANI id that the agent can use to make outdial calls.

    - outdialEntryPoint:string


      If you enabled Outdial, specify the entry point id that the agent can use to make outdial calls.

    - parentType\*:string


      This can be the following



      ORGANIZATION: The agent profile is available to all sites at your enterprise.



      SITE: The agent profile is available to a specific site.

    - siteId:string


      Identifier for a site which is a physical contact center location under the control of your enterprise.

    - agentAvailableAfterOutdial:boolean


      Enabled if you want the agent to go into the Available state after completing and wrapping up an outdial call. The agent can also manually select an Idle state from the STATUS NOW drop-down list before selecting a wrap-up code.

    - agentStats:boolean


      Indicates whether you want the agents to view their personal statistics in Agent Desktop or not.

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

    - loggedInTeamStats:boolean


      Indicates whether the agent can view statistics for the team or not.

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

    - agentDNValidationCriterions:string\[\]


      This setting specify the list that occurs only if you select Validation Criteria in the Validation For Agent DN.

    - dialPlans:string\[\]


      This setting appears only if Dial Plan is enabled. select the dial plans that determine the inputs that the system accepts in the Start a new call field.

    - entryPoints:string\[\]


      Specify the entry points list that the agents can select from the Entry Point drop-down list on the Agent Desktop.

    - idleCodes:string\[\]


      Specify the Idle codes list that the agents can select in Agent Desktop.

    - loginVoiceOptions:string\[\]


      List of Login Voice Options

      enum = \["AGENT\_DN", "EXTENSION", "BROWSER"\]

    - queues:string\[\]


      Specify the queues list that the agents can select from the Queue drop-down list on the Agent Desktop.

    - thresholdRules:string\[\]


      The Agent Thresholds page appears only if your enterprise uses the Threshold Alerts feature.

      If your enterprise uses the Agent Threshold Alerts feature, the page also provides settings to specify the thresholds associated with the agent.

    - viewableStatsQueue:string\[\]


      This setting should be specified when Access Queue Statistics is SPECIFIC.

    - wrapUpCodes:string\[\]


      Specify the wrap-up codes list that the agents can select when they wrap up a contact.

    - +buddyTeamsList:SiteTeamPairDTO\[\]

      - siteName:string


        Indicates the name of the site. Generally, it is the name of the geographical location. It is required only during a create or an update operation.

      - teamName:string


        Enter the name for the team. Generally, use names that indicate the function of the team, such as Billing or Customer Support. This field should be specified for create and update operation. Two teams in the same site in an organization cannot share the same name.
    - +viewableStatsTeam:SiteTeamPairDTO\[\]

      - siteName:string


        Indicates the name of the site. Generally, it is the name of the geographical location. It is required only during a create or an update operation.

      - teamName:string


        Enter the name for the team. Generally, use names that indicate the function of the team, such as Billing or Customer Support. This field should be specified for create and update operation. Two teams in the same site in an organization cannot share the same name.

```json
{
    "totalResources": 100,
    "pageNumber": 0,
    "pageSize": 50,
    "rel": "last",
    "resources": [\
        {\
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
            "buddyTeamsList": [\
                {\
                    "siteName": "California",\
                    "teamName": "inline-pcs-team"\
                }\
            ],\
            "consultToQueue": true,\
            "outdialEnabled": true,\
            "outdialEntryPoint": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
            "addressBook": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
            "dialPlanEnabled": true,\
            "dialPlans": [ "US", "Any Format" ],\
            "outdialANI": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
            "agentDNValidation": "SPECIFIC",\
            "agentDNValidationCriteria": "SPECIFIC",\
            "agentDNValidationCriterions": [\
                "DN_5_Sept",\
                "DN_7_Jan"\
            ],\
            "agentStats": true,\
            "accessQueueStats": "SPECIFIC",\
            "viewableStatsQueue": [\
                "apim_queue_516789",\
                "apim_queue_6123456"\
            ],\
            "loggedInTeamStats": true,\
            "accessTeamStats": "SPECIFIC",\
            "viewableStatsTeam": [\
                {\
                    "siteName": "California",\
                    "teamName": "inline-pcs-team"\
                }\
            ],\
            "thresholdRules": [\
                "Threshold_monitor_agent",\
                "Threshold_call_data"\
            ],\
            "loginVoiceOptions": [\
                "AGENT_DN",\
                "EXTENSION"\
            ],\
            "showUserDetailsMS": true,\
            "stateSynchronizationMS": true,\
            "showUserDetailsWebex": true,\
            "stateSynchronizationWebex": true\
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

Configuration

Configuration is not available on this doc

ParametersCode Snippets

GET/organization//agent-profile/bulk-export

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
--url https://api.wxcc-us1.cisco.com/organization//agent-profile/bulk-export \
--header 'Authorization: Bearer ' \
--header 'Accept: */*'
```

```python
Copyimport requests

url = "https://api.wxcc-us1.cisco.com/organization//agent-profile/bulk-export"

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
    url: 'https://api.wxcc-us1.cisco.com/organization//agent-profile/bulk-export',
    headers,
    body,
};

request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
```