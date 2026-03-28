[Home](https://developer.webex.com/)/[Team](https://developer.webex.com/webex-contact-center/docs/api/v1/team)/List Team(s)

Webex Contact Center

Version 2

Team

# List Team(s)

**Operation Id:** getAllConfigWithMetaData\_6

**Description:**

Retrieve a list of Team(s) in a given organization.

GET/organization/ **{orgid}**/v2/team

## Request Parameters

#### Path

orgidrequiredstring

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

example = "2f9eecc5-0472-4549-9a83-2afdae0d4ba1"

#### Query

filterstring

Specify a filter based on which the results will be fetched. All the fields are supported except: organizationId, userIds, queueRankings, createdTime, lastUpdatedTime

Use userId field to filter teams assocaited to provided user.

The examples below show some search queries

- id=="57efb0e6-5af0-4245-a67d-d3c5045cdb6e"
- id!="57efb0e6-5af0-4245-a67d-d3c5045cdb6e"
- id=in=("57efb0e6-5af0-4245-a67d-d3c5045cdb6e","a421e0b2-732e-46f3-a057-39160a53afb9")
- id=out=("57efb0e6-5af0-4245-a67d-d3c5045cdb6e","a421e0b2-732e-46f3-a057-39160a53afb9")

This parameter uses the RSQL query syntax, a URI-friendly format for expressing criteria for filtering REST entities. For more information about RSQL in general, see [this reference](https://www.here.com/docs/bundle/data-client-library-developer-guide-java-scala/page/client/rsql.html). For a list of supported operators, see [this syntax guide](https://github.com/perplexhub/rsql-jpa-specification#rsql-syntax-reference).

Note: values to be used in the filter syntax should not contain space, and if so kindly bound it with quotes to apply filter.

example = "id=="2f9eecc5-0472-4549-9a83-2afdae0d4ba1""

attributesstring

Specify the attributes to be returned.Default all attributes are returned along with specified columns. All Attributes are supported except (userIds, queueRankings)

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

supervisorViewboolean

supervisorView flag honours user-profile team access rights if supervisor or administrator who has contact center enabled.

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

- -ResponseEnvelopeTeamResponseDTO





  - meta:object

  - +data:TeamResponseDTO\[\]

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
    "meta": {},
    "data": [\
        {\
            "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
            "id": "93912f11-6017-404b-bf14-5331890b1797",\
            "version": 1,\
            "name": "Customer Support",\
            "teamType": "AGENT",\
            "teamStatus": "IN_SERVICE",\
            "dialedNumber": "+14085550123",\
            "capacity": 1,\
            "active": true,\
            "siteId": "8e6bb6da-2a78-4768-bef9-7e229f92af22",\
            "desktopLayoutId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
            "siteName": "New_York",\
            "skillProfileId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
            "multiMediaProfileId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
            "userIds": [\
                "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
                "a53c8b54-46ca-43f6-ba05-08426a46e23f"\
            ],\
            "description": "Capacity based team",\
            "systemDefault": false,\
            "rankQueuesForTeam": true,\
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
            ],\
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

Configuration

Configuration is not available on this doc

ParametersCode Snippets

GET/organization//v2/team

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
--url https://api.wxcc-us1.cisco.com/organization//v2/team \
--header 'Authorization: Bearer ' \
--header 'Accept: */*'
```

```python
Copyimport requests

url = "https://api.wxcc-us1.cisco.com/organization//v2/team"

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
    url: 'https://api.wxcc-us1.cisco.com/organization//v2/team',
    headers,
    body,
};

request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
```