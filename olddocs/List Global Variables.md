Version 2

Global Variables	

# List Global Variable(s)

**Operation Id:** getAllConfigWithMetaData\_31

**Description:**

Retrieve a list of Global Variable(s) in a given organization.

**Method**
GET

**Endpoint**
{WEBEX_BASE_URL}/organization/{WEBEX_ORG_ID}/v2/cad-variable

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

Note: values to be used in the filter syntax should not contain space, and if so kindly bound it with quotes to apply filter.

example = "id=="2f9eecc5-0472-4549-9a83-2afdae0d4ba1""

attributesstring

Specify the attributes to be returned.Default all attributes are returned along with specified columns. All Attributes are supported

example = "id"

searchstring

Filter data based on the search keyword.Supported search columns(name)

The examples below show some search queries

- "Cisco"
- field=="name";value=="Cisco"
- fields=in=("name");value=="Cisco"

example = "contact center"

pageinteger

Defines the number of displayed page. The page number starts from 0.

default = 0

pageSizeinteger

Defines the number of items to be displayed on a page. If the number specified is more than allowed max page size, the API will automatically adjust the page size to the max page size.

example = 100, default = 100

## Responses

Status: 200

OK

Schema Definition

- -ResponseEnvelopeCadVariableDTO

  - meta:object

  - +data:CadVariableDTO\[\]

    - createdTime:integerreadOnly


      Creation time(in epoch millis) of this resource.

    - lastUpdatedTime:integerreadOnly


      Time(in epoch millis) when this resource was last updated.

    - version:integer


      The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

    - defaultValue\*:string


      A default value for the Global Variable.

    - description:string


      A the description for the Global Variable created.

    - desktopLabel:string


      A desktop label for the Global Variable created.

    - id:string


      ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

    - name\*:string


      A name for the Global Variable.

    - organizationId:string


      ID of the contact center organization. It is required to define for the following operations - All bulk save operations

    - variableType\*:string


      A valid Global Variable Type. The valid types are: String, Integer, DateTime, Boolean, Decimal.

      enum = \["STRING", "INTEGER", "DATE\_TIME", "BOOLEAN", "DECIMAL", ...\]

    - active\*:boolean


      Indicates whether the Global Variable is active or not.

    - agentEditable\*:boolean


      Indicates whether the Global Variable is editable in the Agent Desktop by the agent or not.

    - agentViewable\*:boolean


      Indicates whether the agent can view the Global Variable in Agent Desktop or not.

    - reportable\*:boolean


      Indicates whether the Global Variable is reportable or not.

    - sensitive:boolean


      Indicates whether the Global Variable is sensitive or not.

    - systemDefault:boolean


      Indicates whether the created resource is system created or not


Example Body

```json
{
    "meta": {},
    "data": [
        {
            "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
            "id": "93912f11-6017-404b-bf14-5331890b1797",
            "version": 1,
            "name": "Global Variable",
            "description": "Global Variable to describe meta-data.",
            "active": true,
            "agentEditable": true,
            "variableType": "INTEGER",
            "defaultValue": "Default Value",
            "reportable": false,
            "agentViewable": true,
            "sensitive": true,
            "desktopLabel": "Desktop Label",
            "systemDefault": false,
            "createdTime": 1617536244000,
            "lastUpdatedTime": 1617536244000
        }
    ]
}
```
