# Webex Users API Operations Schema

This document outlines the API operations available for the Webex Contact Center `Users` resource.

| Operation | HTTP Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Bulk export User(s)** | `GET` | `/organization/{orgid}/user/bulk-export` | Export all User(s) in a given organization. |
| **Bulk partial update Users** | `PATCH` | `/organization/{orgid}/user/bulk` | Update some or all properties for multiple users in bulk for a given organization. |
| **Get specific User along with profile by ID** | `GET` | `/organization/{orgid}/user/with-user-profile/{id}` | Retrieve an existing User along with the corresponding UserProfile by ID. |
| **Get specific User by CI User ID** | `GET` | `/organization/{orgid}/v2/user/by-ci-user-id/{id}` | Retrieve an existing User using the CI ID. |
| **Get specific User by ID** | `GET` | `/organization/{orgid}/user/{id}` | Retrieve an existing Users by ID. |
| **Get specific Users by provided IDs** | `POST` | `/organization/{orgid}/user/fetch-user-details-by-ids` | Retrieve an existing User's details by list of IDs. |
| **Get the agents matching skill requirements criteria** | `POST` | `/organization/{orgid}/user/fetch-by-skill-requirements` | Fetch the agents who match the provided skill requirements criteria. |
| **List references for a specific User** | `GET` | `/organization/{orgid}/user/{id}/incoming-references` | Retrieve a list of all entities that have reference to an existing User by ID. |
| **List User(s)** | `GET` | `/organization/{orgid}/v2/user` | Retrieve a list of User(s). |
| **List Users along with profile** | `GET` | `/organization/{orgid}/user/with-user-profile` | Retrieve a list of User(s) along with their UserProfiles. |
| **Partially update User by ID** | `PATCH` | `/organization/{orgid}/user/{id}` | Partially update User by ID. |
| **Update specific User by ID** | `PUT` | `/organization/{orgid}/user/{id}` | Update an existing User by ID. |
