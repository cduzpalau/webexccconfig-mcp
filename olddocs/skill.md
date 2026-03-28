# Webex Skill API Operations Schema

This document outlines the API operations available for the Webex Contact Center `Skill` resource. It is retrieved directly from the official Webex Developer documentation.

| Operation | Method | Endpoint URL Path | Description |
| :--- | :--- | :--- | :--- |
| **Bulk export Skill(s)** | `GET` | `/organization/{orgId}/skill/bulk-export` | Export all Skill(s) in a given organization. |
| **Bulk save Skill(s)** | `POST` | `/organization/{orgid}/skill/bulk` | Create, Update or delete Skill(s) in bulk in a given organization. |
| **Create a new Skill** | `POST` | `/organization/{orgid}/skill` | Create a new Skill in a given organization. |
| **Delete specific Skill by ID** | `DELETE` | `/organization/{orgid}/skill/{id}` | Delete an existing Skill by ID in a given organization. |
| **Get specific Skill by ID** | `GET` | `/organization/{orgid}/skill/{id}` | Retrieve an existing Skill by ID in a given organization. |
| **List references for a specific Skill** | `GET` | `/organization/{orgid}/skill/{id}/incoming-references` | Retrieve a list of all entities that have reference to an existing Skill by ID in a given organization. |
| **List Skill(s) (v1)** | `GET` | `/organization/{orgid}/skill` | Retrieve a list of Skill(s) in a given organization. |
| **List Skill(s) (v2)** | `GET` | `/organization/{orgid}/v2/skill` | Retrieve a list of Skill(s) in a given organization (optimized version returning minimal fields). |
| **Purge inactive Skill(s)** | `POST` | `/organization/{orgid}/skill/purge-inactive-entities` | Purge inactive Skill(s) older than the configured interval for a given organization. |
| **Update specific Skill by ID** | `PUT` | `/organization/{orgid}/skill/{id}` | Update an existing Skill by ID in a given organization. |
