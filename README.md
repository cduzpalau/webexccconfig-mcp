# webexccconfig-mcp
Webex Contact Center configuration MCP server

## Available Webex Contact Center Configuration APIs

| API Name | Description | Resource Path |
| :--- | :--- | :--- |
| **Address Book** | Manage address books for agents to make outbound calls from the agent desktop. | `/v1/address-book` |
| **Agent Personal Greeting** | Manage personal greetings that agents can set for their interactions. | `/v1/agent-personal-greeting` |
| **AI** | Access and configure AI-related features and capabilities within the contact center. | `/v1/ai` |
| **Audio Files** | Manage audio prompts, music on hold, and other recordings. | `/v1/audio-files` |
| **Auxiliary Code** | Define idle and wrap-up codes for tracking agent status (e.g., Lunch, Meeting, Break). | `/v1/auxiliary-code` |
| **Business Hours** | Configure operating schedules and holidays for queues and entry points. | `/v1/business-hours` |
| **Contact Number** | Manage dialable telephone numbers associated with the contact center. | `/v1/contact-number` |
| **Contact Service Queues** | Manage inbound holding places where customer requests wait for available agents. | `/v1/contact-service-queues` |
| **Desktop Layout** | Configure the visual structure and widgets available on the Agent Desktop. | `/v1/desktop-layout` |
| **Desktop Profile** | Assign specific settings, layouts, and capabilities to groups of agents. | `/v1/desktop-profile` |
| **Dial Number** | Manage specific numbers used for internal and external routing. | `/v1/dial-number` |
| **Dial Plan** | Define rules for outgoing call routing and number formatting. | `/v1/dial-plan` |
| **Entry Point** | Define the starting points for contacts (e.g., specific phone numbers or chat buttons). | `/v1/entry-point` |
| **Global Variables** | Manage variables that can be accessed and modified across different call flows. | `/v1/global-variables` |
| **Multimedia Profile** | Define how agents handle different media types, such as voice, chat, and email. | `/v1/multimedia-profile` |
| **Outdial ANI** | Configure Automatic Number Identification settings for outbound campaigns. | `/v1/outdial-ani` |
| **Resource Collection** | Organize and manage logical collections of related system resources. | `/v1/resource-collection` |
| **Site** | Manage physical or logical locations of contact center resources. | `/v1/site` |
| **Skill** | Define specific expertise (e.g., language fluency) required for routing requests. | `/v1/skill` |
| **Skill Profile** | Bundle multiple skills together to be assigned to agents. | `/v1/skill-profile` |
| **Team** | Manage groups of agents who support specific business functions or queues. | `/v1/team` |
| **User Profiles** | Manage permissions and configurations for various user roles. | `/v1/user-profiles` |
| **Users** | Manage the actual people (agents, supervisors, managers) in the system. | `/v1/users` |
| **Work Types** | Categorize different types of work handled by the contact center. | `/v1/work-types` |

## Detailed API Implementation Status

