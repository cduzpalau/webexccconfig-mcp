[Home](https://developer.webex.com/)/[Users](https://developer.webex.com/webex-contact-center/docs/api/v1/users)/Bulk partial update Users

Webex Contact Center

Version 1

Users

# Bulk partial update Users

**Operation Id:** patchAllConfig

**Description:**

Update some or all properties for multiple users in bulk for a given organization.

PATCH/organization/ **{orgid}**/user/bulk

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

- -BulkRequestDTOUserDTO





  - +items:BulkRequestItemDTOUserDTO\[\]

    - itemIdentifier:integer


      Unique item identifier for a bulk operation.

    - requestAction:string


      Identifier for action type. Possible values can be SAVE and DELETE.

    - +item:UserDTO

      - version:integer


        The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

      - agentProfileId\*:string


        Identifier for a Desktop Profile which is a group of permissions and Agent Desktop behaviors that you assign to specific users. This field is applicable only when contactCenterEnabled is true.

      - broadCloudUserId:string


        Broadcloud user Id. This field cannot be modified.

      - ciUserId\*:string


        Cisco Common Identity user Id. Existence of a CI user is a prerequisite to create a new WxCC user. It cannot be modified.

      - deafultDialledNumber:string


        (Optional) The dial number of the agent. This field is applicable only when contactCenterEnabled is true.

      - email\*:string


        The email address of the user. Can be changed using Users Management in Cisco Webex Control Hub.

      - externalIdentifier:string


        (Optional) Agent identification details, such as the employee number.

      - firstName\*:string


        The first name of the user. Can be changed using Users Management in Cisco Webex Control Hub.

      - id:string


        ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

      - lastName\*:string


        The last name of the user. Can be changed using Users Management in Cisco Webex Control Hub.

      - mobile:string


        The mobile phone number of the user.

      - multimediaProfileId:string


        (Optional) If your organization administrator enables Multimedia for your enterprise, you can select a multimedia profile for this team. This field is applicable only when contactCenterEnabled is true.

      - organizationId:string


        ID of the contact center organization. It is required to define for the following operations - All bulk save operations

      - preferredSupervisorTeamId:string


        (Optional) Indicates the id of a preferred supervisor.

      - siteId\*:string


        (Optional) Identifier for a site which is a physical contact center location under the control of your enterprise. This field is applicable only when contactCenterEnabled is true.

      - skillProfileId:string


        (Optional) If your enterprise uses the optional Skills-Based Routing feature, This profile overrides any skill profile at the team level that is associated with the agent.This field is applicable only when contactCenterEnabled is true.

      - subscriptionId:string


        (Optional) Used to subscribe for recording events. This field cannot be modified.

      - timezone:string


        (Optional) The time zone that you provision for your enterprise.

      - userLevelAutoCSATInclusion:string


        User level AutoCSAT inclusion type. Used only when Agent inclusion is set to 'Specific Agents' at the org level Cisco AI Assistant>Auto CSAT config.

        During entity creation(single or bulk), if this parameter is not provided or null, default will be set to 'EXCLUDED'

        During entity update(single or bulk), if this parameter is not provided or null, the previous value will be retained. Valid values are 'INCLUDED', 'EXCLUDED'

        enum = \["INCLUDED", "EXCLUDED"\]

      - userLevelBurnoutInclusion:string


        User level burnout inclusion type. Used only when Agent inclusion is set to 'Specific Agents' at the org level Agent Wellbeing>Burnout config.

        During entity creation(single or bulk), if this parameter is not provided or null, default will be set to 'EXCLUDED'

        During entity update(single or bulk), if this parameter is not provided or null, the previous value will be retained. Valid values are 'INCLUDED', 'EXCLUDED'

        enum = \["INCLUDED", "EXCLUDED"\]

      - userLevelSummariesInclusion:string


        User level Generated Summaries inclusion type. Used only when Generated Summaries is set to 'Specific Agents' at the org level Cisco AI Assistant>Generated Summaries.

        During entity creation(single or bulk), if this parameter is not provided or null, default will be set to 'EXCLUDED'

        During entity update(single or bulk), if this parameter is not provided or null, the previous value will be retained. Valid values are 'INCLUDED', 'EXCLUDED'

        enum = \["INCLUDED", "EXCLUDED"\]

      - userLevelWellnessBreakReminders:string


        User level Wellness break reminder type. If top level Agent burnout config has wellness break reminders enabled, this property determines if an Agent is enabled/disabled for receiving break reminders.

        . Valid values are 'DISABLED', 'ENABLED'

        enum = \["DISABLED", "ENABLED"\]

      - userProfileId\*:string


        Identifier for an user profile which a Contact Center administrator has configured. Changing the profile type requires a token with `FLS:Read_Scope` scope. As of today, changing the profile type for a user is supported only from Cisco Webex Control Hub.

      - workPhone:string


        The work phone number of the user.

      - xspVersion:string


        (Optional) Used to subscribe for recording events. This field cannot be modified.

      - active\*:boolean


        Indicates whether the user is active or not active. Can be changed using Users Management in Cisco Webex Control Hub.

      - contactCenterEnabled\*:boolean


        The setting is for accessing the Agent Desktop to handle customer requests.

      - imiUserCreated:boolean


        (Optional) Indicates whether this user has a corresponding user created in IMI digital channel. This field cannot be modified.

      - teamIds:string\[\]


        Specify the teams id which got assigned to this user.

        Note: You can’t assign this profile to a capacity-based team. This field is applicable only when contactCenterEnabled is true.

```json
{
    "items": [\
        {\
            "itemIdentifier": 10,\
            "item": {\
                "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
                "id": "93912f11-6017-404b-bf14-5331890b1797",\
                "version": 1,\
                "firstName": "John",\
                "lastName": "Wick",\
                "email": "johnwick@company.com",\
                "workPhone": "1234567890",\
                "mobile": "1234567890",\
                "ciUserId": "1dq21e23-1234-5578-9a83-2afdae0d4ba1",\
                "broadCloudUserId": "1dq21e23-1234-5578-9a83-2afdae0d4ba1",\
                "userProfileId": "1dq21e23-1234-5578-9a83-2afdae0d4ba1",\
                "contactCenterEnabled": true,\
                "timezone": "America/New_York",\
                "xspVersion": "xsp-24.0",\
                "subscriptionId": "04d0bdf6-6d6a-4aae-8a8a-71c9152e6478",\
                "siteId": "8e6bb6da-2a78-4768-bef9-7e229f92af22",\
                "teamIds": [\
                    "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
                    "a53c8b54-46ca-43f6-ba05-08426a46e23f"\
                ],\
                "skillProfileId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
                "agentProfileId": "8e6bb6da-2a78-4768-bef9-7e229f92af22",\
                "multimediaProfileId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
                "deafultDialledNumber": "1234567890",\
                "externalIdentifier": "121212",\
                "active": true,\
                "imiUserCreated": false,\
                "preferredSupervisorTeamId": "2f9eecc5-0472-4549-9a83-2afdae0d4ba1",\
                "userLevelBurnoutInclusion": "INCLUDED",\
                "userLevelAutoCSATInclusion": "INCLUDED",\
                "userLevelWellnessBreakReminders": "DISABLED",\
                "userLevelSummariesInclusion": "INCLUDED"\
            },\
            "requestAction": "SAVE"\
        }\
    ]
}
```

## Responses

Status: 207

Multi-Status

Select Example

application/hal+json

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

PATCH/organization//user/bulk

orgid\*

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

Request Body (Form)Request Body (JSON)

BulkRequestDTOUserDTO

items

Add items

### Query Params

### Headers

Use personal access token

application/json

application/hal+json

Add Headers

Run

#### Response:

Data

Click “Run” to get sample response

CurlPythonNodejs

```bash
Copycurl -L --request PATCH \
--url https://api.wxcc-us1.cisco.com/organization//user/bulk \
--header 'Authorization: Bearer ' \
--header 'Content-Type: application/json' \
--header 'Accept: application/hal+json' \
--data '{}'
```

```python
Copyimport requests

url = "https://api.wxcc-us1.cisco.com/organization//user/bulk"

payload = '''{}'''

headers = {
    "Authorization": "Bearer ",
    "Content-Type": "application/json",
    "Accept": "application/hal+json"
}

response = requests.request('PATCH', url, headers=headers, data = payload)

print(response.text.encode('utf8'))
```

```javascript
Copyvar request = require('request');

headers = {
    "Authorization": "Bearer ",
    "Content-Type": "application/json",
    "Accept": "application/hal+json"
}
body = `{}`;

var options = {
    method: 'PATCH',
    url: 'https://api.wxcc-us1.cisco.com/organization//user/bulk',
    headers,
    body,
};

request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
```