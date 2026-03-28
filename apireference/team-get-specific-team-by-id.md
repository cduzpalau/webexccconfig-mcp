[Home](https://developer.webex.com/)/[Team](https://developer.webex.com/webex-contact-center/docs/api/v1/team)/Get specific Team by ID

Webex Contact Center

Version 1

Team

# Get specific Team by ID

**Operation Id:** getConfig\_5

**Description:**

Retrieve an existing Team by ID in a given organization.

GET/organization/ **{orgid}/team/{id}**

## Request Parameters

#### Path

orgidrequiredstring

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

example = "2f9eecc5-0472-4549-9a83-2afdae0d4ba1"

idrequiredstring

Resource ID of the Team

example = "2f9eecc5-0472-4549"

## Responses

Status: 200

OK

Schema DefinitionExample Body

- -TeamResponseDTO





  - capacity:integer


    The maximum number of simultaneous contacts that this team can handle.

    This setting is applicable only for capacity-based teams.

  - createdTime:integerreadOnly


    Creation time(in epoch millis) of this resource.

  - lastUpdatedTime:integerreadOnly


    Time(in epoch millis) when this resource was last updated.

  - version:integer


    The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

  - description:string


    Indicates the team

  - desktopLayoutId:string


    Identifier for an agent desktop layout which a Contact Center administrator has configured.

  - dialedNumber:string


    The dial number where the system distributes the calls for this team.

    This setting is applicable only for capacity-based teams.

  - id:string


    ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

  - multiMediaProfileId:string


    Id of the multimedia profile for this team.

  - name:string


    Indicates the name of the team such as Billing or Customer Support

  - organizationId:string


    ID of the contact center organization. It is required to define for the following operations - All bulk save operations

  - siteId:string


    Identifier for a site which is a physical contact center location under the control of your enterprise.

  - siteName:string


    The name of the site this team belongs to.

  - skillProfileId:string


    Id of the skill profile for this team if your enterprise uses the optional Skills-Based Routing feature.

  - teamStatus:string


    Indicates whether the team is available to handle customer contacts.

    Can be one of: IN\_SERVICE/NOT\_AVAILABLE.



    enum = \["IN\_SERVICE", "NOT\_AVAILABLE"\]

  - teamType:string


    Team type can be the following:



    AGENT: A specific number of agents are assigned to the team.



    CAPACITY: Specific number of agents not assigned to the team. Capacity-based teams for voice mailboxes or agent groups that are not managed by the Webex Contact Center system.

    enum = \["AGENT", "CAPACITY"\]

  - active:boolean


    Indicates whether the team is active(when true) or not active(when false).

  - rankQueuesForTeam:boolean

  - systemDefault:boolean


    Indicates whether the created resource is system created or not

  - userIds:string\[\]


    Indicates the agents id(s) who are part of this team.

  - +queueRankings:QueueRankingDTO\[\]

    - createdTime:integerreadOnly


      Creation time(in epoch millis) of this resource.

    - lastUpdatedTime:integerreadOnly


      Time(in epoch millis) when this resource was last updated.

    - rank\*:integer

    - version:integer


      The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

    - id:string


      ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

    - organizationId:string


      ID of the contact center organization. It is required to define for the following operations - All bulk save operations

    - queueId\*:string

```json
{
    "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "id": "93912f11-6017-404b-bf14-5331890b1797",
    "version": 1,
    "name": "Customer Support",
    "teamType": "AGENT",
    "teamStatus": "IN_SERVICE",
    "dialedNumber": "+14085550123",
    "capacity": 1,
    "active": true,
    "siteId": "8e6bb6da-2a78-4768-bef9-7e229f92af22",
    "desktopLayoutId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "siteName": "New_York",
    "skillProfileId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "multiMediaProfileId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "userIds": [\
        "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
        "a53c8b54-46ca-43f6-ba05-08426a46e23f"\
    ],
    "description": "Capacity based team",
    "systemDefault": false,
    "rankQueuesForTeam": true,
    "queueRankings": [\
        {\
            "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
            "id": "93912f11-6017-404b-bf14-5331890b1797",\
            "version": 1,\
            "queueId": "string",\
            "rank": 0,\
            "createdTime": 1617536244000,\
            "lastUpdatedTime": 1617536244000\
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

GET/organization//team/ **{id}**

orgid\*

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

id\*

Resource ID of the Team

### Query Params

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
--url https://api.wxcc-us1.cisco.com/organization//team/{id} \
--header 'Authorization: Bearer ' \
--header 'Accept: */*'
```

```python
Copyimport requests

url = "https://api.wxcc-us1.cisco.com/organization//team/{id}"

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
    url: 'https://api.wxcc-us1.cisco.com/organization//team/{id}',
    headers,
    body,
};

request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
```