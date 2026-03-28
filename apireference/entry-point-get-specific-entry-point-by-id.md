[Home](https://developer.webex.com/)/[Entry Point](https://developer.webex.com/webex-contact-center/docs/api/v1/entry-point)/Get specific Entry Point by ID

Webex Contact Center

Version 1

Entry Point

# Get specific Entry Point by ID

**Operation Id:** getConfig\_15

**Description:**

Retrieve an existing Entry Point by ID in a given organization.

GET/organization/ **{orgid}/entry-point/{id}**

## Request Parameters

#### Path

orgidrequiredstring

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

example = "2f9eecc5-0472-4549-9a83-2afdae0d4ba1"

idrequiredstring

Resource ID of the Entry Point.

example = "2f9eecc5-0472-4549"

#### Query

includeNamesboolean

Specifiy whether to include flow override settings reference variable names.

default = false

## Responses

Status: 200

OK

Schema DefinitionExample Body

- -EntryPointDTO





  - createdTime:integerreadOnly


    Creation time(in epoch millis) of this resource.

  - dnEpMappingCount:integer

  - lastUpdatedTime:integerreadOnly


    Time(in epoch millis) when this resource was last updated.

  - maximumActiveContacts\*:integer


    Caps the maximum number of simultaneous calls for this entry point.



    The system busies out any additional calls when the number of active calls exceeds this number.



    It is required only for a create or an update operation.

  - serviceLevelThreshold\*:integer


    Allows to set the time that a customer request can be in a queue before the system flags it as outside the service level.



    If the agent completes a customer service request within this time interval, the system considers it within the service level.

    It is required only for a create or an update operation.

  - version:integer


    The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

  - assetId\*:string


    ID of the asset in IMI that corresponds to this entrypoint.

  - channelType\*:string


    Setting to indicate the channel type. Use uppercase. Supported channel types are:



    TELEPHONY, EMAIL, VIDEO, SOCIAL\_CHANNEL, FAX, CHAT and OTHERS. It is required only during a create or an update operation.

    enum = \["TELEPHONY", "EMAIL", "FAX", "CHAT", "VIDEO", ...\]

  - controlFlowScriptUrl\*:string


    The system automatically populates this field with the URL for this entry point or the default control script of the queue.It happens when you donâ€™t configure the control script using the Webex Contact Center Routing Strategy module.This setting is available for the Telephony channel type.

  - description:string


    A short description of the entry point.

  - entryPointType\*:string


    Setting to indicate if this entry point is meant for incoming or outgoing contacts. Use uppercase. Can be set to either `INBOUND` or `OUTBOUND`. With Outbound Type, Only Telephony channel is supported. It is required only during a create or an update operation.

    enum = \["INBOUND", "OUTBOUND"\]

  - flowId:string

  - flowTagId:string

  - id:string


    ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

  - imiOrgType\*:string


    Refers to the type of digital channels used by the org. It takes two values: IMI (if all channels used are IMI) and MIXED\_MODE (if both native and IMI channels are used).

    enum = \["MIXED\_MODE", "IMI"\]

  - musicOnHoldId:string

  - name\*:string


    A unique name for the entry point within the organization. It is required only during a create or an update operation.

  - organizationId:string


    ID of the contact center organization. It is required to define for the following operations - All bulk save operations

  - outdialQueueId:string

  - overflowNumber\*:string


    Allows to set the destination phone number to which the system diverts the customer calls when they exceed the Maximum Time in Queue



    that has been set in the routing strategy.



    This setting is applicable only for the Telephony channel type.

  - routePointId:string


    The identifier of a route point of WxC which is similar to entry point of WxCC

  - socialChannelType\*:string


    Setting to indicate the type of Social Channel.This setting is available only when channel type is SOCIAL\_CHANNEL.Use uppercase. Can be set to either `MESSAGEBIRD` or `MESSENGER`. Valid values are 'MESSAGEBIRD', 'MESSENGER', 'WHATSAPP', 'APPLE\_BUSINESS\_CHAT', 'GOOGLE\_BUSINESS\_MESSAGES'

    enum = \["MESSAGEBIRD", "MESSENGER", "WHATSAPP", "APPLE\_BUSINESS\_CHAT", "GOOGLE\_BUSINESS\_MESSAGES"\]

  - subscriptionId:string


    (Optional) Used to subscribe for recording events.

  - timezone:string


    (Optional) Any routing strategy for this entry point uses the time zone that you select here.

  - xspVersion:string


    (Optional) Used to subscribe for recording events.

  - active\*:boolean


    Used to toggle the state of the entrypoint from active to inactive and vice-versa. It is required only during a create or an update operation.

  - callbackEnabled:boolean


    Indicates whether the created resource is call back enabled or not

  - outdialTransferToQueueEnabled:boolean


    Indicates whether the resource is Default Outdial Transfer to Queue.

  - systemDefault:boolean


    Indicates whether the created resource is system created or not

  - +flowOverrideSettings:FlowOverrideSettingDTO\[\]


    Add a Flow override settings to entry-point.

    This feature enables non-flow developers and designers including Contact Center Supervisors and other Contact Center personnel to modify settings such as business hours and audio prompts within Control Hub using configurable parameters, bypassing the complexity of flow editing.

    Note that flow override settings are applicable only for telephony entry-point.




    - entityId:string

    - entityType:string

    - name\*:string

    - type\*:string

    - value:string

```json
{
    "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "id": "93912f11-6017-404b-bf14-5331890b1797",
    "version": 1,
    "name": "Telephony-Ep",
    "description": "Required for transferring out-dial calls to Queues",
    "entryPointType": "INBOUND",
    "channelType": "TELEPHONY",
    "socialChannelType": "MESSENGER",
    "active": true,
    "serviceLevelThreshold": 12,
    "maximumActiveContacts": 1,
    "controlFlowScriptUrl": "https://flow-control.produs1.ciscoccservice.com/31f1c57f-4fa1-417b-b5c5-6feb6abea062/royal-enfield",
    "overflowNumber": "1231231231",
    "timezone": "America/New_York",
    "imiOrgType": "MIXED_MODE",
    "assetId": "a_38412723414",
    "xspVersion": "xsp-24.0",
    "subscriptionId": "04d0bdf6-6d6a-4aae-8a8a-71c9152e6478",
    "routePointId": "7cbd4aad-0c3b-4de4-a15a-33cf05b9bf8j",
    "flowId": "string",
    "flowTagId": "string",
    "musicOnHoldId": "string",
    "outdialQueueId": "string",
    "systemDefault": false,
    "callbackEnabled": false,
    "outdialTransferToQueueEnabled": false,
    "dnEpMappingCount": 0,
    "flowOverrideSettings": [\
        {\
            "name": "WelcomePromt",\
            "type": "String",\
            "entityType": "audio-file",\
            "value": "greetings.wav",\
            "id": "4f8d4487-a48e-48f5-be67-b4242345d0cf"\
        }\
    ],
    "createdTime": 1617536244000,
    "lastUpdatedTime": 1617536244000
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

GET/organization//entry-point/ **{id}**

orgid\*

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

id\*

Resource ID of the Entry Point.

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
--url https://api.wxcc-us1.cisco.com/organization//entry-point/{id} \
--header 'Authorization: Bearer ' \
--header 'Accept: */*'
```

```python
Copyimport requests

url = "https://api.wxcc-us1.cisco.com/organization//entry-point/{id}"

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
    url: 'https://api.wxcc-us1.cisco.com/organization//entry-point/{id}',
    headers,
    body,
};

request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
```