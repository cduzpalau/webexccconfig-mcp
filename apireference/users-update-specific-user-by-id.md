[Home](https://developer.webex.com/)/[Users](https://developer.webex.com/webex-contact-center/docs/api/v1/users)/Update specific User by ID

Webex Contact Center

Version 1

Users

# Update specific User by ID

**Operation Id:** updateConfig\_3

**Description:**

Update an existing User by ID in a given organization.

PUT/organization/ **{orgid}/user/{id}**

## Request Parameters

#### Path

orgidrequiredstring

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

example = "2f9eecc5-0472-4549-9a83-2afdae0d4ba1"

idrequiredstring

Resource ID of the User.

example = "2f9eecc5-0472-4549"

#### Request body

Schema DefinitionExample Body

- -UserDTO





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
    "userProfileId": "1dq21e23-1234-5578-9a83-2afdae0d4ba1",
    "contactCenterEnabled": true,
    "timezone": "America/New_York",
    "xspVersion": "xsp-24.0",
    "subscriptionId": "04d0bdf6-6d6a-4aae-8a8a-71c9152e6478",
    "siteId": "8e6bb6da-2a78-4768-bef9-7e229f92af22",
    "teamIds": [\
        "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
        "a53c8b54-46ca-43f6-ba05-08426a46e23f"\
    ],
    "skillProfileId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "agentProfileId": "8e6bb6da-2a78-4768-bef9-7e229f92af22",
    "multimediaProfileId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
    "deafultDialledNumber": "1234567890",
    "externalIdentifier": "121212",
    "active": true,
    "imiUserCreated": false,
    "preferredSupervisorTeamId": "2f9eecc5-0472-4549-9a83-2afdae0d4ba1",
    "userLevelBurnoutInclusion": "INCLUDED",
    "userLevelAutoCSATInclusion": "INCLUDED",
    "userLevelWellnessBreakReminders": "DISABLED",
    "userLevelSummariesInclusion": "INCLUDED"
}
```

## Responses

Status: 200

OK

Select Example

application/hal+json

Schema DefinitionExample Body

- -UserResponseDTO





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

  - +queuesCount:QueuesCountDTO


    The count of each type of Contact Service Queues that the user is assigned to.




    - agentBased:integer

    - skillBased:integer

    - teamBased:integer
  - +userProfileData:UserProfileDTO


    Details of UserProfile which a Contact Center administrator has configured for the user.This is an optional object, returned only when the endpoint 'Get User along with profile by ID' is invoked.




    - createdTime:integerreadOnly


      Creation time(in epoch millis) of this resource.

    - lastUpdatedTime:integerreadOnly


      Time(in epoch millis) when this resource was last updated.

    - version:integer


      The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

    - accessAllEntryPoints\*:string


      Allow users of this profile access to specific or all the entry points for an organization.



      It can take one of these values:



      ALL — A contact center user with this profile can access all the entry points for an organization.



      SPECIFIC — A contact center user with this profile can access only specific entry points for an organization.



      enum = \["SPECIFIC", "ALL", "PROVISIONED\_VALUE", "NONE"\]

    - accessAllModules\*:string


      This can be used to allow users of this profile access to specific or all the Webex Contact Center modules.



      It can take one of these values:



      ALL — A contact center user with this profile can access all Contact Center modules.



      SPECIFIC — A contact center user with this profile can access only specific modules.



      enum = \["SPECIFIC", "ALL", "PROVISIONED\_VALUE", "NONE"\]

    - accessAllQueues\*:string


      Allow users of this profile access to specific or all the contact center queues for an organization.



      It can take one of these values:



      ALL — A contact center user with this profile can access all the contact center queues for an organization.



      SPECIFIC — A contact center user with this profile can access only specific contact center queues for an organization.



      enum = \["SPECIFIC", "ALL", "PROVISIONED\_VALUE", "NONE"\]

    - accessAllSites\*:string


      Allow users of this profile access to specific or all the sites for an organization.



      It can take one of these values:



      ALL — A contact center user with this profile can access all the sites for an organization.



      SPECIFIC — A contact center user with this profile can access only specific sites for an organization.



      enum = \["SPECIFIC", "ALL", "PROVISIONED\_VALUE", "NONE"\]

    - accessAllTeams\*:string


      Allow users of this profile access to specific or all the contact center teams for an organization.



      It can take one of these values:



      ALL — A contact center user with this profile can access all the contact center teams for an organization.



      SPECIFIC — A contact center user with this profile can access only specific contact center teams for an organization.



      enum = \["SPECIFIC", "ALL", "PROVISIONED\_VALUE", "NONE"\]

    - description:string


      An optional description of the profile.

    - id:string


      ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

    - name\*:string


      The name of the user profile.

    - organizationId:string


      ID of the contact center organization. It is required to define for the following operations - All bulk save operations

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

    - active\*:boolean


      Specify whether the User profile is active or not.

    - systemDefault:boolean


      Indicates whether the created resource is system created or not

    - editableFolderIds:integer\[\]


      Indicates the id(s) of the reporting folders a user of this profile has read and write access to.

    - entryPoints:string\[\]


      Specify the id(s) of the entry point(s) a user of this profile will have access to.



      It should be chosen when entry points access is SPECIFIC. Please see '''Entry Point documentation''', and use Get EntryPoints API to fetch the values of entry points.

    - nonViewableFolderIds:integer\[\]


      Indicates the id(s) of the restricted reporting folders for a user of this profile.

    - queues:string\[\]


      Specify the id(s) of the queue(s) a user of this profile will have access to.

      It should be chosen when queues access is SPECIFIC. Please see Queues documentation, and use Get Queues API to fetch the values of queue IDs.

    - sites:string\[\]


      Specify the id(s) of the site(s) a user of this profile will have access to.

      It should be chosen when sites access is SPECIFIC. Please see Sites documentation, and use Get Site API to fetch the values of site IDs.

    - teams:string\[\]


      Specify the id(s) of the team(s) a user of this profile will have access to.

      It should be chosen when teams access is SPECIFIC. Please see Teams documentation, and use Get Teams API to fetch the values of team IDs.

    - viewableFolderIds:integer\[\]


      Indicates the id(s) of the reporting folders a user of this profile has read access to.

    - +userProfileAppModules:UserProfileAppModuleDTO\[\]


      Specifies the module(s) a user of this profile has access to.



      It should be chosen when module access is SPECIFIC.



      Please specify all the following modules and their respective access type.




      - createdTime:integerreadOnly


        Creation time(in epoch millis) of this resource.

      - lastUpdatedTime:integerreadOnly


        Time(in epoch millis) when this resource was last updated.

      - version:integer


        The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

      - appModuleId\*:string


        The code of a Webex Contact Center module.



        Please specify descriptions for each of these modules:



        m\_provisioning - Refers to the provisioning module. Has access to Manage EntryPoints and Queues\[f\_manage\_entrypt\_queue\], Revoke API Key\[f\_revoke\_api\_key\], DN Mappings\[f\_dn\_mappings\], Manage User Profiles\[f\_manage\_user\_profiles\], Manage Tenants\[f\_manage\_tenants\], Manage Users\[f\_manage\_users\], Portal Branding\[f\_portal\_branding\], Audit Trail\[f\_audit\_trail\], Manage Sites\[f\_manage\_sites\], Manage Teams\[f\_manage\_teams\], and Manage Dial Plans\[f\_manage\_dial\_plans\] features.



        m\_real\_time\_reports - Refers to the real time reporting module. Has access to Summary View\[f\_summary\_view\], Agent State Change\[f\_agent\_state\_change\], Real Time Threshold Alerts\[f\_realtime\_threshold\_alerts\], and Web CallBack Report\[f\_web\_callback\_report\] features.



        m\_historical\_reports - Refers to the historical reporting module.



        m\_routing\_strategy - Refers to the routing strategy module. Has access to Manage Media Files\[f\_manage\_media\_files\] and Manage Call Flow Scripts\[f\_manage\_call\_flow\_scripts\] features.



        m\_call\_recording - Refers to the call recording module.



        m\_call\_monitoring - Refers to the call monitoring module. Has access to Barge In\[f\_barge\_in\], View Blind Monitor Request\[f\_view\_blind\_monitor\_requests\], Whisper Coach\[f\_whisper\_coach\], Mid Call Monitor\[f\_mid\_call\_monitor\], and Restricted Monitor\[f\_restricted\_monitor\_only\] features.



        m\_reporting\_analytics - Refers to the reporting analytics module. Has access to Analyzer Data Exchange\[f\_analyzer\_data\_exchange\] and Business Rules\[f\_business\_rules\] features.



        m\_recording\_management - Refers to the recording management module. Has access to Tags\[f\_tags\], Security Keys\[f\_security\_keys\], Manage Recordings\[f\_manage\_recordings\], and Custom Attributes\[f\_custom\_attributes\] features.



        m\_agent\_desktop - Refers to the agent desktop module.



        m\_logout\_agents - Refers to the agent logout module.



        m\_manage\_agent\_states - Refers to the agent state module. Has access to Sign Out Agent\[f\_sign\_out\_agent\] and Change Agent State\[f\_change\_agent\_state\] features.



        m\_additional\_supervisory\_features - Refers to the additional supervisory features module. Has access to Sign Out Agents\[f\_sign\_out\_agents\], Change Agent States\[f\_change\_agent\_states\] and Send Messages\[f\_send\_messages\] features.



        m\_multimedia - Refers to the multimedia module. Has access to Provisioning\[f\_mm\_provisioning\], Basic Digital\[f\_mm\_basic\_digital\], Social Channel\[f\_mm\_social\_channel\] and Agent Desktop\[f\_mm\_agent\_desktop\] features.



        m\_agent\_wellbeing - Refers to the Agent Wellbeing module. Has access to Agent Wellbeing provisioning features.



        m\_auto\_csat - Refers to the Auto Csat module.



        m\_generated\_summaries - Refers to the Generated Summaries module.



        m\_agent\_personal\_greetings - Refers to the Agent Personal Greetings module.



        m\_functions - Refers to the Functions in flow module.



        m\_realtime\_transcripts - Refers to the Realtime Transcripts module.



        m\_suggested\_responses - Refers to the Suggested Responses module.

      - id:string


        ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

      - moduleAccessType\*:string


        Indicates the access rights for a user of this profile for a Webex Contact Center module.



        It can take be one of these values:



        VIEW — A contact center user with this profile has read only access to a Contact Center module.



        EDIT — A contact center user with this profile has read and write access to a Contact Center module.



        NONE — A contact center user with this profile cannot access the module.



        enum = \["NONE", "VIEW", "EDIT"\]

      - organizationId:string


        ID of the contact center organization. It is required to define for the following operations - All bulk save operations

      - +userProfileAppFeature:UserProfileAppFeatureDTO\[\]


        Specifies the module features(s) a user of this profile has access to.




        - createdTime:integerreadOnly


          Creation time(in epoch millis) of this resource.

        - lastUpdatedTime:integerreadOnly


          Time(in epoch millis) when this resource was last updated.

        - version:integer


          The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

        - appFeatureId\*:string


          The feature code of a Webex Contact Center module.



          Please add all the following features with their respective modules and set it's featureAccessType to 'ON' or 'OFF', to specify if it is in use. Here is the complete list of Feature names and Feature Ids:



          For module 'm\_additional\_supervisory\_features' we have the following features:



          Change Agent States : f\_change\_agent\_states



          Sign out Agents : f\_sign\_out\_agents



          Send Messages : f\_send\_messages



          Re-skill Agents : f\_reskill\_agents



          Manage agent based queues : f\_manage\_agent\_queue\_assignments



          For module 'm\_real\_time\_reports' we have the following features:



          Real Time Threshold Alerts : f\_realtime\_threshold\_alerts



          Agent State Change : f\_agent\_state\_change



          Summary View : f\_summary\_view



          Web Callback Report : f\_web\_callback\_report



          For module 'm\_multimedia' we have the following features:



          MM Agent Desktop : f\_mm\_agent\_desktop



          Basic Digital : f\_mm\_basic\_digital



          MM Provisioning : f\_mm\_provisioning



          Social Channel : f\_mm\_social\_channel



          For module 'm\_reporting\_analytics' we have the following features:



          Analyzer Data Exchange : f\_analyzer\_data\_exchange



          Business Rules : f\_business\_rules



          For module 'm\_manage\_agent\_states' we have the following features:



          Change Agent State : f\_change\_agent\_state



          Sign Out Agent : f\_sign\_out\_agent



          For module 'm\_recording\_management' we have the following features:



          Custom Attributes : f\_custom\_attributes



          Manage Recordings : f\_manage\_recordings



          Tags : f\_tags



          Security Keys : f\_security\_keys



          For module 'm\_routing\_strategy' we have the following features:



          Manage Call Flow Scripts : f\_manage\_call\_flow\_scripts



          Manage Media Files : f\_manage\_media\_files



          For module 'm\_provisioning' we have the following features:



          Manage EntryPoints and Queues : f\_manage\_teams



          Manage Users : f\_manage\_users



          DN Mappings : f\_dn\_mappings



          Manage Sites : f\_manage\_sites



          Manage Teams : f\_manage\_teams



          Manage User Profiles : f\_manage\_user\_profiles



          Revoke API Key : f\_revoke\_api\_key



          Manage Dial Plans : f\_manage\_dial\_plans



          Manage Tenants : f\_manage\_tenants



          Manage Entry Points and Queues : f\_manage\_entrypt\_queue



          Portal Branding : f\_portal\_branding



          Audit Trail : f\_audit\_trail



          Manage Business Hours : f\_manage\_business\_hours



          For module 'm\_call\_monitoring' we have the following features:



          Mid Call Monitoring : f\_mid\_call\_monitor



          Barge In : f\_barge\_in



          Restricted Monitor : f\_restricted\_monitor\_only



          Whisper Coach : f\_whisper\_coach



          View Blind Monitor Request : f\_view\_blind\_monitor\_requests

        - appFeatureName:string


          The feature name of the Webex Contact Center module.

        - featureAccessType\*:string


          Indicates whether a user of this profile has access to a module feature.



          It can be one of these values:



          OFF — A contact center user with this profile cannot access this module feature.



          ON — A contact center user with this profile can access this module feature.



          enum = \["OFF", "ON"\]

        - id:string


          ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

        - organizationId:string


          ID of the contact center organization. It is required to define for the following operations - All bulk save operations
  - +userProfileGranularAccessData:UserProfileGranularAccessDTO

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

    - +permissions:UserProfilePermissionsDTO\[\]


      Specifies the permissions(s) a user of this profile has access to.



      It should be chosen when permission access is SPECIFIC.



      Please specify all the following permissions and their respective access type.




      - access:string


        enum = \["EDIT", "VIEW", "NONE", "ENABLED", "DISABLED"\]

      - id:string

      - name\*:string
    - +resourceCollections:ResourceCollectionDTO\[\]


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

      - +resources:ResourceTypesDTO\[\]

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
    "userProfileData": {
        "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",
        "id": "93912f11-6017-404b-bf14-5331890b1797",
        "version": 1,
        "name": "Contact Center Admin Profile",
        "description": "This profile should be applied only to contact center admins.",
        "profileType": "PREMIUM_AGENT",
        "accessAllModules": "ALL",
        "userProfileAppModules": [\
            {\
                "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
                "id": "93912f11-6017-404b-bf14-5331890b1797",\
                "version": 1,\
                "appModuleId": "m_provisioning",\
                "moduleAccessType": "EDIT",\
                "userProfileAppFeature": [\
                    {\
                        "organizationId": "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
                        "id": "93912f11-6017-404b-bf14-5331890b1797",\
                        "version": 1,\
                        "appFeatureId": "f_manage_sites",\
                        "appFeatureName": "Manage Sites",\
                        "featureAccessType": "ON",\
                        "createdTime": 1617536244000,\
                        "lastUpdatedTime": 1617536244000\
                    }\
                ],\
                "createdTime": 1617536244000,\
                "lastUpdatedTime": 1617536244000\
            }\
        ],
        "accessAllEntryPoints": "ALL",
        "accessAllSites": "ALL",
        "accessAllQueues": "ALL",
        "accessAllTeams": "ALL",
        "active": true,
        "editableFolderIds": [ 1, 2 ],
        "viewableFolderIds": [ 1, 2 ],
        "nonViewableFolderIds": [ 1, 2 ],
        "systemDefault": false,
        "createdTime": 1617536244000,
        "lastUpdatedTime": 1617536244000,
        "entryPoints": [\
            "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
            "a53c8b54-46ca-43f6-ba05-08426a46e23f"\
        ],
        "sites": [\
            "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
            "a53c8b54-46ca-43f6-ba05-08426a46e23f"\
        ],
        "queues": [\
            "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
            "a53c8b54-46ca-43f6-ba05-08426a46e23f"\
        ],
        "teams": [\
            "f53c8b54-46ca-43f6-ba05-08426a46e23d",\
            "a53c8b54-46ca-43f6-ba05-08426a46e23f"\
        ]
    },
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

Status: 412

Resource referred in other entity(s). Please get all the reference entities info by invoking Get incoming-references api.

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

PUT/organization//user/ **{id}**

orgid\*

Organization ID to be used for this operation. The specified security token must have permission to interact with the organization.

id\*

Resource ID of the User.

Request Body (Form)Request Body (JSON)

UserDTO

organizationId

ID of the contact center organization. It is required to define for the following operations - All bulk save operations

id

ID of this contact center resource. It should not be specified when creating a new resource. However, it is mandatory when updating a resource.

version

The version of this resource. For a newly created resource, it will be 0 unless specified otherwise.

firstName\*

The first name of the user. Can be changed using Users Management in Cisco Webex Control Hub.

lastName\*

The last name of the user. Can be changed using Users Management in Cisco Webex Control Hub.

email\*

The email address of the user. Can be changed using Users Management in Cisco Webex Control Hub.

workPhone

The work phone number of the user.

mobile

The mobile phone number of the user.

ciUserId\*

Cisco Common Identity user Id. Existence of a CI user is a prerequisite to create a new WxCC user. It cannot be modified.

broadCloudUserId

Broadcloud user Id. This field cannot be modified.

userProfileId\*

Identifier for an user profile which a Contact Center administrator has configured. Changing the profile type requires a token with `FLS:Read_Scope` scope. As of today, changing the profile type for a user is supported only from Cisco Webex Control Hub.

The setting is for accessing the Agent Desktop to handle customer requests.

contactCenterEnabled

timezone

(Optional) The time zone that you provision for your enterprise.

xspVersion

(Optional) Used to subscribe for recording events. This field cannot be modified.

subscriptionId

(Optional) Used to subscribe for recording events. This field cannot be modified.

siteId\*

(Optional) Identifier for a site which is a physical contact center location under the control of your enterprise. This field is applicable only when contactCenterEnabled is true.

teamIds

Specify the teams id which got assigned to this user.

Note: You can’t assign this profile to a capacity-based team. This field is applicable only when contactCenterEnabled is true.

Add teamIds

skillProfileId

(Optional) If your enterprise uses the optional Skills-Based Routing feature, This profile overrides any skill profile at the team level that is associated with the agent.This field is applicable only when contactCenterEnabled is true.

agentProfileId\*

Identifier for a Desktop Profile which is a group of permissions and Agent Desktop behaviors that you assign to specific users. This field is applicable only when contactCenterEnabled is true.

multimediaProfileId

(Optional) If your organization administrator enables Multimedia for your enterprise, you can select a multimedia profile for this team. This field is applicable only when contactCenterEnabled is true.

deafultDialledNumber

(Optional) The dial number of the agent. This field is applicable only when contactCenterEnabled is true.

externalIdentifier

(Optional) Agent identification details, such as the employee number.

Indicates whether the user is active or not active. Can be changed using Users Management in Cisco Webex Control Hub.

active

(Optional) Indicates whether this user has a corresponding user created in IMI digital channel. This field cannot be modified.

imiUserCreated

preferredSupervisorTeamId

(Optional) Indicates the id of a preferred supervisor.

userLevelBurnoutInclusion

User level burnout inclusion type. Used only when Agent inclusion is set to 'Specific Agents' at the org level Agent Wellbeing>Burnout config.

During entity creation(single or bulk), if this parameter is not provided or null, default will be set to 'EXCLUDED'

During entity update(single or bulk), if this parameter is not provided or null, the previous value will be retained. Valid values are 'INCLUDED', 'EXCLUDED'

INCLUDEDEXCLUDED

userLevelAutoCSATInclusion

User level AutoCSAT inclusion type. Used only when Agent inclusion is set to 'Specific Agents' at the org level Cisco AI Assistant>Auto CSAT config.

During entity creation(single or bulk), if this parameter is not provided or null, default will be set to 'EXCLUDED'

During entity update(single or bulk), if this parameter is not provided or null, the previous value will be retained. Valid values are 'INCLUDED', 'EXCLUDED'

INCLUDEDEXCLUDED

userLevelWellnessBreakReminders

User level Wellness break reminder type. If top level Agent burnout config has wellness break reminders enabled, this property determines if an Agent is enabled/disabled for receiving break reminders.

. Valid values are 'DISABLED', 'ENABLED'

DISABLEDENABLED

userLevelSummariesInclusion

User level Generated Summaries inclusion type. Used only when Generated Summaries is set to 'Specific Agents' at the org level Cisco AI Assistant>Generated Summaries.

During entity creation(single or bulk), if this parameter is not provided or null, default will be set to 'EXCLUDED'

During entity update(single or bulk), if this parameter is not provided or null, the previous value will be retained. Valid values are 'INCLUDED', 'EXCLUDED'

INCLUDEDEXCLUDED

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
Copycurl -L --request PUT \
--url https://api.wxcc-us1.cisco.com/organization//user/{id} \
--header 'Authorization: Bearer ' \
--header 'Content-Type: application/json' \
--header 'Accept: application/hal+json' \
--data '{}'
```

```python
Copyimport requests

url = "https://api.wxcc-us1.cisco.com/organization//user/{id}"

payload = '''{}'''

headers = {
    "Authorization": "Bearer ",
    "Content-Type": "application/json",
    "Accept": "application/hal+json"
}

response = requests.request('PUT', url, headers=headers, data = payload)

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
    method: 'PUT',
    url: 'https://api.wxcc-us1.cisco.com/organization//user/{id}',
    headers,
    body,
};

request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
});
```