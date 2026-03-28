[Home](https://developer.webex.com/)/[Dial Number](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-number)/List Dialed Number Mapping(s)

Webex Contact Center

Version 3

Dial Number

# List Dialed Number Mapping(s)

**Operation Id:** getAllConfigWithMetaDataV3

**Description:**

Retrieve a list of Dialed Number Mapping(s) in a given organization.

GET/organization/ **{orgid}**/v3/dial-number

## Request Parameters

#### Path

orgidrequiredstring

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

example = "2f9eecc5-0472-4549-9a83-2afdae0d4ba1"

#### Query

filterstring

Specify a filter based on which the results will be fetched. All the fields are supported except: organizationId, createdTime, lastUpdatedTime

The examples below show some search queries

- id=="57efb0e6-5af0-4245-a67d-d3c5045cdb6e"
- id!="57efb0e6-5af0-4245-a67d-d3c5045cdb6e"
- id=in=("57efb0e6-5af0-4245-a67d-d3c5045cdb6e","a421e0b2-732e-46f3-a057-39160a53afb9")
- id=out=("57efb0e6-5af0-4245-a67d-d3c5045cdb6e","a421e0b2-732e-46f3-a057-39160a53afb9")

This parameter uses the RSQL query syntax, a URI-friendly format for expressing criteria for filtering REST entities. For more information about RSQL in general, see [this reference](https://www.here.com/docs/bundle/data-client-library-developer-guide-java-scala/page/client/rsql.html). For a list of supported operators, see [this syntax guide](https://github.com/perplexhub/rsql-jpa-specification#rsql-syntax-reference).

Note: values to be used in the filter syntax should not contain spaces. If they do, please enclose them in quotes to apply the filter.

example = "id=="2f9eecc5-0472-4549-9a83-2afdae0d4ba1""

attributesstring

Specify the attributes to be returned. By default, all attributes are returned along with the specified columns. All attributes are supported. except (links)

example = "id"

searchstring

Filter data based on the search keyword.Supported search columns(dialledNumber)

The examples below show some search queries

- "Cisco"
- field=="dialledNumber";value=="Cisco"
- fields=in=("dialledNumber");value=="Cisco"

example = "contact center"

pageinteger

Defines the number of displayed page. The page number starts from 0.

default = 0

pageSizeinteger

Defines the number of items to be displayed on a page. If the number specified is more than allowed max page size, the API will automatically adjust the page size to the max page size.

example = 100, default = 100

includeEntryPointNameboolean

If includeEntryPointName is set to true and entryPointName is in the attributes, the API will return entryPointName in the Get All response, and filtering, searching, and sorting on entryPointName will also be enabled.

default = false

## Responses

Status: 200

OK

Schema DefinitionExample Body

- -object





  - meta:object

  - +data:object\[\]

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
    "meta": {},
    "data": [\
        {\
            "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
            "id": "93912f11-6017-404b-bf14-5331890b1797",\
            "version": 1,\
            "dialledNumber": "+1-1234567890",\
            "extension": 1234,\
            "routingPrefix": 91,\
            "esn": 919876,\
            "routePointId": "7cbd4aad-0c3b-4de4-a15a-33cf05b9bf8j",\
            "entryPointId": "7cbd4aad-0c3b-4de4-a15a-33cf05b9bf8j",\
            "entryPointName": "Entry-Point",\
            "defaultAni": true,\
            "location": "7cbd4aad-0c3b-4de4-a15a-33cf05b9bf8j",\
            "regionId": "7cbd4aad-0c3b-4de4-a15a-33cf05b9bf8j",\
            "createdTime": 0,\
            "lastUpdatedTime": 0,\
            "dialledNumberDigits": "string"\
        }\
    ]
}
```

Status: 401

Unauthorized Operation

Schema DefinitionExample Body

- -object


API Error Response containing error details.








  - trackingId:string


    An opaque identifier for mapping protocol failures to service internal codes. When specified in a request, it can be used for correlating events across services.

  - +error:object


    Detailed error information including a set of error messages.




    - key:string


      An application-defined error code.

    - reason:string


      Reason for the failure.

    - +message:object\[\]


      A set of error messages.




      - description:string


        A human-readable explanation for the occurrence of an error

      - entity:string


        The entity on which the error occurred

      - +references:object\[\]


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

- -object


API Error Response containing error details.








  - trackingId:string


    An opaque identifier for mapping protocol failures to service internal codes. When specified in a request, it can be used for correlating events across services.

  - +error:object


    Detailed error information including a set of error messages.




    - key:string


      An application-defined error code.

    - reason:string


      Reason for the failure.

    - +message:object\[\]


      A set of error messages.




      - description:string


        A human-readable explanation for the occurrence of an error

      - entity:string


        The entity on which the error occurred

      - +references:object\[\]


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

- -object


API Error Response containing error details.








  - trackingId:string


    An opaque identifier for mapping protocol failures to service internal codes. When specified in a request, it can be used for correlating events across services.

  - +error:object


    Detailed error information including a set of error messages.




    - key:string


      An application-defined error code.

    - reason:string


      Reason for the failure.

    - +message:object\[\]


      A set of error messages.




      - description:string


        A human-readable explanation for the occurrence of an error

      - entity:string


        The entity on which the error occurred

      - +references:object\[\]


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

Status: 429

Too many requests have been sent in a given amount of time and the request has been rate limited

Schema DefinitionExample Body

- -object


API Error Response containing error details.








  - trackingId:string


    An opaque identifier for mapping protocol failures to service internal codes. When specified in a request, it can be used for correlating events across services.

  - +error:object


    Detailed error information including a set of error messages.




    - key:string


      An application-defined error code.

    - reason:string


      Reason for the failure.

    - +message:object\[\]


      A set of error messages.




      - description:string


        A human-readable explanation for the occurrence of an error

      - entity:string


        The entity on which the error occurred

      - +references:object\[\]


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

- -object


API Error Response containing error details.








  - trackingId:string


    An opaque identifier for mapping protocol failures to service internal codes. When specified in a request, it can be used for correlating events across services.

  - +error:object


    Detailed error information including a set of error messages.




    - key:string


      An application-defined error code.

    - reason:string


      Reason for the failure.

    - +message:object\[\]


      A set of error messages.




      - description:string


        A human-readable explanation for the occurrence of an error

      - entity:string


        The entity on which the error occurred

      - +references:object\[\]


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

GET/organization//v3/dial-number

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
--url https://api.wxcc-us1.cisco.com/organization//v3/dial-number \
--header 'Authorization: Bearer ' \
--header 'Accept: */*'
```

```python
Copyimport requests

url = "https://api.wxcc-us1.cisco.com/organization//v3/dial-number"

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
    url: 'https://api.wxcc-us1.cisco.com/organization//v3/dial-number',
    headers,
    body,
};

request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
```