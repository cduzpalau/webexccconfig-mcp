[Home](https://developer.webex.com/)/[Dial Number](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-number)/Update specific Dialed Number Mapping by ID

Webex Contact Center

Version 1

Dial Number

# Update specific Dialed Number Mapping by ID

**Operation Id:** updateConfig\_16

**Description:**

Update an existing Dialed Number Mapping by ID in a given organization.

PUT/organization/ **{orgid}/dial-number/{id}**

## Request Parameters

#### Path

orgidrequiredstring

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

example = "2f9eecc5-0472-4549-9a83-2afdae0d4ba1"

idrequiredstring

Resource ID of the Dialed Number Mapping.

example = "2f9eecc5-0472-4549-9a83-2afdae0d4ba2"

#### Request body

Schema DefinitionExample Body

- -DialledNumberEntryPointDTO





  - createdTime:integer


    This is the created time of the entity.

  - lastUpdatedTime:integer


    This is the updated time of the entity.

  - version:integer


    The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

  - dialledNumber:string


    The dialed number(DN) used to map to entry points.

  - dialledNumberDigits:string

  - entryPointId\*:string


    The identifier of an entry point to which you want to map the DN.

  - entryPointName\*:string


    The entryPoint name of the entryPointId.

  - esn:string


    The esn is routing prefix with extension

  - extension:string


    The extension used to map to entry points.

  - id:string


    ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

  - location:string


    The name of the location as configured on Webex Calling(applicable only for Webex Calling).

  - organizationId:string


    ID of the contact center organization. This field is required for all bulk save operations.

  - regionId:string


    Specify the telephony region id.



    You can pass id for one of these regions:



    US (USA), CA (Canada), MX (Mexico), AU (Australia), SG (Singapore), GB (United Kingdom), DE (Germany)



    You can retrieve it by calling /api/global/telephony-region API.

  - routePointId:string


    The identifier of a route point of WxC which is similar to entry point of WxCC

  - routingPrefix:string


    The routing prefix is mapped to a location and can be prefixed with an extension

  - defaultAni:boolean


    The default dial number for the tenant to make outdial calls. The default dial number is displayed in the customer's caller ID, if an agent does not select a specific outdial ANI (Automatic Number Identification) for an outdial call.



    A default value is automatically set once and entry point mapping is created

```json
{
    "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "id": "93912f11-6017-404b-bf14-5331890b1797",
    "version": 1,
    "dialledNumber": "+1-1234567890",
    "extension": 1234,
    "routingPrefix": 91,
    "esn": 919876,
    "routePointId": "7cbd4aad-0c3b-4de4-a15a-33cf05b9bf8j",
    "entryPointId": "7cbd4aad-0c3b-4de4-a15a-33cf05b9bf8j",
    "entryPointName": "Entry-Point",
    "defaultAni": true,
    "location": "7cbd4aad-0c3b-4de4-a15a-33cf05b9bf8j",
    "regionId": "7cbd4aad-0c3b-4de4-a15a-33cf05b9bf8j",
    "createdTime": 0,
    "lastUpdatedTime": 0,
    "dialledNumberDigits": "string"
}
```

## Responses

Status: 200

OK

Schema DefinitionExample Body

- -DialledNumberEntryPointDTO





  - createdTime:integer


    This is the created time of the entity.

  - lastUpdatedTime:integer


    This is the updated time of the entity.

  - version:integer


    The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

  - dialledNumber:string


    The dialed number(DN) used to map to entry points.

  - dialledNumberDigits:string

  - entryPointId\*:string


    The identifier of an entry point to which you want to map the DN.

  - entryPointName\*:string


    The entryPoint name of the entryPointId.

  - esn:string


    The esn is routing prefix with extension

  - extension:string


    The extension used to map to entry points.

  - id:string


    ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

  - location:string


    The name of the location as configured on Webex Calling(applicable only for Webex Calling).

  - organizationId:string


    ID of the contact center organization. This field is required for all bulk save operations.

  - regionId:string


    Specify the telephony region id.



    You can pass id for one of these regions:



    US (USA), CA (Canada), MX (Mexico), AU (Australia), SG (Singapore), GB (United Kingdom), DE (Germany)



    You can retrieve it by calling /api/global/telephony-region API.

  - routePointId:string


    The identifier of a route point of WxC which is similar to entry point of WxCC

  - routingPrefix:string


    The routing prefix is mapped to a location and can be prefixed with an extension

  - defaultAni:boolean


    The default dial number for the tenant to make outdial calls. The default dial number is displayed in the customer's caller ID, if an agent does not select a specific outdial ANI (Automatic Number Identification) for an outdial call.



    A default value is automatically set once and entry point mapping is created

```json
{
    "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "id": "93912f11-6017-404b-bf14-5331890b1797",
    "version": 1,
    "dialledNumber": "+1-1234567890",
    "extension": 1234,
    "routingPrefix": 91,
    "esn": 919876,
    "routePointId": "7cbd4aad-0c3b-4de4-a15a-33cf05b9bf8j",
    "entryPointId": "7cbd4aad-0c3b-4de4-a15a-33cf05b9bf8j",
    "entryPointName": "Entry-Point",
    "defaultAni": true,
    "location": "7cbd4aad-0c3b-4de4-a15a-33cf05b9bf8j",
    "regionId": "7cbd4aad-0c3b-4de4-a15a-33cf05b9bf8j",
    "createdTime": 0,
    "lastUpdatedTime": 0,
    "dialledNumberDigits": "string"
}
```

Status: 400

The request was invalid and cannot be served. An accompanying error message will explain further

Schema DefinitionExample Body

- -ApiErrorResponse


API Error Response containing error details.








  - trackingId:string


    An opaque identifier for mapping protocol failures to service internal codes. When specified in a request, it can be used for correlating events across services.

  - +error:ErrorDetails


    Detailed error information including a set of error messages.




    - key:string


      An application-defined error code.

    - reason:string


      Reason for the failure.

    - +message:OperationError\[\]


      A set of error messages.




      - description:string


        A human-readable explanation for the occurrence of an error

      - entity:string


        The entity on which the error occurred

      - +references:EntityInfo\[\]


        References to entities related to the error




        - version:integer


          Version of the entity.

        - createdDate:string


          Created date of the entity.

        - id:string


          ID of the entity.

        - lastModifiedDate:string


          Last modified date of the entity.

        - name:string


          The name of the entity.

        - additionalAttributes:object


          A map containing additional attributes of entity where both the key and value are Strings.

```json
{
    "trackingId": "ccconfig_af9eecc5-0472-4549-9a83-2afdae0d4ba0",
    "error": {
        "key": "400",
        "reason": "Test reason",
        "message": [\
            {\
                "description": "Test error",\
                "code": "400",\
                "entity": "cc_user",\
                "references": []\
            }\
        ]
    }
}
```

Status: 401

Unauthorized Operation

Schema DefinitionExample Body

- -ApiErrorResponse


API Error Response containing error details.








  - trackingId:string


    An opaque identifier for mapping protocol failures to service internal codes. When specified in a request, it can be used for correlating events across services.

  - +error:ErrorDetails


    Detailed error information including a set of error messages.




    - key:string


      An application-defined error code.

    - reason:string


      Reason for the failure.

    - +message:OperationError\[\]


      A set of error messages.




      - description:string


        A human-readable explanation for the occurrence of an error

      - entity:string


        The entity on which the error occurred

      - +references:EntityInfo\[\]


        References to entities related to the error




        - version:integer


          Version of the entity.

        - createdDate:string


          Created date of the entity.

        - id:string


          ID of the entity.

        - lastModifiedDate:string


          Last modified date of the entity.

        - name:string


          The name of the entity.

        - additionalAttributes:object


          A map containing additional attributes of entity where both the key and value are Strings.

```json
{
    "trackingId": "ccconfig_af9eecc5-0472-4549-9a83-2afdae0d4ba0",
    "error": {
        "key": "401",
        "reason": "Test reason",
        "message": [\
            {\
                "description": "Test error",\
                "code": "401",\
                "entity": "cc_user",\
                "references": []\
            }\
        ]
    }
}
```

Status: 403

Operation is forbidden

Schema DefinitionExample Body

- -ApiErrorResponse


API Error Response containing error details.








  - trackingId:string


    An opaque identifier for mapping protocol failures to service internal codes. When specified in a request, it can be used for correlating events across services.

  - +error:ErrorDetails


    Detailed error information including a set of error messages.




    - key:string


      An application-defined error code.

    - reason:string


      Reason for the failure.

    - +message:OperationError\[\]


      A set of error messages.




      - description:string


        A human-readable explanation for the occurrence of an error

      - entity:string


        The entity on which the error occurred

      - +references:EntityInfo\[\]


        References to entities related to the error




        - version:integer


          Version of the entity.

        - createdDate:string


          Created date of the entity.

        - id:string


          ID of the entity.

        - lastModifiedDate:string


          Last modified date of the entity.

        - name:string


          The name of the entity.

        - additionalAttributes:object


          A map containing additional attributes of entity where both the key and value are Strings.

```json
{
    "trackingId": "ccconfig_af9eecc5-0472-4549-9a83-2afdae0d4ba0",
    "error": {
        "key": "403",
        "reason": "Test reason",
        "message": [\
            {\
                "description": "Test error",\
                "code": "403",\
                "entity": "cc_user",\
                "references": []\
            }\
        ]
    }
}
```

Status: 404

Resource not found or URI is invalid

Schema DefinitionExample Body

- -ApiErrorResponse


API Error Response containing error details.








  - trackingId:string


    An opaque identifier for mapping protocol failures to service internal codes. When specified in a request, it can be used for correlating events across services.

  - +error:ErrorDetails


    Detailed error information including a set of error messages.




    - key:string


      An application-defined error code.

    - reason:string


      Reason for the failure.

    - +message:OperationError\[\]


      A set of error messages.




      - description:string


        A human-readable explanation for the occurrence of an error

      - entity:string


        The entity on which the error occurred

      - +references:EntityInfo\[\]


        References to entities related to the error




        - version:integer


          Version of the entity.

        - createdDate:string


          Created date of the entity.

        - id:string


          ID of the entity.

        - lastModifiedDate:string


          Last modified date of the entity.

        - name:string


          The name of the entity.

        - additionalAttributes:object


          A map containing additional attributes of entity where both the key and value are Strings.

```json
{
    "trackingId": "ccconfig_af9eecc5-0472-4549-9a83-2afdae0d4ba0",
    "error": {
        "key": "404",
        "reason": "Test reason",
        "message": [\
            {\
                "description": "Test error",\
                "code": "404",\
                "entity": "cc_user",\
                "references": []\
            }\
        ]
    }
}
```

Status: 412

Resource referred in other entity(s). Please get all the reference entities info by invoking Get incoming-references api.

Schema DefinitionExample Body

- -ApiErrorResponse


API Error Response containing error details.








  - trackingId:string


    An opaque identifier for mapping protocol failures to service internal codes. When specified in a request, it can be used for correlating events across services.

  - +error:ErrorDetails


    Detailed error information including a set of error messages.




    - key:string


      An application-defined error code.

    - reason:string


      Reason for the failure.

    - +message:OperationError\[\]


      A set of error messages.




      - description:string


        A human-readable explanation for the occurrence of an error

      - entity:string


        The entity on which the error occurred

      - +references:EntityInfo\[\]


        References to entities related to the error




        - version:integer


          Version of the entity.

        - createdDate:string


          Created date of the entity.

        - id:string


          ID of the entity.

        - lastModifiedDate:string


          Last modified date of the entity.

        - name:string


          The name of the entity.

        - additionalAttributes:object


          A map containing additional attributes of entity where both the key and value are Strings.

```json
{
    "trackingId": "ccconfig_af9eecc5-0472-4549-9a83-2afdae0d4ba0",
    "error": {
        "key": "412",
        "reason": "Test reason",
        "message": [\
            {\
                "description": "Test error",\
                "code": "412",\
                "entity": "cc_user",\
                "references": []\
            }\
        ]
    }
}
```

Status: 429

Too many requests have been sent in a given amount of time and the request has been rate limited

Schema DefinitionExample Body

- -ApiErrorResponse


API Error Response containing error details.








  - trackingId:string


    An opaque identifier for mapping protocol failures to service internal codes. When specified in a request, it can be used for correlating events across services.

  - +error:ErrorDetails


    Detailed error information including a set of error messages.




    - key:string


      An application-defined error code.

    - reason:string


      Reason for the failure.

    - +message:OperationError\[\]


      A set of error messages.




      - description:string


        A human-readable explanation for the occurrence of an error

      - entity:string


        The entity on which the error occurred

      - +references:EntityInfo\[\]


        References to entities related to the error




        - version:integer


          Version of the entity.

        - createdDate:string


          Created date of the entity.

        - id:string


          ID of the entity.

        - lastModifiedDate:string


          Last modified date of the entity.

        - name:string


          The name of the entity.

        - additionalAttributes:object


          A map containing additional attributes of entity where both the key and value are Strings.

```json
{
    "trackingId": "ccconfig_af9eecc5-0472-4549-9a83-2afdae0d4ba0",
    "error": {
        "key": "429",
        "reason": "Test reason",
        "message": [\
            {\
                "description": "Test error",\
                "code": "429",\
                "entity": "cc_user",\
                "references": []\
            }\
        ]
    }
}
```

Status: 500

An Unexpected Error Occurred

Schema DefinitionExample Body

- -ApiErrorResponse


API Error Response containing error details.








  - trackingId:string


    An opaque identifier for mapping protocol failures to service internal codes. When specified in a request, it can be used for correlating events across services.

  - +error:ErrorDetails


    Detailed error information including a set of error messages.




    - key:string


      An application-defined error code.

    - reason:string


      Reason for the failure.

    - +message:OperationError\[\]


      A set of error messages.




      - description:string


        A human-readable explanation for the occurrence of an error

      - entity:string


        The entity on which the error occurred

      - +references:EntityInfo\[\]


        References to entities related to the error




        - version:integer


          Version of the entity.

        - createdDate:string


          Created date of the entity.

        - id:string


          ID of the entity.

        - lastModifiedDate:string


          Last modified date of the entity.

        - name:string


          The name of the entity.

        - additionalAttributes:object


          A map containing additional attributes of entity where both the key and value are Strings.

```json
{
    "trackingId": "ccconfig_af9eecc5-0472-4549-9a83-2afdae0d4ba0",
    "error": {
        "key": "500",
        "reason": "Test reason",
        "message": [\
            {\
                "description": "Test error",\
                "code": "500",\
                "entity": "cc_user",\
                "references": []\
            }\
        ]
    }
}
```

Configuration

Configuration is not available on this doc

ParametersCode Snippets

PUT/organization//dial-number/ **{id}**

orgid\*

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

id\*

Resource ID of the Dialed Number Mapping.

Request Body (Form)Request Body (JSON)

DialledNumberEntryPointDTO

organizationId

ID of the contact center organization. This field is required for all bulk save operations.

id

ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

version

The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

dialledNumber

The dialed number(DN) used to map to entry points.

extension

The extension used to map to entry points.

routingPrefix

The routing prefix is mapped to a location and can be prefixed with an extension

esn

The esn is routing prefix with extension

routePointId

The identifier of a route point of WxC which is similar to entry point of WxCC

entryPointId\*

The identifier of an entry point to which you want to map the DN.

entryPointName\*

The entryPoint name of the entryPointId.

The default dial number for the tenant to make outdial calls. The default dial number is displayed in the customer's caller ID, if an agent does not select a specific outdial ANI (Automatic Number Identification) for an outdial call.

A default value is automatically set once and entry point mapping is created

defaultAni

location

The name of the location as configured on Webex Calling(applicable only for Webex Calling).

regionId

Specify the telephony region id.

You can pass id for one of these regions:

US (USA), CA (Canada), MX (Mexico), AU (Australia), SG (Singapore), GB (United Kingdom), DE (Germany)

You can retrieve it by calling /api/global/telephony-region API.

createdTime

This is the created time of the entity.

lastUpdatedTime

This is the updated time of the entity.

dialledNumberDigits

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
Copycurl -L --request PUT \
--url https://api.wxcc-us1.cisco.com/organization//dial-number/{id} \
--header 'Authorization: Bearer ' \
--header 'Content-Type: application/json' \
--header 'Accept: */*' \
--data '{}'
```

```python
Copyimport requests

url = "https://api.wxcc-us1.cisco.com/organization//dial-number/{id}"

payload = '''{}'''

headers = {
    "Authorization": "Bearer ",
    "Content-Type": "application/json",
    "Accept": "*/*"
}

response = requests.request('PUT', url, headers=headers, data = payload)

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
    method: 'PUT',
    url: 'https://api.wxcc-us1.cisco.com/organization//dial-number/{id}',
    headers,
    body,
};

request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
```