### Skill
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export Skill(s) | Export all Skill(s) in a given organization. | [`/organization/{orgId}/skill/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/skill/bulk-export-skills) | `Bulk_Export_Skills` |
| Bulk save Skill(s) | Create, Update or delete Skill(s) in bulk. | [`/organization/{orgid}/skill/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/skill/bulk-save-skills) | `Bulk_Save_Skills` |
| Create a new Skill | Create a new Skill in a given organization. | [`/organization/{orgid}/skill`](https://developer.webex.com/webex-contact-center/docs/api/v1/skill/create-a-new-skill) | `Create_Skill` |
| Create a new Skill Profile | Create a new Skill Profile in Webex Contact Center. | [`/organization/{orgid}/skill-profile`](https://developer.webex.com/webex-contact-center/docs/api/v1/skill-profile/create-a-new-skill-profile) | `Create_Skill_Profile` |
| Delete specific Skill by ID | Delete an existing Skill by ID. | [`/organization/{orgid}/skill/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/skill/delete-specific-skill-by-id) | `Delete_Skill` |
| Get specific Skill by ID | Retrieve an existing Skill by ID. | [`/organization/{orgid}/skill/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/skill/get-specific-skill-by-id) | `Get_Skill_by_ID` |
| List references for a specific Skill | Retrieve a list of all entities that have reference. | [`/organization/{orgid}/skill/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/skill/list-references-for-a-specific-skill) | `List_Skill_References` |
| List Skill(s) (v1) | Retrieve a list of Skill(s). | [`/organization/{orgid}/skill`](https://developer.webex.com/webex-contact-center/docs/api/v1/skill/list-skills) | `List_Skills` |
| List Skill(s) (v2) | Retrieve a list of Skill(s) (optimized). | [`/organization/{orgid}/v2/skill`](https://developer.webex.com/webex-contact-center/docs/api/v1/skill/list-skills) | `List_Skills` |
| Purge inactive Skill(s) | Purge inactive Skill(s) older than the configured interval. | [`/organization/{orgid}/skill/purge-inactive-entities`](https://developer.webex.com/webex-contact-center/docs/api/v1/skill/purge-inactive-skills) | `Purge_Inactive_Skills` |
| Update specific Skill by ID | Update an existing Skill by ID. | [`/organization/{orgid}/skill/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/skill/update-specific-skill-by-id) | `Update_Skill` |

### Team
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export Team(s) | Export all Team(s) in a given organization. | [`/organization/{orgId}/team/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/team/bulk-export-teams) | `Bulk_Export_Teams` |
| Bulk save Team(s) | Create, update, or delete Team(s) in bulk. | [`/organization/{orgId}/team/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/team/bulk-save-teams) | `Bulk_Save_Teams` |
| Create a new Team | Create a new Team in a given organization. | [`/organization/{orgId}/team`](https://developer.webex.com/webex-contact-center/docs/api/v1/team/create-a-new-team) | `Create_Team` |
| Delete specific Team by ID | Delete an existing Team by ID. | [`/organization/{orgId}/team/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/team/delete-specific-team-by-id) | `Delete_Team` |
| Get specific Team by ID | Retrieve an existing Team by ID. | [`/organization/{orgId}/team/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/team/get-specific-team-by-id) | `Get_Team_by_ID` |
| List references for a specific Team | Retrieve a list of all entities that have a reference. | [`/organization/{orgId}/team/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/team/list-references-for-a-specific-team) | `List_Team_References` |
| List Team(s) | Retrieve all Team(s) in a given organization (v2). | [`/organization/{orgId}/v2/team`](https://developer.webex.com/webex-contact-center/docs/api/v1/team/list-teams) | `List_Teams` |
| Purge inactive Team(s) | Purge inactive Team(s) older than the configured interval. | [`/organization/{orgId}/team/purge-inactive-entities`](https://developer.webex.com/webex-contact-center/docs/api/v1/team/purge-inactive-teams) | `Purge_Inactive_Teams` |
| Update specific Team by ID | Update an existing Team by ID. | [`/organization/{orgId}/team/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/team/update-specific-team-by-id) | `Update_Team` |

### Users
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export User(s) | Export all User(s) in a given organization. | [`/organization/{orgid}/user/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/users/bulk-export-users) | `Bulk_Export_Users` |
| Bulk partial update Users | Update properties for multiple users in bulk. | [`/organization/{orgid}/user/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/users/bulk-partial-update-users) | `Bulk_Partial_Update_Users` |
| Get specific User along with profile by ID | Retrieve an existing User along with UserProfile by ID. | [`/organization/{orgid}/user/with-user-profile/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/users/get-specific-user-along-with-profile-by-id) | `Get_User_With_Profile` |
| Get specific User by CI User ID | Retrieve an existing User using the CI ID. | [`/organization/{orgid}/v2/user/by-ci-user-id/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/users/get-specific-user-by-ci-user-id) | `Get_User_by_CI_ID` |
| Get specific User by ID | Retrieve an existing Users by ID. | [`/organization/{orgid}/user/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/users/get-specific-user-by-id) | `Get_User_by_ID` |
| Get specific Users by provided IDs | Retrieve an existing User's details by list of IDs. | [`/organization/{orgid}/user/fetch-user-details-by-ids`](https://developer.webex.com/webex-contact-center/docs/api/v1/users/get-specific-users-by-provided-ids) | `Get_Users_by_IDs` |
| Get the agents matching skill requirements criteria | Fetch the agents who match the provided skill requirements. | [`/organization/{orgid}/user/fetch-by-skill-requirements`](https://developer.webex.com/webex-contact-center/docs/api/v1/users/get-the-agents-matching-skill-requirements-criteria) | `Get_Agents_by_Skill_Requirements` |
| List references for a specific User | Retrieve a list of all entities that have reference. | [`/organization/{orgid}/user/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/users/list-references-for-a-specific-user) | `List_User_References` |
| List User(s) | Retrieve a list of User(s). | [`/organization/{orgid}/v2/user`](https://developer.webex.com/webex-contact-center/docs/api/v1/users/list-users) | `List_Users` |
| List Users along with profile | Retrieve a list of User(s) along with their UserProfiles. | [`/organization/{orgid}/user/with-user-profile`](https://developer.webex.com/webex-contact-center/docs/api/v1/users/list-users-along-with-profile) | `List_Users_With_Profile` |
| Partially update User by ID | Partially update User by ID. | [`/organization/{orgid}/user/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/users/partially-update-user-by-id) | `Partially_Update_User` |
| Update specific User by ID | Update an existing User by ID. | [`/organization/{orgid}/user/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/users/update-specific-user-by-id) | `Update_User` |

### Address Book
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| List Address Book(s) | Retrieves a list of address books. | [`/organization/{orgid}/v3/address-book`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book/list-address-books) | `List_Address_Books` |
| Create a new Address Book | Creates a new address book. | [`/organization/{orgid}/v3/address-book`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book/create-a-new-address-book) | `Create_Address_Book` |
| Get specific Address Book by ID | Retrieves a single address book's details. | [`/organization/{orgid}/v3/address-book/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book/get-specific-address-book-by-id) | `Get_Address_Book_by_ID` |
| Update specific Address Book by ID | Update an existing Address book. | [`/organization/{orgid}/v3/address-book/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book/update-specific-address-book-by-id) | `Update_Address_Book` |
| Delete specific Address Book by ID | Delete an address book. | [`/organization/{orgid}/v3/address-book/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book/delete-specific-address-book-by-id) | `Delete_Address_Book` |
| Bulk export Address Book(s) | Exports all address books and their entries. | [`/organization/{orgid}/address-book/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book/bulk-export-address-books) | `Bulk_Export_Address_Books` |
| List references for a specific Address Book | Lists entities that reference the address book. | [`/organization/{orgid}/address-book/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book/list-references-for-a-specific-address-book) | `List_Address_Book_References` |
| List Address Book Entry(s) | List entries for a specific address book. | [`/organization/{orgid}/v2/address-book/{addressBookId}/entry`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book/list-address-book-entrys) | `List_Address_Book_Entries` |
| Create a new Address Book Entry | Create a new entry. | [`/organization/{orgid}/address-book/{addressBookId}/entry`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book/create-a-new-address-book-entry) | `Create_Address_Book_Entry` |
| Get specific Address Book Entry by ID | Retrieve an entry by ID. | [`/organization/{orgid}/address-book/{addressBookId}/entry/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book/get-specific-address-book-entry-by-id) | `Get_Address_Book_Entry_by_ID` |
| Update specific Address Book Entry by ID | Update an entry by ID. | [`/organization/{orgid}/address-book/{addressBookId}/entry/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book/update-specific-address-book-entry-by-id) | `Update_Address_Book_Entry` |
| Delete specific Address Book Entry by ID | Delete an entry by ID. | [`/organization/{orgid}/address-book/{addressBookId}/entry/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book/delete-specific-address-book-entry-by-id) | `Delete_Address_Book_Entry` |
| Bulk save Address Book Entry(s) | Bulk operation on entries. | [`/organization/{orgid}/address-book/{addressBookId}/entry/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book/bulk-save-address-book-entrys) | `Bulk_Save_Address_Book_Entries` |

### Agent Personal Greeting
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Create a new Greeting File | Create a new agent personal greeting. | [`/organization/{orgid}/v2/agent-personal-greeting`](https://developer.webex.com/webex-contact-center/docs/api/v1/agent-personal-greeting/create-a-new-greeting-file) | `Create_Agent_Greeting` |
| Delete References 1 | Delete references for a greeting file. | [`/organization/{orgid}/agent-personal-greeting/delete-reference`](https://developer.webex.com/webex-contact-center/docs/api/v1/agent-personal-greeting/delete-references-1) | `Delete_Agent_Greeting_References` |
| Delete specific Greeting File by ID | Delete an existing Greeting File. | [`/organization/{orgid}/v2/agent-personal-greeting/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/agent-personal-greeting/delete-specific-greeting-file-by-id) | `Delete_Agent_Greeting` |
| Get All Config With Meta Data | Retrieve all configurations with meta data. | [`/organization/{orgid}/v2/agent-personal-greeting`](https://developer.webex.com/webex-contact-center/docs/api/v1/agent-personal-greeting/get-all-config-with-meta-data) | `List_Agent_Greetings_Meta` |
| Get specific Greeting File by ID | Retrieve an existing Greeting File. | [`/organization/{orgid}/v2/agent-personal-greeting/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/agent-personal-greeting/get-specific-greeting-file-by-id) | `Get_Agent_Greeting_by_ID` |
| List Greeting File(s) | Retrieve a list of Greeting File(s). | [`/organization/{orgid}/v3/agent-personal-greeting`](https://developer.webex.com/webex-contact-center/docs/api/v1/agent-personal-greeting/list-greeting-files) | `List_Agent_Greetings` |
| Partially update Greeting File by ID | Partially update Greeting File. | [`/organization/{orgid}/v2/agent-personal-greeting/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/agent-personal-greeting/partially-update-greeting-file-by-id) | `Partially_Update_Agent_Greeting` |
| Update specific Greeting File by ID | Update Greeting File. | [`/organization/{orgid}/agent-personal-greeting/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/agent-personal-greeting/update-specific-greeting-file-by-id) | `Update_Agent_Greeting` |

### Audio Files
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Create a new Audio File | Create a new Audio File. | [`/organization/{orgid}/audio-file`](https://developer.webex.com/webex-contact-center/docs/api/v1/audio-files/create-a-new-audio-file) | `Create_Audio_File` |
| Delete specific Audio File by ID | Delete an existing Audio File. | [`/organization/{orgid}/audio-file/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/audio-files/delete-specific-audio-file-by-id) | `Delete_Audio_File` |
| Get specific Audio File by ID | Retrieve the metadata for a specific Audio File. | [`/organization/{orgid}/audio-file/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/audio-files/get-specific-audio-file-by-id) | `Get_Audio_File_by_ID` |
| List Audio File(s) | List all the Audio Files available. | [`/organization/{orgid}/v2/audio-file`](https://developer.webex.com/webex-contact-center/docs/api/v1/audio-files/list-audio-files) | `List_Audio_Files` |
| List references for a specific Audio File | Retrieve entities referencing this audio file. | [`/organization/{orgid}/audio-file/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/audio-files/list-references-for-a-specific-audio-file) | `List_Audio_File_References` |
| Partially update Audio File by ID | Update specific fields. | [`/organization/{orgid}/audio-file/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/audio-files/partially-update-audio-file-by-id) | `Partially_Update_Audio_File` |
| Update specific Audio File by ID | Full update of an audio file. | [`/organization/{orgid}/audio-file/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/audio-files/update-specific-audio-file-by-id) | `Update_Audio_File` |

### Auxiliary Code
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export Auxiliary Code(s) | Export all Auxiliary Code(s). | [`/organization/{orgid}/auxiliary-code/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/auxiliary-code/bulk-export-auxiliary-codes) | `Bulk_Export_Auxiliary_Codes` |
| Bulk partial update Auxiliary Code(s) | Update properties in bulk. | [`/organization/{orgid}/auxiliary-code/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/auxiliary-code/bulk-partial-update-auxiliary-codes) | `Bulk_Partial_Update_Auxiliary_Codes` |
| Bulk save Auxiliary Code(s) | Create, update, delete in bulk. | [`/organization/{orgid}/auxiliary-code/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/auxiliary-code/bulk-save-auxiliary-codes) | `Bulk_Save_Auxiliary_Codes` |
| Create a new Auxiliary Code | Create a single Auxiliary Code. | [`/organization/{orgid}/auxiliary-code`](https://developer.webex.com/webex-contact-center/docs/api/v1/auxiliary-code/create-a-new-auxiliary-code) | `Create_Auxiliary_Code` |
| Delete specific Auxiliary Code by ID | Delete an Auxiliary Code. | [`/organization/{orgid}/auxiliary-code/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/auxiliary-code/delete-specific-auxiliary-code-by-id) | `Delete_Auxiliary_Code` |
| Get specific Auxiliary Code by ID | Retrieve existing details. | [`/organization/{orgid}/auxiliary-code/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/auxiliary-code/get-specific-auxiliary-code-by-id) | `Get_Auxiliary_Code_by_ID` |
| List Auxiliary Code(s) | Retrieve paginated list. | [`/organization/{orgid}/v2/auxiliary-code`](https://developer.webex.com/webex-contact-center/docs/api/v1/auxiliary-code/list-auxiliary-codes) | `List_Auxiliary_Codes` |
| List references for a specific Auxiliary Code | Find referencing entities. | [`/organization/{orgid}/auxiliary-code/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/auxiliary-code/list-references-for-a-specific-auxiliary-code) | `List_Auxiliary_Code_References` |
| Purge inactive Auxiliary Code(s) | Remove old inactive codes. | [`/organization/{orgid}/auxiliary-code/purge-inactive-entities`](https://developer.webex.com/webex-contact-center/docs/api/v1/auxiliary-code/purge-inactive-auxiliary-codes) | `Purge_Inactive_Auxiliary_Codes` |
| Update specific Auxiliary Code by ID | Fully update an existing code. | [`/organization/{orgid}/auxiliary-code/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/auxiliary-code/update-specific-auxiliary-code-by-id) | `Update_Auxiliary_Code` |

### Business Hours (Includes Holiday List & Overrides)
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Delete Business Hours | Delete Business Hours. | [`/organization/{orgid}/business-hours/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/business-hours/delete-specific-business-hours-resource-by-id) | `Delete_Business_Hours` |
| Get Business Hours | Retrieve Business Hours. | [`/organization/{orgid}/business-hours/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/business-hours/get-specific-business-hours-resource-by-id) | `Get_Business_Hours_by_ID` |
| List Business Hours | List Business Hours. | [`/organization/{orgid}/business-hours`](https://developer.webex.com/webex-contact-center/docs/api/v1/business-hours/list-business-hours-resources) | `List_Business_Hours` |
| List References (Business Hours) | List referencing entities. | [`/organization/{orgid}/business-hours/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/business-hours/list-references-for-a-specific-business-hours-resource) | `List_Business_Hours_References` |
| Delete Holiday List | Delete Holiday List. | [`/organization/{orgid}/holiday-list/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/holiday-list/delete-specific-holiday-list-by-id) | `Delete_Holiday_List` |
| Get Holiday List | Retrieve Holiday List. | [`/organization/{orgid}/holiday-list/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/holiday-list/get-specific-holiday-list-by-id) | `Get_Holiday_List_by_ID` |
| List Holiday List | List Holiday Lists. | [`/organization/{orgid}/holiday-list`](https://developer.webex.com/webex-contact-center/docs/api/v1/holiday-list/list-holiday-lists) | `List_Holiday_Lists` |
| List References (Holiday List) | List referencing entities. | [`/organization/{orgid}/holiday-list/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/holiday-list/list-references-for-a-specific-holiday-list) | `List_Holiday_List_References` |
| Delete Overrides | Delete Overrides. | [`/organization/{orgid}/overrides/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/overrides/delete-specific-overrides-resource-by-id) | `Delete_Overrides` |
| Get Overrides | Retrieve Overrides. | [`/organization/{orgid}/overrides/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/overrides/get-specific-overrides-resource-by-id) | `Get_Overrides_by_ID` |
| List Overrides | List Overrides. | [`/organization/{orgid}/overrides`](https://developer.webex.com/webex-contact-center/docs/api/v1/overrides/list-overrides-resources) | `List_Overrides` |
| List References (Overrides) | List referencing entities. | [`/organization/{orgid}/overrides/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/overrides/list-references-for-a-specific-overrides-resource) | `List_Overrides_References` |

### Contact Number
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export Contact Number(s) | Export all Contact Numbers. | [`/organization/{orgid}/contact-number/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-number/bulk-export-contact-numbers) | `Bulk_Export_Contact_Numbers` |
| Bulk save Contact Number(s) | Bulk operation on contact numbers. | [`/organization/{orgid}/contact-number/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-number/bulk-save-contact-numbers) | `Bulk_Save_Contact_Numbers` |
| Create a new Contact Number | Create a new Contact Number. | [`/organization/{orgid}/contact-number`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-number/create-a-new-contact-number) | `Create_Contact_Number` |
| Delete specific Contact Number by ID | Delete an existing Contact Number. | [`/organization/{orgid}/contact-number/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-number/delete-specific-contact-number-by-id) | `Delete_Contact_Number` |
| Get specific Contact Number by ID | Retrieve an existing Contact Number. | [`/organization/{orgid}/contact-number/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-number/get-specific-contact-number-by-id) | `Get_Contact_Number_by_ID` |
| List all contact numbers(property - number) | Retrieve a list of only contact number strings. | [`/organization/{orgid}/contact-number/all-numbers`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-number/list-all-contact-numbersproperty-number) | `List_All_Contact_Numbers_Raw` |
| List Contact Number(s) | Retrieve a full list of Contact Numbers. | [`/organization/{orgid}/v2/contact-number`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-number/list-contact-numbers) | `List_Contact_Numbers` |
| Update specific Contact Number by ID | Update an existing Contact Number. | [`/organization/{orgid}/contact-number/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-number/update-specific-contact-number-by-id) | `Update_Contact_Number` |

### Contact Service Queues
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Add or remove agents/users from queue | Reassign agents to agent-based queue. | [`/organization/{orgid}/v2/contact-service-queue/{id}/reassign-agents`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues/add-or-remove-agents-users-to-from-an-agent-based-queue) | `Add_Remove_Agents_to_Queue` |
| Bulk export Contact Service Queue(s) | Export all CSQs. | [`/organization/{orgid}/contact-service-queue/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues/bulk-export-contact-service-queues) | `Bulk_Export_Contact_Service_Queues` |
| Bulk partial update Contact Service Queue(s) | Update multiple CSQs. | [`/organization/{orgid}/contact-service-queue/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues/bulk-partial-update-contact-service-queues) | `Bulk_Partial_Update_Contact_Service_Queues` |
| Bulk save Contact Service Queue(s) | Bulk operation on CSQs. | [`/organization/{orgid}/contact-service-queue/v2/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues/bulk-save-contact-service-queues) | `Bulk_Save_Contact_Service_Queues` |
| Create a new Contact Service Queue | Create a new CSQ. | [`/organization/{orgid}/v2/contact-service-queue`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues/create-a-new-contact-service-queue) | `Create_Contact_Service_Queue` |
| Delete specific Contact Service Queue by ID | Delete an existing CSQ. | [`/organization/{orgid}/contact-service-queue/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues/delete-specific-contact-service-queue-by-id) | `Delete_Contact_Service_Queue` |
| Get specific Contact Service Queue by ID | Retrieve detailed CSQ information. | [`/organization/{orgid}/v2/contact-service-queue/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues/get-specific-contact-service-queue-by-id) | `Get_Contact_Service_Queue_by_ID` |
| List agent-based CSQs by user ID | List user's agent CSQs. | [`/organization/{orgid}/v2/contact-service-queue/by-user-id/{userid}/agent-based-queues`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues/list-agent-based-contact-service-queuesby-user-id) | `List_Agent_Based_Queues` |
| List Contact Service Queue(s) (V3) | Retrieve CSQs with advanced filters. | [`/organization/{orgid}/v3/contact-service-queue`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues/list-contact-service-queues) | `List_Contact_Service_Queues` |
| List references for a CSQ | Get incoming references. | [`/organization/{orgid}/contact-service-queue/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues/list-references-for-a-specific-contact-service-queue) | `List_Contact_Service_Queue_References` |
| List skill-based CSQs by user ID | List user's skill CSQs. | [`/organization/{orgid}/v2/contact-service-queue/by-user-id/{userid}/skill-based-queues`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues/list-skill-based-contact-service-queuesby-user-id) | `List_Skill_Based_Queues` |
| List team-based CSQs by user ID | List user's team CSQs. | [`/organization/{orgid}/v2/contact-service-queue/by-user-id/{userid}/team-based-queues`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues/list-team-based-contact-service-queuesby-user-id) | `List_Team_Based_Queues` |
| Purge inactive Contact Service Queue(s) | Purge inactive CSQs. | [`/organization/{orgid}/contact-service-queue/purge-queues`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues/purge-inactive-contact-service-queues) | `Purge_Inactive_Contact_Service_Queues` |
| Update specific Contact Service Queue by ID | Update an existing CSQ. | [`/organization/{orgid}/v2/contact-service-queue/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues/update-specific-contact-service-queue-by-id) | `Update_Contact_Service_Queue` |

### Desktop Layout
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export Desktop Layout(s) | Export mappings in bulk. | [`/organization/{orgid}/desktop-layout/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-layout/bulk-export-desktop-layouts) | `Bulk_Export_Desktop_Layouts` |
| Bulk save Desktop Layout(s) | Bulk operation. | [`/organization/{orgid}/desktop-layout/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-layout/bulk-save-desktop-layouts) | `Bulk_Save_Desktop_Layouts` |
| Create a new Desktop Layout | Create layout. | [`/organization/{orgid}/desktop-layout`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-layout/create-a-new-desktop-layout) | `Create_Desktop_Layout` |
| Delete specific Desktop Layout by ID | Delete layout. | [`/organization/{orgid}/desktop-layout/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-layout/delete-specific-desktop-layout-by-id) | `Delete_Desktop_Layout` |
| Get specific Desktop Layout by ID | Retrieve layout. | [`/organization/{orgid}/desktop-layout/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-layout/get-specific-desktop-layout-by-id) | `Get_Desktop_Layout_by_ID` |
| List Desktop Layout(s) | List layouts. | [`/organization/{orgid}/v2/desktop-layout`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-layout/list-desktop-layouts) | `List_Desktop_Layouts` |
| List references for a specific Desktop Layout | List incoming references. | [`/organization/{orgid}/desktop-layout/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-layout/list-references-for-a-specific-desktop-layout) | `List_Desktop_Layout_References` |
| Purge inactive Desktop Layout(s) | Purge inactive layouts. | [`/organization/{orgid}/desktop-layout/purge-inactive-entities`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-layout/purge-inactive-desktop-layouts) | `Purge_Inactive_Desktop_Layouts` |
| Update specific Desktop Layout by ID | Update layout. | [`/organization/{orgid}/desktop-layout/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-layout/update-specific-desktop-layout-by-id) | `Update_Desktop_Layout_by_ID` |

### Desktop Profile
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export Desktop Profile(s) | Export profiles. | [`/organization/{orgid}/agent-profile/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-profile/bulk-export-desktop-profiles) | `Bulk_Export_Desktop_Profiles` |
| Bulk save Desktop Profile(s) | Save profiles. | [`/organization/{orgid}/agent-profile/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-profile/bulk-save-desktop-profiles) | `Bulk_Save_Desktop_Profiles` |
| Create a new Desktop Profile | Create profile. | [`/organization/{orgid}/agent-profile`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-profile/create-a-new-desktop-profile) | `Create_Desktop_Profile` |
| Delete specific Desktop Profile by ID | Delete profile. | [`/organization/{orgid}/agent-profile/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-profile/delete-specific-desktop-profile-by-id) | `Delete_Desktop_Profile` |
| Get specific Desktop Profile by ID | Get profile. | [`/organization/{orgid}/agent-profile/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-profile/get-specific-desktop-profile-by-id) | `Get_Desktop_Profile_by_ID` |
| List Desktop Profile(s) | List profiles. | [`/organization/{orgid}/v2/agent-profile`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-profile/list-desktop-profiles) | `List_Desktop_Profiles` |
| List references for a specific Desktop Profile | List incoming references. | [`/organization/{orgid}/agent-profile/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-profile/list-references-for-a-specific-desktop-profile) | `List_Desktop_Profile_References` |
| Purge inactive Desktop Profile(s) | Purge profiles. | [`/organization/{orgid}/agent-profile/purge`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-profile/purge-inactive-desktop-profiles) | `Purge_Inactive_Desktop_Profiles` |
| Update specific Desktop Profile by ID | Update profile. | [`/organization/{orgid}/agent-profile/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-profile/update-specific-desktop-profile-by-id) | `Update_Desktop_Profile` |

### Dial Number
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export Dialed Number Mapping(s) | Export mappings. | [`/organization/{orgid}/dial-number/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-number/bulk-export-dialed-number-mappings) | `Bulk_Export_Dialed_Number_Mappings` |
| Bulk save Dialed Number Mapping(s) | Save mappings. | [`/organization/{orgid}/dial-number/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-number/bulk-save-dialed-number-mappings) | `Bulk_Save_Dialed_Number_Mappings` |
| Create a new Dialed Number Mapping | Create mapping. | [`/organization/{orgid}/dial-number`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-number/create-a-new-dialed-number-mapping) | `Create_Dialed_Number_Mapping` |
| Delete all Dialed Number Mapping(s) | Delete all mappings. | [`/organization/{orgid}/dial-number`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-number/delete-all-dialed-number-mappings) | `Delete_All_Dialed_Number_Mappings` |
| Delete specific Dialed Number Mapping by ID | Delete mapping. | [`/organization/{orgid}/dial-number/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-number/delete-specific-dialed-number-mapping-by-id) | `Delete_Dialed_Number_Mapping` |
| Get specific Dialed Number Mapping by ID | Retrieve mapping. | [`/organization/{orgid}/dial-number/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-number/get-specific-dialed-number-mapping-by-id) | `Get_Dialed_Number_Mapping_by_ID` |
| List only dialed numbers | Retrieve numbers without pagination. | [`/organization/{orgid}/dial-number/numbers-only`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-number/list-only-dialed-numbersproperty-diallednumber-from-dialed-number-mappings) | `List_All_Dialed_Numbers_Raw` |
| List Dialed Number Mapping(s) | Retrieve paginated mappings. | [`/organization/{orgid}/v3/dial-number`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-number/list-dialed-number-mappings) | `List_Dialed_Number_Mappings` |
| List references for a specific Dialed Number Mapping | Watch incoming references. | [`/organization/{orgid}/dial-number/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-number/list-references-for-a-specific-dialed-number-mapping) | `List_Dialed_Number_Mapping_References` |
| Update specific Dialed Number Mapping by ID | Update mapping. | [`/organization/{orgid}/dial-number/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-number/update-specific-dialed-number-mapping-by-id) | `Update_Dialed_Number_Mapping` |

### Dial Plan
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export Dial Plan(s) | Export plans. | [`/organization/{orgid}/dial-plan/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-plan/bulk-export-dial-plans) | `Bulk_Export_Dial_Plans` |
| Bulk save Dial Plan(s) | Save plans. | [`/organization/{orgid}/dial-plan/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-plan/bulk-save-dial-plans) | `Bulk_Save_Dial_Plans` |
| Create a new Dial Plan | Create plan. | [`/organization/{orgid}/dial-plan`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-plan/create-a-new-dial-plan) | `Create_Dial_Plan` |
| Delete specific Dial Plan by ID | Delete plan. | [`/organization/{orgid}/dial-plan/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-plan/delete-specific-dial-plan-by-id) | `Delete_Dial_Plan` |
| Get specific Dial Plan by ID | Retrieve plan. | [`/organization/{orgid}/dial-plan/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-plan/get-specific-dial-plan-by-id) | `Get_Dial_Plan_by_ID` |
| List Dial Plan(s) | List plans. | [`/organization/{orgid}/v2/dial-plan`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-plan/list-dial-plans) | `List_Dial_Plans` |
| List references for a specific Dial Plan | List references. | [`/organization/{orgid}/dial-plan/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-plan/list-references-for-a-specific-dial-plan) | `List_Dial_Plan_References` |
| Update specific Dial Plan by ID | Update plan. | [`/organization/{orgid}/dial-plan/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-plan/update-specific-dial-plan-by-id) | `Update_Dial_Plan` |

### Entry Point
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export Entry Point(s) | Export mappings in bulk. | [`/organization/{orgId}/entry-point/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/entry-point/bulk-export-entry-points) | `Bulk_Export_Entry_Points` |
| Bulk save Entry Point(s) | Bulk operation. | [`/organization/{orgId}/entry-point/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/entry-point/bulk-save-entry-points) | `Bulk_Save_Entry_Points` |
| Create a new Entry Point | Create Entry Point. | [`/organization/{orgId}/entry-point`](https://developer.webex.com/webex-contact-center/docs/api/v1/entry-point/create-a-new-entry-point) | `Create_Entry_Point` |
| Delete specific Entry Point by ID | Delete Entry Point. | [`/organization/{orgId}/entry-point/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/entry-point/delete-specific-entry-point-by-id) | `Delete_Entry_Point` |
| Get specific Entry Point by ID | Retrieve Entry Point. | [`/organization/{orgId}/entry-point/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/entry-point/get-specific-entry-point-by-id) | `Get_Entry_Point_by_ID` |
| List Entry Point(s) | List Entry Points. | [`/organization/{orgid}/v2/entry-point`](https://developer.webex.com/webex-contact-center/docs/api/v1/entry-point/list-entry-points) | `List_Entry_Points` |

### Global Variables
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export Global Variable(s) | Export variables. | [`/organization/{orgid}/cad-variable/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/global-variables/bulk-export-global-variables) | `Bulk_Export_Global_Variables` |
| Bulk save Global Variable(s) | Save variables. | [`/organization/{orgid}/cad-variable/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/global-variables/bulk-save-global-variables) | `Bulk_Save_Global_Variables` |
| Create a new Global Variable | Create variable. | [`/organization/{orgid}/cad-variable`](https://developer.webex.com/webex-contact-center/docs/api/v1/global-variables/create-a-new-global-variable) | `Create_Global_Variable` |
| Delete specific Global Variable by ID | Delete variable. | [`/organization/{orgid}/cad-variable/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/global-variables/delete-specific-global-variable-by-id) | `Delete_Global_Variable` |
| Get reportable count for Global Variable(s) | Get variable count. | [`/organization/{orgid}/cad-variable/reportable-count`](https://developer.webex.com/webex-contact-center/docs/api/v1/global-variables/get-reportable-count-for-global-variables) | `Get_Reportable_Count_Global_Variables` |
| Get specific Global Variable by ID | Get variable. | [`/organization/{orgid}/cad-variable/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/global-variables/get-specific-global-variable-by-id) | `Get_Global_Variable_by_ID` |
| List Global Variable(s) | List variables. | [`/organization/{orgid}/v2/cad-variable`](https://developer.webex.com/webex-contact-center/docs/api/v1/global-variables/list-global-variables) | `List_Global_Variables` |
| List references for a specific Global Variable | List incoming references. | [`/organization/{orgid}/cad-variable/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/global-variables/list-references-for-a-specific-global-variable) | `List_Global_Variable_References` |
| Purge inactive Global Variable(s) | Purge variables. | [`/organization/{orgid}/cad-variable/purge-inactive-entities`](https://developer.webex.com/webex-contact-center/docs/api/v1/global-variables/purge-inactive-global-variables) | `Purge_Inactive_Global_Variables` |
| Update specific Global Variable by ID | Update variable. | [`/organization/{orgid}/cad-variable/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/global-variables/update-specific-global-variable-by-id) | `Update_Global_Variable` |

### Multimedia Profile
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export Multimedia Profile(s) | Export profiles. | [`/organization/{orgid}/multimedia-profile/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/multimedia-profile/bulk-export-multimedia-profiles) | `Bulk_Export_Multimedia_Profiles` |
| Bulk save Multimedia Profile(s) | Save profiles. | [`/organization/{orgid}/multimedia-profile/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/multimedia-profile/bulk-save-multimedia-profiles) | `Bulk_Save_Multimedia_Profiles` |
| Create a new Multimedia Profile | Create profile. | [`/organization/{orgid}/multimedia-profile`](https://developer.webex.com/webex-contact-center/docs/api/v1/multimedia-profile/create-a-new-multimedia-profile) | `Create_Multimedia_Profile` |
| Delete specific Multimedia Profile by ID | Delete profile. | [`/organization/{orgid}/multimedia-profile/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/multimedia-profile/delete-specific-multimedia-profile-by-id) | `Delete_Multimedia_Profile` |
| Get specific Multimedia Profile by ID | Retrieve profile. | [`/organization/{orgid}/multimedia-profile/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/multimedia-profile/get-specific-multimedia-profile-by-id) | `Get_Multimedia_Profile_by_ID` |
| List Multimedia Profile(s) | List profiles. | [`/organization/{orgid}/v2/multimedia-profile`](https://developer.webex.com/webex-contact-center/docs/api/v1/multimedia-profile/list-multimedia-profiles) | `List_Multimedia_Profiles` |
| List references for a specific Multimedia Profile | Watch incoming references. | [`/organization/{orgid}/multimedia-profile/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/multimedia-profile/list-references-for-a-specific-multimedia-profile) | `List_Multimedia_Profile_References` |
| Purge inactive Multimedia Profile(s) | Purge inactive Profiles. | [`/organization/{orgid}/multimedia-profile/purge-inactive-entities`](https://developer.webex.com/webex-contact-center/docs/api/v1/multimedia-profile/purge-inactive-multimedia-profiles) | `Purge_Inactive_Multimedia_Profiles` |
| Update specific Multimedia Profile by ID | Update profile. | [`/organization/{orgid}/multimedia-profile/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/multimedia-profile/update-specific-multimedia-profile-by-id) | `Update_Multimedia_Profile` |

### Outdial ANI
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export Outdial ANI(s) | Export mappings. | [`/organization/{orgId}/outdial-ani/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani/bulk-export-outdial-anis) | `Bulk_Export_Outdial_ANIs` |
| Bulk save Outdial ANI Entry(s) | Save mappings. | [`/organization/{orgid}/outdial-ani/{outDialAniId}/entry/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani/bulk-save-outdial-ani-entrys) | `Bulk_Save_Outdial_ANI_Entries` |
| Bulk save Outdial ANI(s) | Save mappings. | [`/organization/{orgid}/outdial-ani/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani/bulk-save-outdial-anis) | `Bulk_Save_Outdial_ANIs` |
| Create a new Outdial ANI | Create mapping. | [`/organization/{orgid}/outdial-ani`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani/create-a-new-outdial-ani) | `Create_Outdial_ANI` |
| Create a new Outdial ANI Entry | Create entry. | [`/organization/{orgid}/outdial-ani/{outDialAniId}/entry`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani/create-a-new-outdial-ani-entry) | `Create_Outdial_ANI_Entry` |
| Delete specific Outdial ANI by ID | Delete mapping. | [`/organization/{orgid}/outdial-ani/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani/delete-specific-outdial-ani-by-id) | `Delete_Outdial_ANI` |
| Delete specific Outdial ANI Entry by ID | Delete entry. | [`/organization/{orgid}/outdial-ani/{outDialAniId}/entry/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani/delete-specific-outdial-ani-entry-by-id) | `Delete_Outdial_ANI_Entry` |
| Get specific Outdial ANI by ID | Retrieve mapping. | [`/organization/{orgId}/outdial-ani/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani/get-specific-outdial-ani-by-id) | `Get_Outdial_ANI_by_ID` |
| Get specific Outdial ANI Entry by ID | Retrieve entry. | [`/organization/{orgid}/outdial-ani/{outDialAniId}/entry/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani/get-specific-outdial-ani-entry-by-id) | `Get_Outdial_ANI_Entry_by_ID` |
| List Outdial ANI Entry(s) | List entries. | [`/organization/{orgid}/outdial-ani/{outDialAniId}/entry`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani/list-outdial-ani-entrys) | `List_Outdial_ANI_Entries` |
| List Outdial ANI(s) | Retrieve paginated mappings. | [`/organization/{orgid}/v2/outdial-ani`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani/list-outdial-anis) | `List_Outdial_ANIs` |
| List references for a specific Outdial ANI | Watch incoming references. | [`/organization/{orgId}/outdial-ani/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani/list-references-for-a-specific-outdial-ani) | `List_Outdial_ANI_References` |
| Update specific Outdial ANI by ID | Update mapping. | [`/organization/{orgId}/outdial-ani/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani/update-specific-outdial-ani-by-id) | `Update_Outdial_ANI` |
| Update specific Outdial ANI Entry by ID | Update entry. | [`/organization/{orgid}/outdial-ani/{outDialAniId}/entry/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani/update-specific-outdial-ani-entry-by-id) | `Update_Outdial_ANI_Entry` |
