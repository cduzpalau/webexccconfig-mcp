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
| Bulk export Skill(s) | Export all Skill(s) in a given organization. | [`/organization/{orgId}/skill/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/skill) | - |
| Bulk save Skill(s) | Create, Update or delete Skill(s) in bulk. | [`/organization/{orgid}/skill/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/skill) | - |
| Create a new Skill | Create a new Skill in a given organization. | [`/organization/{orgid}/skill`](https://developer.webex.com/webex-contact-center/docs/api/v1/skill) | `Create_Skill` |
| Delete specific Skill by ID | Delete an existing Skill by ID. | [`/organization/{orgid}/skill/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/skill) | `Delete_Skill` |
| Get specific Skill by ID | Retrieve an existing Skill by ID. | [`/organization/{orgid}/skill/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/skill) | `Get_Skill_by_ID` |
| List references for a specific Skill | Retrieve a list of all entities that have reference. | [`/organization/{orgid}/skill/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/skill) | `List_Skill_References` |
| List Skill(s) (v1) | Retrieve a list of Skill(s). | [`/organization/{orgid}/skill`](https://developer.webex.com/webex-contact-center/docs/api/v1/skill) | - |
| List Skill(s) (v2) | Retrieve a list of Skill(s) (optimized). | [`/organization/{orgid}/v2/skill`](https://developer.webex.com/webex-contact-center/docs/api/v1/skill) | `List_Skills` |
| Purge inactive Skill(s) | Purge inactive Skill(s) older than the configured interval. | [`/organization/{orgid}/skill/purge-inactive-entities`](https://developer.webex.com/webex-contact-center/docs/api/v1/skill) | - |
| Update specific Skill by ID | Update an existing Skill by ID. | [`/organization/{orgid}/skill/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/skill) | `Update_Skill` |

### Team
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export Team(s) | Export all Team(s) in a given organization. | [`/organization/{orgId}/team/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/team) | - |
| Bulk save Team(s) | Create, update, or delete Team(s) in bulk. | [`/organization/{orgId}/team/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/team) | - |
| Create a new Team | Create a new Team in a given organization. | [`/organization/{orgId}/team`](https://developer.webex.com/webex-contact-center/docs/api/v1/team) | - |
| Delete specific Team by ID | Delete an existing Team by ID. | [`/organization/{orgId}/team/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/team) | `Delete_Team` |
| Get specific Team by ID | Retrieve an existing Team by ID. | [`/organization/{orgId}/team/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/team) | `Get_Team_by_ID` |
| List references for a specific Team | Retrieve a list of all entities that have a reference. | [`/organization/{orgId}/team/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/team) | `List_Team_References` |
| List Team(s) | Retrieve all Team(s) in a given organization (v2). | [`/organization/{orgId}/v2/team`](https://developer.webex.com/webex-contact-center/docs/api/v1/team) | `List_Teams` |
| Purge inactive Team(s) | Purge inactive Team(s) older than the configured interval. | [`/organization/{orgId}/team/purge-inactive-entities`](https://developer.webex.com/webex-contact-center/docs/api/v1/team) | - |
| Update specific Team by ID | Update an existing Team by ID. | [`/organization/{orgId}/team/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/team) | - |

### Users
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export User(s) | Export all User(s) in a given organization. | [`/organization/{orgid}/user/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/users) | - |
| Bulk partial update Users | Update properties for multiple users in bulk. | [`/organization/{orgid}/user/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/users) | - |
| Get specific User along with profile by ID | Retrieve an existing User along with UserProfile by ID. | [`/organization/{orgid}/user/with-user-profile/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/users) | `Get_User_With_Profile` |
| Get specific User by CI User ID | Retrieve an existing User using the CI ID. | [`/organization/{orgid}/v2/user/by-ci-user-id/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/users) | `Get_User_by_CI_ID` |
| Get specific User by ID | Retrieve an existing Users by ID. | [`/organization/{orgid}/user/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/users) | `Get_User_by_ID` |
| Get specific Users by provided IDs | Retrieve an existing User's details by list of IDs. | [`/organization/{orgid}/user/fetch-user-details-by-ids`](https://developer.webex.com/webex-contact-center/docs/api/v1/users) | - |
| Get the agents matching skill requirements criteria | Fetch the agents who match the provided skill requirements. | [`/organization/{orgid}/user/fetch-by-skill-requirements`](https://developer.webex.com/webex-contact-center/docs/api/v1/users) | - |
| List references for a specific User | Retrieve a list of all entities that have reference. | [`/organization/{orgid}/user/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/users) | `List_User_References` |
| List User(s) | Retrieve a list of User(s). | [`/organization/{orgid}/v2/user`](https://developer.webex.com/webex-contact-center/docs/api/v1/users) | `List_Users` |
| List Users along with profile | Retrieve a list of User(s) along with their UserProfiles. | [`/organization/{orgid}/user/with-user-profile`](https://developer.webex.com/webex-contact-center/docs/api/v1/users) | `List_Users_With_Profile` |
| Partially update User by ID | Partially update User by ID. | [`/organization/{orgid}/user/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/users) | - |
| Update specific User by ID | Update an existing User by ID. | [`/organization/{orgid}/user/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/users) | - |

### Address Book
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| List Address Book(s) | Retrieves a list of address books. | [`/organization/{orgid}/v3/address-book`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book) | `List_Address_Books` |
| Create a new Address Book | Creates a new address book. | [`/organization/{orgid}/v3/address-book`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book) | - |
| Get specific Address Book by ID | Retrieves a single address book's details. | [`/organization/{orgid}/v3/address-book/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book) | `Get_Address_Book_by_ID` |
| Update specific Address Book by ID | Update an existing Address book. | [`/organization/{orgid}/v3/address-book/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book) | - |
| Delete specific Address Book by ID | Delete an address book. | [`/organization/{orgid}/v3/address-book/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book) | `Delete_Address_Book` |
| Bulk export Address Book(s) | Exports all address books and their entries. | [`/organization/{orgid}/address-book/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book) | - |
| List references for a specific Address Book | Lists entities that reference the address book. | [`/organization/{orgid}/address-book/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book) | `List_Address_Book_References` |
| List Address Book Entry(s) | List entries for a specific address book. | [`/organization/{orgid}/v2/address-book/{addressBookId}/entry`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book) | `List_Address_Book_Entries` |
| Create a new Address Book Entry | Create a new entry. | [`/organization/{orgid}/address-book/{addressBookId}/entry`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book) | - |
| Get specific Address Book Entry by ID | Retrieve an entry by ID. | [`/organization/{orgid}/address-book/{addressBookId}/entry/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book) | `Get_Address_Book_Entry_by_ID` |
| Update specific Address Book Entry by ID | Update an entry by ID. | [`/organization/{orgid}/address-book/{addressBookId}/entry/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book) | - |
| Delete specific Address Book Entry by ID | Delete an entry by ID. | [`/organization/{orgid}/address-book/{addressBookId}/entry/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book) | `Delete_Address_Book_Entry` |
| Bulk save Address Book Entry(s) | Bulk operation on entries. | [`/organization/{orgid}/address-book/{addressBookId}/entry/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/address-book) | - |

### Agent Personal Greeting
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Create a new Greeting File | Create a new agent personal greeting. | [`/organization/{orgid}/v2/agent-personal-greeting`](https://developer.webex.com/webex-contact-center/docs/api/v1/agent-personal-greeting) | - |
| Delete References 1 | Delete references for a greeting file. | [`/organization/{orgid}/agent-personal-greeting/delete-reference`](https://developer.webex.com/webex-contact-center/docs/api/v1/agent-personal-greeting) | - |
| Delete specific Greeting File by ID | Delete an existing Greeting File. | [`/organization/{orgid}/v2/agent-personal-greeting/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/agent-personal-greeting) | `Delete_Agent_Personal_Greeting` |
| Get All Config With Meta Data | Retrieve all configurations with meta data. | [`/organization/{orgid}/v2/agent-personal-greeting`](https://developer.webex.com/webex-contact-center/docs/api/v1/agent-personal-greeting) | `List_Agent_Personal_Greetings_Meta` |
| Get specific Greeting File by ID | Retrieve an existing Greeting File. | [`/organization/{orgid}/v2/agent-personal-greeting/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/agent-personal-greeting) | `Get_Agent_Personal_Greeting_by_ID` |
| List Greeting File(s) | Retrieve a list of Greeting File(s). | [`/organization/{orgid}/v3/agent-personal-greeting`](https://developer.webex.com/webex-contact-center/docs/api/v1/agent-personal-greeting) | `List_Agent_Personal_Greetings` |
| Partially update Greeting File by ID | Partially update Greeting File. | [`/organization/{orgid}/v2/agent-personal-greeting/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/agent-personal-greeting) | - |
| Update specific Greeting File by ID | Update Greeting File. | [`/organization/{orgid}/agent-personal-greeting/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/agent-personal-greeting) | - |

### Audio Files
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Create a new Audio File | Create a new Audio File. | [`/organization/{orgid}/audio-file`](https://developer.webex.com/webex-contact-center/docs/api/v1/audio-files) | - |
| Delete specific Audio File by ID | Delete an existing Audio File. | [`/organization/{orgid}/audio-file/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/audio-files) | `Delete_Audio_File` |
| Get specific Audio File by ID | Retrieve the metadata for a specific Audio File. | [`/organization/{orgid}/audio-file/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/audio-files) | `Get_Audio_File_by_ID` |
| List Audio File(s) | List all the Audio Files available. | [`/organization/{orgid}/v2/audio-file`](https://developer.webex.com/webex-contact-center/docs/api/v1/audio-files) | `List_Audio_Files` |
| List references for a specific Audio File | Retrieve entities referencing this audio file. | [`/organization/{orgid}/audio-file/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/audio-files) | `List_Audio_File_References` |
| Partially update Audio File by ID | Update specific fields. | [`/organization/{orgid}/audio-file/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/audio-files) | - |
| Update specific Audio File by ID | Full update of an audio file. | [`/organization/{orgid}/audio-file/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/audio-files) | - |

### Auxiliary Code
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export Auxiliary Code(s) | Export all Auxiliary Code(s). | [`/organization/{orgid}/auxiliary-code/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/auxiliary-code) | - |
| Bulk partial update Auxiliary Code(s) | Update properties in bulk. | [`/organization/{orgid}/auxiliary-code/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/auxiliary-code) | - |
| Bulk save Auxiliary Code(s) | Create, update, delete in bulk. | [`/organization/{orgid}/auxiliary-code/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/auxiliary-code) | - |
| Create a new Auxiliary Code | Create a single Auxiliary Code. | [`/organization/{orgid}/auxiliary-code`](https://developer.webex.com/webex-contact-center/docs/api/v1/auxiliary-code) | - |
| Delete specific Auxiliary Code by ID | Delete an Auxiliary Code. | [`/organization/{orgid}/auxiliary-code/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/auxiliary-code) | `Delete_Auxiliary_Code` |
| Get specific Auxiliary Code by ID | Retrieve existing details. | [`/organization/{orgid}/auxiliary-code/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/auxiliary-code) | `Get_Auxiliary_Code_by_ID` |
| List Auxiliary Code(s) | Retrieve paginated list. | [`/organization/{orgid}/v2/auxiliary-code`](https://developer.webex.com/webex-contact-center/docs/api/v1/auxiliary-code) | `List_Auxiliary_Codes` |
| List references for a specific Auxiliary Code | Find referencing entities. | [`/organization/{orgid}/auxiliary-code/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/auxiliary-code) | `List_Auxiliary_Code_References` |
| Purge inactive Auxiliary Code(s) | Remove old inactive codes. | [`/organization/{orgid}/auxiliary-code/purge-inactive-entities`](https://developer.webex.com/webex-contact-center/docs/api/v1/auxiliary-code) | - |
| Update specific Auxiliary Code by ID | Fully update an existing code. | [`/organization/{orgid}/auxiliary-code/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/auxiliary-code) | - |

### Business Hours (Includes Holiday List & Overrides)
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Delete Business Hours | Delete Business Hours. | [`/organization/{orgid}/business-hours/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/business-hours) | `Delete_Business_Hours` |
| Get Business Hours | Retrieve Business Hours. | [`/organization/{orgid}/business-hours/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/business-hours) | `Get_Business_Hours_by_ID` |
| List Business Hours | List Business Hours. | [`/organization/{orgid}/business-hours`](https://developer.webex.com/webex-contact-center/docs/api/v1/business-hours) | `List_Business_Hours` |
| List References (Business Hours) | List referencing entities. | [`/organization/{orgid}/business-hours/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/business-hours) | `List_Business_Hours_References` |
| Delete Holiday List | Delete Holiday List. | [`/organization/{orgid}/holiday-list/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/business-hours) | `Delete_Holiday_List` |
| Get Holiday List | Retrieve Holiday List. | [`/organization/{orgid}/holiday-list/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/business-hours) | `Get_Holiday_List_by_ID` |
| List Holiday List | List Holiday Lists. | [`/organization/{orgid}/holiday-list`](https://developer.webex.com/webex-contact-center/docs/api/v1/business-hours) | `List_Holiday_Lists` |
| List References (Holiday List) | List referencing entities. | [`/organization/{orgid}/holiday-list/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/business-hours) | `List_Holiday_List_References` |
| Delete Overrides | Delete Overrides. | [`/organization/{orgid}/overrides/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/business-hours) | `Delete_Overrides` |
| Get Overrides | Retrieve Overrides. | [`/organization/{orgid}/overrides/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/business-hours) | `Get_Overrides_by_ID` |
| List Overrides | List Overrides. | [`/organization/{orgid}/overrides`](https://developer.webex.com/webex-contact-center/docs/api/v1/business-hours) | `List_Overrides` |
| List References (Overrides) | List referencing entities. | [`/organization/{orgid}/overrides/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/business-hours) | `List_Overrides_References` |

### Contact Number
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export Contact Number(s) | Export all Contact Numbers. | [`/organization/{orgid}/contact-number/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-number) | - |
| Bulk save Contact Number(s) | Bulk operation on contact numbers. | [`/organization/{orgid}/contact-number/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-number) | - |
| Create a new Contact Number | Create a new Contact Number. | [`/organization/{orgid}/contact-number`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-number) | - |
| Delete specific Contact Number by ID | Delete an existing Contact Number. | [`/organization/{orgid}/contact-number/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-number) | `Delete_Contact_Number` |
| Get specific Contact Number by ID | Retrieve an existing Contact Number. | [`/organization/{orgid}/contact-number/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-number) | `Get_Contact_Number_by_ID` |
| List all contact numbers(property - number) | Retrieve a list of only contact number strings. | [`/organization/{orgid}/contact-number/all-numbers`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-number) | `List_All_Contact_Numbers` |
| List Contact Number(s) | Retrieve a full list of Contact Numbers. | [`/organization/{orgid}/v2/contact-number`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-number) | `List_Contact_Numbers` |
| Update specific Contact Number by ID | Update an existing Contact Number. | [`/organization/{orgid}/contact-number/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-number) | - |

### Contact Service Queues
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Add or remove agents/users from queue | Reassign agents to agent-based queue. | [`/organization/{orgid}/v2/contact-service-queue/{id}/reassign-agents`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues) | - |
| Bulk export Contact Service Queue(s) | Export all CSQs. | [`/organization/{orgid}/contact-service-queue/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues) | - |
| Bulk partial update Contact Service Queue(s) | Update multiple CSQs. | [`/organization/{orgid}/contact-service-queue/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues) | - |
| Bulk save Contact Service Queue(s) | Bulk operation on CSQs. | [`/organization/{orgid}/contact-service-queue/v2/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues) | - |
| Create a new Contact Service Queue | Create a new CSQ. | [`/organization/{orgid}/v2/contact-service-queue`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues) | - |
| Delete specific Contact Service Queue by ID | Delete an existing CSQ. | [`/organization/{orgid}/contact-service-queue/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues) | `Delete_Contact_Service_Queue` |
| Get specific Contact Service Queue by ID | Retrieve detailed CSQ information. | [`/organization/{orgid}/v2/contact-service-queue/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues) | `Get_Contact_Service_Queue_by_ID` |
| List agent-based CSQs by user ID | List user's agent CSQs. | [`/organization/{orgid}/v2/contact-service-queue/by-user-id/{userid}/agent-based-queues`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues) | `List_Agent_CSQs_by_User_ID` |
| List Contact Service Queue(s) (V3) | Retrieve CSQs with advanced filters. | [`/organization/{orgid}/v3/contact-service-queue`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues) | `List_Contact_Service_Queues` |
| List references for a CSQ | Get incoming references. | [`/organization/{orgid}/contact-service-queue/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues) | `List_CSQ_References` |
| List skill-based CSQs by user ID | List user's skill CSQs. | [`/organization/{orgid}/v2/contact-service-queue/by-user-id/{userid}/skill-based-queues`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues) | `List_Skill_CSQs_by_User_ID` |
| List team-based CSQs by user ID | List user's team CSQs. | [`/organization/{orgid}/v2/contact-service-queue/by-user-id/{userid}/team-based-queues`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues) | `List_Team_CSQs_by_User_ID` |
| Purge inactive Contact Service Queue(s) | Purge inactive CSQs. | [`/organization/{orgid}/contact-service-queue/purge-queues`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues) | - |
| Update specific Contact Service Queue by ID | Update an existing CSQ. | [`/organization/{orgid}/v2/contact-service-queue/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/contact-service-queues) | - |

### Desktop Layout
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export Desktop Layout(s) | Export mappings in bulk. | [`/organization/{orgid}/desktop-layout/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-layout) | - |
| Bulk save Desktop Layout(s) | Bulk operation. | [`/organization/{orgid}/desktop-layout/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-layout) | - |
| Create a new Desktop Layout | Create layout. | [`/organization/{orgid}/desktop-layout`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-layout) | - |
| Delete specific Desktop Layout by ID | Delete layout. | [`/organization/{orgid}/desktop-layout/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-layout) | `Delete_Desktop_Layout` |
| Get specific Desktop Layout by ID | Retrieve layout. | [`/organization/{orgid}/desktop-layout/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-layout) | `Get_Desktop_Layout_by_ID` |
| List Desktop Layout(s) | List layouts. | [`/organization/{orgid}/v2/desktop-layout`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-layout) | `List_Desktop_Layouts` |
| List references for a specific Desktop Layout | List incoming references. | [`/organization/{orgid}/desktop-layout/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-layout) | `List_Desktop_Layout_References` |
| Purge inactive Desktop Layout(s) | Purge inactive layouts. | [`/organization/{orgid}/desktop-layout/purge-inactive-entities`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-layout) | - |

### Desktop Profile
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export Desktop Profile(s) | Export profiles. | [`/organization/{orgid}/agent-profile/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-profile) | - |
| Bulk save Desktop Profile(s) | Save profiles. | [`/organization/{orgid}/agent-profile/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-profile) | - |
| Create a new Desktop Profile | Create profile. | [`/organization/{orgid}/agent-profile`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-profile) | - |
| Delete specific Desktop Profile by ID | Delete profile. | [`/organization/{orgid}/agent-profile/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-profile) | `Delete_Desktop_Profile` |
| Get specific Desktop Profile by ID | Get profile. | [`/organization/{orgid}/agent-profile/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-profile) | `Get_Desktop_Profile_by_ID` |
| List Desktop Profile(s) | List profiles. | [`/organization/{orgid}/v2/agent-profile`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-profile) | `List_Desktop_Profiles` |
| List references for a specific Desktop Profile | List incoming references. | [`/organization/{orgid}/agent-profile/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-profile) | `List_Desktop_Profile_References` |
| Purge inactive Desktop Profile(s) | Purge profiles. | [`/organization/{orgid}/agent-profile/purge`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-profile) | - |
| Update specific Desktop Profile by ID | Update profile. | [`/organization/{orgid}/agent-profile/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/desktop-profile) | - |

### Dial Number
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export Dialed Number Mapping(s) | Export mappings. | [`/organization/{orgid}/dial-number/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-number) | - |
| Bulk save Dialed Number Mapping(s) | Save mappings. | [`/organization/{orgid}/dial-number/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-number) | - |
| Create a new Dialed Number Mapping | Create mapping. | [`/organization/{orgid}/dial-number`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-number) | - |
| Delete all Dialed Number Mapping(s) | Delete all mappings. | [`/organization/{orgid}/dial-number`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-number) | - |
| Delete specific Dialed Number Mapping by ID | Delete mapping. | [`/organization/{orgid}/dial-number/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-number) | `Delete_Dialed_Number_Mapping` |
| Get specific Dialed Number Mapping by ID | Retrieve mapping. | [`/organization/{orgid}/dial-number/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-number) | `Get_Dialed_Number_Mapping_by_ID` |
| List only dialed numbers | Retrieve numbers without pagination. | [`/organization/{orgid}/dial-number/numbers-only`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-number) | `List_All_Dialed_Numbers` |
| List Dialed Number Mapping(s) | Retrieve paginated mappings. | [`/organization/{orgid}/v3/dial-number`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-number) | `List_Dialed_Number_Mappings` |
| List references for a specific Dialed Number Mapping | Watch incoming references. | [`/organization/{orgid}/dial-number/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-number) | `List_Dialed_Number_Mapping_References` |
| Update specific Dialed Number Mapping by ID | Update mapping. | [`/organization/{orgid}/dial-number/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-number) | - |

### Dial Plan
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export Dial Plan(s) | Export plans. | [`/organization/{orgid}/dial-plan/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-plan) | - |
| Bulk save Dial Plan(s) | Save plans. | [`/organization/{orgid}/dial-plan/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-plan) | - |
| Create a new Dial Plan | Create plan. | [`/organization/{orgid}/dial-plan`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-plan) | - |
| Delete specific Dial Plan by ID | Delete plan. | [`/organization/{orgid}/dial-plan/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-plan) | `Delete_Dial_Plan` |
| Get specific Dial Plan by ID | Retrieve plan. | [`/organization/{orgid}/dial-plan/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-plan) | `Get_Dial_Plan_by_ID` |
| List Dial Plan(s) | List plans. | [`/organization/{orgid}/v2/dial-plan`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-plan) | `List_Dial_Plans` |
| List references for a specific Dial Plan | List references. | [`/organization/{orgid}/dial-plan/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-plan) | `List_Dial_Plan_References` |
| Update specific Dial Plan by ID | Update plan. | [`/organization/{orgid}/dial-plan/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/dial-plan) | - |

### Entry Point
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export Entry Point(s) | Export mappings in bulk. | [`/organization/{orgId}/entry-point/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/entry-point) | - |
| Bulk save Entry Point(s) | Bulk operation. | [`/organization/{orgId}/entry-point/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/entry-point) | - |
| Create a new Entry Point | Create Entry Point. | [`/organization/{orgId}/entry-point`](https://developer.webex.com/webex-contact-center/docs/api/v1/entry-point) | - |
| Delete specific Entry Point by ID | Delete Entry Point. | [`/organization/{orgId}/entry-point/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/entry-point) | `Delete_Entry_Point` |
| Get specific Entry Point by ID | Retrieve Entry Point. | [`/organization/{orgId}/entry-point/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/entry-point) | `Get_Entry_Point_by_ID` |
| List Entry Point(s) | List Entry Points. | [`/organization/{orgid}/v2/entry-point`](https://developer.webex.com/webex-contact-center/docs/api/v1/entry-point) | `List_Entry_Points` |

### Global Variables
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export Global Variable(s) | Export variables. | [`/organization/{orgid}/cad-variable/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/global-variables) | - |
| Bulk save Global Variable(s) | Save variables. | [`/organization/{orgid}/cad-variable/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/global-variables) | - |
| Create a new Global Variable | Create variable. | [`/organization/{orgid}/cad-variable`](https://developer.webex.com/webex-contact-center/docs/api/v1/global-variables) | - |
| Delete specific Global Variable by ID | Delete variable. | [`/organization/{orgid}/cad-variable/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/global-variables) | `Delete_Global_Variable` |
| Get reportable count for Global Variable(s) | Get variable count. | [`/organization/{orgid}/cad-variable/reportable-count`](https://developer.webex.com/webex-contact-center/docs/api/v1/global-variables) | `Get_Reportable_Global_Variable_Count` |
| Get specific Global Variable by ID | Get variable. | [`/organization/{orgid}/cad-variable/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/global-variables) | `Get_Global_Variable_by_ID` |
| List Global Variable(s) | List variables. | [`/organization/{orgid}/v2/cad-variable`](https://developer.webex.com/webex-contact-center/docs/api/v1/global-variables) | `List_Global_Variables` |
| List references for a specific Global Variable | List incoming references. | [`/organization/{orgid}/cad-variable/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/global-variables) | `List_Global_Variable_References` |
| Purge inactive Global Variable(s) | Purge variables. | [`/organization/{orgid}/cad-variable/purge-inactive-entities`](https://developer.webex.com/webex-contact-center/docs/api/v1/global-variables) | - |
| Update specific Global Variable by ID | Update variable. | [`/organization/{orgid}/cad-variable/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/global-variables) | - |

### Multimedia Profile
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export Multimedia Profile(s) | Export profiles. | [`/organization/{orgid}/multimedia-profile/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/multimedia-profile) | - |
| Bulk save Multimedia Profile(s) | Save profiles. | [`/organization/{orgid}/multimedia-profile/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/multimedia-profile) | - |
| Create a new Multimedia Profile | Create profile. | [`/organization/{orgid}/multimedia-profile`](https://developer.webex.com/webex-contact-center/docs/api/v1/multimedia-profile) | - |
| Delete specific Multimedia Profile by ID | Delete profile. | [`/organization/{orgid}/multimedia-profile/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/multimedia-profile) | `Delete_Multimedia_Profile` |
| Get specific Multimedia Profile by ID | Retrieve profile. | [`/organization/{orgid}/multimedia-profile/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/multimedia-profile) | `Get_Multimedia_Profile_by_ID` |
| List Multimedia Profile(s) | List profiles. | [`/organization/{orgid}/v2/multimedia-profile`](https://developer.webex.com/webex-contact-center/docs/api/v1/multimedia-profile) | `List_Multimedia_Profiles` |
| List references for a specific Multimedia Profile | Watch incoming references. | [`/organization/{orgid}/multimedia-profile/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/multimedia-profile) | `List_Multimedia_Profile_References` |
| Purge inactive Multimedia Profile(s) | Purge inactive Profiles. | [`/organization/{orgid}/multimedia-profile/purge-inactive-entities`](https://developer.webex.com/webex-contact-center/docs/api/v1/multimedia-profile) | - |
| Update specific Multimedia Profile by ID | Update profile. | [`/organization/{orgid}/multimedia-profile/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/multimedia-profile) | - |

### Outdial ANI
| Operation | Description | Resource Path | MCP Tool |
| :--- | :--- | :--- | :--- |
| Bulk export Outdial ANI(s) | Export mappings. | [`/organization/{orgId}/outdial-ani/bulk-export`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani) | - |
| Bulk save Outdial ANI Entry(s) | Save mappings. | [`/organization/{orgid}/outdial-ani/{outDialAniId}/entry/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani) | - |
| Bulk save Outdial ANI(s) | Save mappings. | [`/organization/{orgid}/outdial-ani/bulk`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani) | - |
| Create a new Outdial ANI | Create mapping. | [`/organization/{orgid}/outdial-ani`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani) | - |
| Create a new Outdial ANI Entry | Create entry. | [`/organization/{orgid}/outdial-ani/{outDialAniId}/entry`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani) | - |
| Delete specific Outdial ANI by ID | Delete mapping. | [`/organization/{orgid}/outdial-ani/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani) | `Delete_Outdial_ANI` |
| Delete specific Outdial ANI Entry by ID | Delete entry. | [`/organization/{orgid}/outdial-ani/{outDialAniId}/entry/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani) | `Delete_Outdial_ANI_Entry` |
| Get specific Outdial ANI by ID | Retrieve mapping. | [`/organization/{orgId}/outdial-ani/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani) | `Get_Outdial_ANI_by_ID` |
| Get specific Outdial ANI Entry by ID | Retrieve entry. | [`/organization/{orgid}/outdial-ani/{outDialAniId}/entry/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani) | `Get_Outdial_ANI_Entry_by_ID` |
| List Outdial ANI Entry(s) | List entries. | [`/organization/{orgid}/outdial-ani/{outDialAniId}/entry`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani) | `List_Outdial_ANI_Entries` |
| List Outdial ANI(s) | Retrieve paginated mappings. | [`/organization/{orgid}/v2/outdial-ani`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani) | `List_Outdial_ANIs` |
| List references for a specific Outdial ANI | Watch incoming references. | [`/organization/{orgId}/outdial-ani/{id}/incoming-references`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani) | `List_Outdial_ANI_References` |
| Update specific Outdial ANI by ID | Update mapping. | [`/organization/{orgId}/outdial-ani/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani) | - |
| Update specific Outdial ANI Entry by ID | Update entry. | [`/organization/{orgid}/outdial-ani/{outDialAniId}/entry/{id}`](https://developer.webex.com/webex-contact-center/docs/api/v1/outdial-ani) | - |
