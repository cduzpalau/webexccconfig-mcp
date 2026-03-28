# Business Hours API Documentation

Includes Business Hours, Holiday List, and Overrides.

## 1. Business Hours Operations

| Operation | Method | Endpoint |
| :--- | :--- | :--- |
| Bulk export Business Hours | GET | `/organization/{orgid}/business-hours/bulk-export` |
| Bulk save Business Hours | POST | `/organization/{orgid}/business-hours/bulk` |
| Create Business Hours | POST | `/organization/{orgid}/business-hours` |
| Delete Business Hours | DELETE | `/organization/{orgid}/business-hours/{id}` |
| Get Business Hours | GET | `/organization/{orgid}/business-hours/{id}` |
| List Business Hours | GET | `/organization/{orgid}/business-hours` |
| List References | GET | `/organization/{orgid}/business-hours/{id}/incoming-references` |
| Update Business Hours | PUT | `/organization/{orgid}/business-hours/{id}` |

**Key Schema (`BusinessHoursDTO`):**
- `name` (string, required)
- `timezone` (string, required, e.g., "America/New_York")
- `description` (string)
- `holidaysId` (string)
- `overridesId` (string)
- `workingHours` (`WorkingHoursDTO[]`):
    - `workingHourName` (string)
    - `startTime` (string, e.g., "09:00")
    - `endTime` (string, e.g., "18:00")
    - `workingDays` (string[], e.g., ["MONDAY", "TUESDAY"])

## 2. Holiday List Operations

| Operation | Method | Endpoint |
| :--- | :--- | :--- |
| Bulk export Holiday List | GET | `/organization/{orgid}/holiday-list/bulk-export` |
| Bulk save Holiday List | POST | `/organization/{orgid}/holiday-list/bulk` |
| Create Holiday List | POST | `/organization/{orgid}/holiday-list` |
| Delete Holiday List | DELETE | `/organization/{orgid}/holiday-list/{id}` |
| Get Holiday List | GET | `/organization/{orgid}/holiday-list/{id}` |
| List Holiday List | GET | `/organization/{orgid}/holiday-list` |
| List References | GET | `/organization/{orgid}/holiday-list/{id}/incoming-references` |
| Update Holiday List | PUT | `/organization/{orgid}/holiday-list/{id}` |

**Key Schema (`HolidayListDTO`):**
- `name` (string, required)
- `description` (string)
- `holidays` (`HolidaysDTO[]`):
    - `name` (string)
    - `allDay` (boolean)
    - `startDate` (ISO8601 date-time)
    - `endDate` (ISO8601 date-time)

## 3. Overrides Operations

| Operation | Method | Endpoint |
| :--- | :--- | :--- |
| Bulk export Overrides | GET | `/organization/{orgid}/overrides/bulk-export` |
| Bulk save Overrides | POST | `/organization/{orgid}/overrides/bulk` |
| Create Overrides | POST | `/organization/{orgid}/overrides` |
| Delete Overrides | DELETE | `/organization/{orgid}/overrides/{id}` |
| Get Overrides | GET | `/organization/{orgid}/overrides/{id}` |
| List Overrides | GET | `/organization/{orgid}/overrides` |
| List References | GET | `/organization/{orgid}/overrides/{id}/incoming-references` |
| Update Overrides | PUT | `/organization/{orgid}/overrides/{id}` |

**Key Schema (`OverridesDTO`):**
- `name` (string, required)
- `timezone` (string, required)
- `description` (string)
- `overrides` (`OverrideDTO[]`):
    - `name` (string)
    - `allDay` (boolean)
    - `startDate` (ISO8601 date-time)
    - `endDate` (ISO8601 date-time)
    - `startTime` (string)
    - `endTime` (string)
