[Home](https://developer.webex.com/)/[Auxiliary Code](https://developer.webex.com/webex-contact-center/docs/api/v1/auxiliary-code)/Create a new Auxiliary Code

Webex Contact Center

Version 1

Auxiliary Code

# Create a new Auxiliary Code

**Operation Id:** createConfig\_23

**Description:**

Create a new Auxiliary Code in a given organization.

POST/organization/ **{orgid}**/auxiliary-code

## Request Parameters

#### Path

orgidrequiredstring

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

example = "2f9eecc5-0472-4549-9a83-2afdae0d4ba1"

#### Request body

Schema DefinitionExample Body

- -AuxiliaryCodeDTO





  - version:integer


    The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

  - burnoutInclusion:string


    Indicates the idle code Inclusion status for agent burnout calculation. Default value is 'INCLUDED' for idle codes and 'NOT\_APPLICABLE' for wrap up codes. Valid values are 'NOT\_APPLICABLE', 'EXCLUDED', 'INCLUDED'

    enum = \["NOT\_APPLICABLE", "EXCLUDED", "INCLUDED"\]

  - description:string


    A short description indicating the context of the code.

  - id:string


    ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

  - name\*:string


    A name for the code.

  - organizationId:string


    ID of the contact center organization. It is required to define for the following operations - All bulk save operations

  - workTypeCode\*:string


    Indicates the work type associated with this code. Valid values are 'IDLE\_CODE', 'WRAP\_UP\_CODE'

    enum = \["IDLE\_CODE", "WRAP\_UP\_CODE"\]

  - workTypeId\*:string


    Indicates the work type id associated with this code.

  - active\*:boolean


    Indicates whether the code is active(when true) or not active(when false).



    It is required only during a create or an update operation.

  - defaultCode\*:boolean


    Indicates whether this is the default code(true) or not(false).



    If this is the first idle or wrap-up code for your organization,it must be the default. It can be made non-default later once more codes are created.

  - isSystemCode:boolean


    Indicates whether this is the system default code(true) or not(false).

  - systemDefault:boolean


    Indicates whether the created resource is system created or not

```json
{
    "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "id": "93912f11-6017-404b-bf14-5331890b1797",
    "version": 1,
    "name": "Sales-Query",
    "description": "Wrap-up code to for sales query",
    "defaultCode": true,
    "active": true,
    "isSystemCode": true,
    "workTypeId": "19edbcf9-2dea-438b-bdae-446139a5d1fd",
    "workTypeCode": "WRAP_UP_CODE",
    "burnoutInclusion": "INCLUDED",
    "systemDefault": false
}
```

## Responses

Status: 201

Created

Schema DefinitionExample Body

- -AuxiliaryCodeDTO





  - createdTime:integerreadOnly


    Creation time(in epoch millis) of this resource.

  - lastUpdatedTime:integerreadOnly


    Time(in epoch millis) when this resource was last updated.

  - version:integer


    The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

  - burnoutInclusion:string


    Indicates the idle code Inclusion status for agent burnout calculation. Default value is 'INCLUDED' for idle codes and 'NOT\_APPLICABLE' for wrap up codes. Valid values are 'NOT\_APPLICABLE', 'EXCLUDED', 'INCLUDED'

    enum = \["NOT\_APPLICABLE", "EXCLUDED", "INCLUDED"\]

  - description:string


    A short description indicating the context of the code.

  - id:string


    ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

  - name\*:string


    A name for the code.

  - organizationId:string


    ID of the contact center organization. It is required to define for the following operations - All bulk save operations

  - workTypeCode\*:string


    Indicates the work type associated with this code. Valid values are 'IDLE\_CODE', 'WRAP\_UP\_CODE'

    enum = \["IDLE\_CODE", "WRAP\_UP\_CODE"\]

  - workTypeId\*:string


    Indicates the work type id associated with this code.

  - active\*:boolean


    Indicates whether the code is active(when true) or not active(when false).



    It is required only during a create or an update operation.

  - defaultCode\*:boolean


    Indicates whether this is the default code(true) or not(false).



    If this is the first idle or wrap-up code for your organization,it must be the default. It can be made non-default later once more codes are created.

  - isSystemCode:boolean


    Indicates whether this is the system default code(true) or not(false).

  - systemDefault:boolean


    Indicates whether the created resource is system created or not

```json
{
    "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "id": "93912f11-6017-404b-bf14-5331890b1797",
    "version": 1,
    "name": "Sales-Query",
    "description": "Wrap-up code to for sales query",
    "defaultCode": true,
    "active": true,
    "isSystemCode": true,
    "workTypeId": "19edbcf9-2dea-438b-bdae-446139a5d1fd",
    "workTypeCode": "WRAP_UP_CODE",
    "burnoutInclusion": "INCLUDED",
    "systemDefault": false,
    "createdTime": 1617536244000,
    "lastUpdatedTime": 1617536244000
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

POST/organization//auxiliary-code

orgid\*

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

Request Body (Form)Request Body (JSON)

AuxiliaryCodeDTO

organizationId

ID of the contact center organization. It is required to define for the following operations - All bulk save operations

id

ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

version

The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

name\*

A name for the code.

description

A short description indicating the context of the code.

Indicates whether this is the default code(true) or not(false).

If this is the first idle or wrap-up code for your organization,it must be the default. It can be made non-default later once more codes are created.

defaultCode

Indicates whether the code is active(when true) or not active(when false).

It is required only during a create or an update operation.

active

Indicates whether this is the system default code(true) or not(false).

isSystemCode

workTypeId\*

Indicates the work type id associated with this code.

workTypeCode\*

Indicates the work type associated with this code. Valid values are 'IDLE\_CODE', 'WRAP\_UP\_CODE'

IDLE\_CODEWRAP\_UP\_CODE

burnoutInclusion

Indicates the idle code Inclusion status for agent burnout calculation. Default value is 'INCLUDED' for idle codes and 'NOT\_APPLICABLE' for wrap up codes. Valid values are 'NOT\_APPLICABLE', 'EXCLUDED', 'INCLUDED'

NOT\_APPLICABLEEXCLUDEDINCLUDED

Indicates whether the created resource is system created or not

systemDefault

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
--url https://api.wxcc-us1.cisco.com/organization//auxiliary-code \
--header 'Authorization: Bearer ' \
--header 'Content-Type: application/json' \
--header 'Accept: */*' \
--data '{}'
```

```python
Copyimport requests

url = "https://api.wxcc-us1.cisco.com/organization//auxiliary-code"

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
    url: 'https://api.wxcc-us1.cisco.com/organization//auxiliary-code',
    headers,
    body,
};

request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
```