[Home](https://developer.webex.com/)/[Users](https://developer.webex.com/webex-contact-center/docs/api/v1/users)/Get specific User by CI User ID

Webex Contact Center

Version 2

Users

# Get specific User by CI User ID

**Operation Id:** getUserByCiUserIdWithUserProfileGranularAccess

**Description:**

Retrieve an existing User using the CI ID in a given organization.

GET/organization/ **{orgid}/v2/user/by-ci-user-id/{id}**

## Request Parameters

#### Path

orgidrequiredstring

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

example = "2f9eecc5-0472-4549-9a83-2afdae0d4ba1"

idrequiredstring

CI ID of the User.

example = "2f9eecc5-0472-4549"

#### Query

includeUserProfileboolean

Specifiy whether to include user profile data

example = true

includeNamesboolean

Specifiy whether to include resource collection names

example = true

## Responses

Status: 200

OK

Select Example

application/hal+json

Schema DefinitionExample Body

- -UserResponseDTO\_UserResponseWithUserProfileGranularAccess





  - createdTime:integerreadOnly


    Creation time(in epoch millis) of this resource.

  - lastUpdatedTime:integerreadOnly


    Time(in epoch millis) when this resource was last updated.

  - skillProfileUpdatedTime:integer


    The date when the skill profile was last modified

  - version:integer


    The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

  - agentProfileId:string


    Identifier for a Desktop Profile which is a group of permissions and Agent Desktop behaviors that you assign to specific users.

  - broadCloudUserId:string


    Broadcloud user Id

  - ciUserId:string


    Cisco Common Identity user Id

  - dbId:string


    Legacy identifier for migrated users.

  - deafultDialledNumber:string


    (Optional) The dial number of the agent.

  - email:string


    The email address of the user.

  - externalIdentifier:string


    (Optional) Agent identification details, such as the employee number.

  - firstName:string


    The first name of the user.

  - id:string


    ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

  - lastName:string


    The last name of the user.

  - mobile:string


    The mobile phone number of the user.

  - multimediaProfileId:string


    (Optional) If your organization administrator enables Multimedia for your enterprise, you can select a multimedia profile for this team.

  - organizationId:string


    ID of the contact center organization. It is required to define for the following operations - All bulk save operations

  - preferredSupervisorTeamId:string


    The teamId to look for to load the desktop layout when a supervisor logs in to desktop.

  - siteId:string


    Details of site which a Contact Center administrator has configured for the user.

  - siteName:string


    site name that user is associated with

  - skillProfileId:string


    (Optional) If your enterprise uses the optional Skills-Based Routing feature, This profile overrides any skill profile at the team level that is associated with the agent

  - skillProfileUpdatedBy:string


    The ID of the user who last modified the skill profile

  - subscriptionId:string


    (Optional) Used to subscribe for recording events.

  - timezone:string


    (Optional) The time zone that you provision for your enterprise.

  - userLevelAutoCSATInclusion:string


    User level AutoCSAT inclusion type. Used only when Agent inclusion is set to 'Specific Agents' at the org level Cisco AI Assistant>Auto CSAT config.



    enum = \["INCLUDED", "EXCLUDED"\]

  - userLevelBurnoutInclusion:string


    User level burnout inclusion type. Used only when Agent inclusion is set to 'Specific Agents' at the org level Agent Wellbeing>Burnout config.



    enum = \["INCLUDED", "EXCLUDED"\]

  - userLevelSummariesInclusion:string


    User level Generated Summaries inclusion type. Used only when Generated Summaries is set to 'Specific Agents' at the org level Cisco AI Assistant>Generated Summaries.



    enum = \["INCLUDED", "EXCLUDED"\]

  - userLevelWellnessBreakReminders:string


    User level Wellness break reminder type. If top level Agent burnout config has wellness break reminders enabled, this property determines if an Agent is enabled/disabled for receiving break reminders.



    enum = \["DISABLED", "ENABLED"\]

  - userProfileId:string


    Identifier for an user profile which a Contact Center administrator has configured.

  - workPhone:string


    The work phone number of the user.

  - xspVersion:string


    (Optional) Used to subscribe for recording events.

  - active:boolean


    Specify whether the user is active or not active.

  - contactCenterEnabled:boolean


    The setting is for accessing Desktop to handle customer requests.

  - imiUserCreated:boolean


    Specify whether or not the corresponding user is created in IMI.

  - systemDefault:boolean


    Indicates whether the created resource is system created or not

  - teamIds:string\[\]


    Specify the teams id which got assigned to this user.

    Note: You can’t assign this profile to a capacity-based team.

  - +queuesCount:QueuesCountDTO\_UserResponseWithUserProfileGranularAccess


    The count of each type of Contact Service Queues that the user is assigned to.




    - agentBased:integer

    - skillBased:integer

    - teamBased:integer
  - +userProfileGranularAccessData:UserProfileGranularAccessDTO\_UserResponseWithUserProfileGranularAccess


    Details of UserProfile which a Contact Center administrator has configured for the user.This is an optional object, returned only when the endpoint 'Get User along with profile by ID' is invoked.




    - createdTime:integerreadOnly


      Creation time(in epoch millis) of this resource.

    - lastUpdatedTime:integerreadOnly


      Time(in epoch millis) when this resource was last updated.

    - version:integer


      The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

    - defaultResourceCollectionId:string


      Specifies the default resource collection for this profile

    - description:string


      An optional description of the profile.

    - id:string


      ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

    - name\*:string


      The name of the user profile.

    - organizationId:string


      ID of the contact center organization. It is required to define for the following operations - All bulk save operations

    - permissionAccessLevel\*:string


      This can be used to allow users of this profile access to specific or all the Webex Contact Center permissions.



      It can take one of these values:



      ALL — A contact center user with this profile can access all Contact Center permissions.



      SPECIFIC — A contact center user with this profile can access only specific permissions.



      enum = \["SPECIFIC", "ALL", "PROVISIONED\_VALUE", "NONE"\]

    - profileType\*:string


      The type determines the privileges applicable for a profile.



      It can take one of these values:



      STANDARD\_AGENT — Has access to Agent Desktop\[m\_agent\_desktop\] module.



      PREMIUM\_AGENT — Has access to Agent Desktop\[m\_agent\_desktop\] and Multimedia\[m\_multimedia\] module.



      SUPERVISOR — Has access to all modules except to manage tenants in the Provisioning\[m\_provisioning\] module.



      ADMINISTRATOR — Has access to all modules.



      ADMINISTRATOR\_ONLY — Has access to Provisioning\[m\_provisioning\], Real Time Reports\[m\_real\_time\_reports\], Call Recording\[m\_call\_recording\], IMI Digital Channels\[m\_imi\_digital\_channels\], and Routing Strategy\[m\_routing\_strategy\] modules.



      It is required only during a create operation.



      The profile type cannot be changed for an existing user profile.



      enum = \["ADMINISTRATOR", "ADMINISTRATOR\_ONLY", "SUPERVISOR", "PREMIUM\_AGENT", "STANDARD\_AGENT", ...\]

    - resourceAccessLevel\*:string


      This can be used to allow users of this profile access to specific or all the Webex Contact Center resources.



      It can take one of these values:



      ALL — A contact center user with this profile can access all Contact Center resources.



      SPECIFIC — A contact center user with this profile can access only specific resources.



      enum = \["SPECIFIC", "ALL", "PROVISIONED\_VALUE", "NONE"\]

    - active\*:boolean


      Specify whether the User profile is active or not.

    - systemDefault:boolean


      Indicates whether the created resource is system created or not

    - editableFolderIds:integer\[\]


      Indicates the id(s) of the reporting folders a user of this profile has read and write access to.

    - nonViewableFolderIds:integer\[\]


      Indicates the id(s) of the restricted reporting folders for a user of this profile.

    - viewableFolderIds:integer\[\]


      Indicates the id(s) of the reporting folders a user of this profile has read access to.

    - +permissions:UserProfilePermissionsDTO\_UserResponseWithUserProfileGranularAccess\[\]


      Specifies the permissions(s) a user of this profile has access to.



      It should be chosen when permission access is SPECIFIC.



      Please specify all the following permissions and their respective access type.




      - access:string


        enum = \["EDIT", "VIEW", "NONE", "ENABLED", "DISABLED"\]

      - id:string

      - name\*:string
    - +resourceCollections:ResourceCollectionDTO\_UserResponseWithUserProfileGranularAccess\[\]


      Specifies the resource collection(s) a user of this profile has access to.



      resource collection(s) needs to be specified when resourceAccessLevel is SPECIFIC




      - createdTime:integerreadOnly


        Creation time(in epoch millis) of this resource.

      - lastUpdatedTime:integerreadOnly


        Time(in epoch millis) when this resource was last updated.

      - resourceCount:integer

      - version:integer


        The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

      - description:string

      - id:string


        ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

      - name\*:string


        Indicates the name of the site. Generally, it is the name of the geographical location. It is required only during a create or an update operation.

      - organizationId:string


        ID of the contact center organization. It is required to define for the following operations - All bulk save operations

      - +resources:ResourceTypesDTO\_UserResponseWithUserProfileGranularAccess\[\]

        - accessLevel\*:string


          enum = \["SPECIFIC", "ALL", "PROVISIONED\_VALUE", "NONE"\]

        - name\*:string

        - ids:string\[\]

```json
{
    "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "id": "93912f11-6017-404b-bf14-5331890b1797",
    "version": 1,
    "firstName": "John",
    "lastName": "Wick",
    "email": "johnwick@company.com",
    "workPhone": "1234567890",
    "mobile": "1234567890",
    "ciUserId": "1dq21e23-1234-5578-9a83-2afdae0d4ba1",
    "broadCloudUserId": "1dq21e23-1234-5578-9a83-2afdae0d4ba1",
    "timezone": "America/New_York",
    "xspVersion": "xsp-24.0",
    "subscriptionId": "04d0bdf6-6d6a-4aae-8a8a-71c9152e6478",
    "userProfileId": "1dq21e23-1234-5578-9a83-2afdae0d4ba1",
    "contactCenterEnabled": false,
    "siteId": "1dq21e23-1234-5578-9a83-2afdae0d4ba1",
    "siteName": "bengaluru",
    "teamIds": [\
        "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
        "a53c8b54-46ca-43f6-ba05-08426a46e23f"\
    ],
    "skillProfileId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "agentProfileId": "8e6bb6da-2a78-4768-bef9-7e229f92af22",
    "multimediaProfileId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "deafultDialledNumber": "1234567890",
    "externalIdentifier": "121212",
    "active": false,
    "dbId": "1dq45f23-1234-6r18-9a83-2atuiy0d4bh1",
    "userProfileGranularAccessData": {
        "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
        "id": "93912f11-6017-404b-bf14-5331890b1797",
        "version": 1,
        "name": "Contact Center Admin Profile",
        "description": "This profile should be applied only to contact center admins.",
        "profileType": "PREMIUM_AGENT",
        "active": true,
        "permissionAccessLevel": "ALL",
        "resourceAccessLevel": "ALL",
        "permissions": [\
            {\
                "id": "string",\
                "name": "string",\
                "access": "EDIT"\
            }\
        ],
        "editableFolderIds": [ 1, 2 ],
        "viewableFolderIds": [ 1, 2 ],
        "nonViewableFolderIds": [ 1, 2 ],
        "systemDefault": false,
        "defaultResourceCollectionId": "80f49a6e-11d7-4651-b730-99ed2f726f61",
        "resourceCollections": [\
            {\
                "id": "80f49a6e-11d7-4651-b730-99ed2f726f61"\
            },\
            {\
                "id": "453d0f8e-fa90-4e07-a682-35c08e8d9f4b"\
            }\
        ],
        "createdTime": 1617536244000,
        "lastUpdatedTime": 1617536244000
    },
    "imiUserCreated": false,
    "preferredSupervisorTeamId": "e27d2b54-46ca-43g6-ba65-08426e46e23d",
    "systemDefault": false,
    "userLevelBurnoutInclusion": "INCLUDED",
    "userLevelAutoCSATInclusion": "INCLUDED",
    "userLevelWellnessBreakReminders": "DISABLED",
    "userLevelSummariesInclusion": "INCLUDED",
    "queuesCount": "{\n   \"teamBased\": 0\n   \"skillBased\": 0\n   \"agentBased\": 0\n}",
    "skillProfileUpdatedBy": "1dq21e23-1234-5578-9a83-2afdae0d4ba1",
    "createdTime": 1617536244000,
    "lastUpdatedTime": 1617536244000,
    "skillProfileUpdatedTime": 0
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

GET/organization//v2/user/by-ci-user-id/ **{id}**

orgid\*

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

id\*

CI ID of the User.

### Query Params

Add Query Parameters

### Headers

Use personal access token

application/hal+json

Add Headers

Run

#### Response:

Data

Click “Run” to get sample response

CurlPythonNodejs

```bash
Copycurl -L --request GET \
--url https://api.wxcc-us1.cisco.com/organization//v2/user/by-ci-user-id/{id} \
--header 'Authorization: Bearer ' \
--header 'Accept: application/hal+json'
```

```python
Copyimport requests

url = "https://api.wxcc-us1.cisco.com/organization//v2/user/by-ci-user-id/{id}"

payload = None

headers = {
    "Authorization": "Bearer ",
    "Accept": "application/hal+json"
}

response = requests.request('GET', url, headers=headers, data = payload)

print(response.text.encode('utf8'))
```

```javascript
Copyvar request = require('request');

headers = {
    "Authorization": "Bearer ",
    "Accept": "application/hal+json"
}
body = null;
var options = {
    method: 'GET',
    url: 'https://api.wxcc-us1.cisco.com/organization//v2/user/by-ci-user-id/{id}',
    headers,
    body,
};

request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
```