# Webex Team API Operations Schema

This document outlines the API operations available for the Webex Contact Center `Team` resource.

| Operation | HTTP Method | Endpoint URL Path | Description |
| :--- | :--- | :--- | :--- |
| **List Team(s)** | `GET` | `/organization/{orgId}/v2/team` | Retrieve all Team(s) in a given organization. (Version 2) |
| **Create a new Team** | `POST` | `/organization/{orgId}/team` | Create a new Team in a given organization. |
| **Get specific Team by ID** | `GET` | `/organization/{orgId}/team/{id}` | Retrieve an existing Team by ID in a given organization. |
| **Update specific Team by ID** | `PUT` | `/organization/{orgId}/team/{id}` | Update an existing Team by ID in a given organization. |
| **Delete specific Team by ID** | `DELETE` | `/organization/{orgId}/team/{id}` | Delete an existing Team by ID in a given organization. |
| **Bulk export Team(s)** | `GET` | `/organization/{orgId}/team/bulk-export` | Export all Team(s) in a given organization. |
| **Bulk save Team(s)** | `POST` | `/organization/{orgId}/team/bulk` | Create, update, or delete Team(s) in bulk. |
| **List references for a specific Team** | `GET` | `/organization/{orgId}/team/{id}/incoming-references` | Retrieve a list of all entities that have a reference. |
| **Purge inactive Team(s)** | `POST` | `/organization/{orgId}/team/purge-inactive-entities` | Purge inactive Team(s) older than the configured interval. |
