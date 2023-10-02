# Gest.js

<p align="center">
  <img src="https://raw.githubusercontent.com/scorpio-demon/Gest.js/main/gestjs.png" alt="gestjs" width="200" height="241" style="display: block; margin: 30 auto" />
</p>

![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/scorpio-demon/gestjs/codeql.yml)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-1.0.2-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
[![npm](https://img.shields.io/npm/dt/gestjs.svg)](https://www.npmjs.com/package/gestjs)

SDK for working with openStreetMap REST API

You can read more in here: <https://wiki.openstreetmap.org/wiki/API_v0.6>

⚠️⚠️⚠️ Some of functions need authentication. Please make sure that you signed up in the webiste (main and dev) and use you auth1.0 or auth2.0 method to access these functions. ⚠️⚠️⚠️

- [Gest.js](#gestjs)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Versions](#versions)
    - [Capabilities](#capabilities)
    - [Map](#map)
    - [Permissions](#permissions)
    - [Changeset create](#changeset-create)
    - [Changeset get](#changeset-get)
    - [Changeset update](#changeset-update)
    - [Changeset close](#changeset-close)
    - [Changeset download](#changeset-download)
    - [Changeset get query](#changeset-get-query)
    - [Changeset diff upload](#changeset-diff-upload)
    - [Changeset comment](#changeset-comment)
    - [Changeset subscribe](#changeset-subscribe)
    - [Changeset unsubscribe](#changeset-unsubscribe)
    - [Changeset hide comment](#changeset-hide-comment)
    - [Changeset unhide comment](#changeset-unhide-comment)
    - [Create node](#create-node)
    - [Create way](#create-way)
    - [Create relation](#create-relation)
    - [Get node](#get-node)
    - [Get way](#get-way)
    - [Get relation](#get-relation)
    - [Update node](#update-node)
    - [Update way](#update-way)
    - [Update relation](#update-relation)
    - [Delete node](#delete-node)
    - [Delete way](#delete-way)
    - [Delete relation](#delete-relation)
    - [Get node history](#get-node-history)
    - [Get way history](#get-way-history)
    - [Get relation history](#get-relation-history)
    - [Get node version](#get-node-version)
    - [Get way version](#get-way-version)
    - [Get relation version](#get-relation-version)
    - [Get nodes parameters](#get-nodes-parameters)
    - [Get ways parameters](#get-ways-parameters)
    - [Get relations parameters](#get-relations-parameters)
    - [Get relations for node](#get-relations-for-node)
    - [Get relations for way](#get-relations-for-way)
    - [Get relations for relation :)](#get-relations-for-relation-)
    - [Full get way](#full-get-way)
    - [Full get relation](#full-get-relation)
    - [Redaction node](#redaction-node)
    - [Redaction way](#redaction-way)
    - [Redaction relation](#redaction-relation)
    - [Get GPS point](#get-gps-point)
    - [Create gpx](#create-gpx)
    - [Update gpx](#update-gpx)
    - [Delete gpx](#delete-gpx)
    - [Download meta deta gpx](#download-meta-deta-gpx)
    - [Download data gpx](#download-data-gpx)
    - [List gpx files](#list-gpx-files)
    - [Get user detail](#get-user-detail)
    - [Get multi users details](#get-multi-users-details)
    - [Get detail of logged in user](#get-detail-of-logged-in-user)
    - [Get preferences of logged in user](#get-preferences-of-logged-in-user)
    - [Upload preferences](#upload-preferences)
    - [Get preferences with key](#get-preferences-with-key)
    - [Set preference with key](#set-preference-with-key)
    - [Delete preference with key](#delete-preference-with-key)
    - [Get notes](#get-notes)
    - [Get note](#get-note)
    - [Create note xml](#create-note-xml)
    - [Create note json](#create-note-json)
    - [Create note comment xml](#create-note-comment-xml)
    - [Close note](#close-note)
    - [Reopen note](#reopen-note)
    - [Hide note](#hide-note)
    - [Search notes](#search-notes)
    - [Get RSS feed](#get-rss-feed)
  - [License](#license)

## Installation

Fitst install lib: `npm install gestjs`

Import and create an object. You can pass the API url that you want to use it with specific version.
The default api url is `Dev` url and version is `0.6`

```typescript
import Gestjs from 'gestjs'

// With default url and api version
// devUrl: https://master.apis.dev.openstreetmap.org/api
// apiVersion: 0.6
const gestjs = new Gestjs();

// With specific url and api version
const apiUrl = 'https://api.openstreetmap.org/api'
const apiVersion = '0.6'
const gestjs = new Gestjs(apiUrl,apiVersion);
```

## Usage

After making object, you can use functions in object and get result in `XML` and `JSON` fromat.

### Versions

The `versions` function is used to retrieve a list of API versions supported by this instance.

| Parameter    | Type            | Description                                         |
| ------------ | --------------- | --------------------------------------------------- |
| returnMethod | "xml" \| "json" | (optional) Choose return method, default is "json". |

| Return Type                             | Description                                                |
| --------------------------------------- | ---------------------------------------------------------- |
| Promise\<XMLDocument \| JSON \| Error\> | Returns a list of API versions supported by this instance. |

<br/>

### Capabilities

The `capabilities` function is meant to provide information about the capabilities and limitations of the current API.

| Parameter    | Type            | Description                                         |
| ------------ | --------------- | --------------------------------------------------- |
| returnMethod | "xml" \| "json" | (optional) Choose return method, default is "json". |

| Return Type                             | Description                                                                                                             |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Promise\<XMLDocument \| JSON \| Error\> | Returns an XML document (content type text/xml) or JSON describing the capabilities and limitations of the current API. |

<br/>

### Map

The `map` function is retrieving map data by bounding box: GET /api/0.6/map

| Parameter | Type                                                                        | Description                                 |
| --------- | --------------------------------------------------------------------------- | ------------------------------------------- |
| boxObj    | `boxT`                                                                      | Object containing bounding box coordinates: |
|           | - `left`: Longitude of the left (westernmost) side of the bounding box.     |
|           | - `bottom`: Latitude of the bottom (southernmost) side of the bounding box. |
|           | - `right`: Longitude of the right (easternmost) side of the bounding box.   |
|           | - `top`: Latitude of the top (northernmost) side of the bounding box.       |

| Return Type                     | Description                                                                                                                                                                                                                                                                                                                              |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Returns an XML document containing all nodes that are inside the given bounding box, any relations that reference them, all ways that reference at least one node inside the bounding box, any relations that reference those ways, and any nodes outside the bounding box that the ways may reference. This does not apply recursively. |

<br/>

### Permissions

The `permissions` function is retrieving permissions: GET /api/0.6/permissions or /api/0.6/permissions.json

| Parameter    | Type            | Description                                         |
| ------------ | --------------- | --------------------------------------------------- |
| returnMethod | "json" \| "xml" | (optional) Choose return method, default is "json". |

| Return Type                                                                                                                                                                                                                                       | Description                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Promise\<XMLDocument \| JSON \| Error\>                                                                                                                                                                                                           | Returns information about permissions: |
| - If the API client is not authorized, an empty list of permissions will be returned.                                                                                                                                                             |
| - If the API client uses Basic Auth, the list of permissions will contain all permissions.                                                                                                                                                        |
| - If the API client uses OAuth 1.0a, the list will contain the permissions actually granted by the user.                                                                                                                                          |
| - If the API client uses OAuth 2.0, the list will be based on the granted scopes. Note that for compatibility reasons, all OAuth 2.0 scopes will be prefixed by "allow_", e.g. scope "read_prefs" will be shown as permission "allow_read_prefs". |

<br/>

### Changeset create

The `changesetCreate` function creates: PUT /api/0.6/changeset/create

| Parameter | Type   | Description                                         |
| --------- | ------ | --------------------------------------------------- |
| xmlBody   | string | (optional) The XML body for the changeset creation. |

| Return Type                     | Description                                                                      |
| ------------------------------- | -------------------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Returns the ID of the newly created changeset with a content type of text/plain. |

<br/>

### Changeset get

The `changesetGet` function reads: GET /api/0.6/changeset/#id?include_discussion=true or /api/0.6/changeset/#id.json?include_discussion=true

| Parameter          | Type            | Description                                                                                                                                                                               |
| ------------------ | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                 | `strOrNum`      | The ID of the changeset to retrieve.                                                                                                                                                      |
| include_discussion | boolean         | Indicates whether the result should contain the changeset discussion or not. If set to `true`, the discussion is returned; if empty or omitted, the discussion will not be in the result. |
| returnMethod       | "json" \| "xml" | (optional) Choose return method, default is "json".                                                                                                                                       |

| Return Type                             | Description                                                |
| --------------------------------------- | ---------------------------------------------------------- |
| Promise\<XMLDocument \| JSON \| Error\> | Returns the changeset with the given ID in OSM-XML format. |

<br/>

### Changeset update

The `changesetUpdate` function is for updating tags on the changeset, e.g. changeset comment=foo

| Parameter | Type       | Description                                                                                                      |
| --------- | ---------- | ---------------------------------------------------------------------------------------------------------------- |
| id        | `strOrNum` | The ID of the changeset to update. The user issuing this API call has to be the same that created the changeset. |
| xmlBody   | string     | Text/xml data for the update.                                                                                    |

| Return Type                     | Description                                                                                          |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Returns an OSM document containing the new version of the changeset with a content type of text/xml. |

<br/>

### Changeset close

The `changesetClose` function closes a changeset. A changeset may already have been closed without the owner issuing this API call. In this case an error code is returned.

| Parameter | Type       | Description                                                                                                               |
| --------- | ---------- | ------------------------------------------------------------------------------------------------------------------------- |
| id        | `strOrNum` | The ID of the changeset to close. The user issuing this API call has to be the same as the one who created the changeset. |

| Return Type                     | Description                                                                         |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Upon successful closing of a changeset (HTTP status code 200), nothing is returned. |

<br/>

### Changeset download

The `changesetDownload` function returns the OsmChange document describing all changes associated with the changeset.

| Parameter | Type       | Description                                                   |
| --------- | ---------- | ------------------------------------------------------------- |
| id        | `strOrNum` | The ID of the changeset for which the OsmChange is requested. |

| Return Type                     | Description                                                                                                                    |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Promise\<XMLDocument \| Error\> | Returns the OsmChange document describing all changes associated with the specified changeset with a content type of text/xml. |

<br/>

### Changeset get query

The `changesetGetQuery` function is for querying changesets. It supports querying by different criteria.

| Parameter | Type                                                                                                                                   | Description                                                             |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| inputData | `changesetGetQueryT`                                                                                                                   | An object containing various query parameters for filtering changesets: |
|           | - `box`: Bounding box in the format `bbox=min_lon,min_lat,max_lon,max_lat` (W,S,E,N) to find changesets within the given bounding box. |
|           | - `user`: User ID or display name to find changesets by the user with the given user ID or display name (providing both is an error).  |
|           | - `display_name`: Display name to find changesets by the user with the given display name.                                             |
|           | - `time`: Time range for finding changesets. Can be a single timestamp `T1` or a range `T1,T2`.                                        |
|           | - `open`: Set to `true` to find only open changesets that are not closed or have not reached the element limit.                        |
|           | - `closed`: Set to `true` to find only closed changesets or those that have reached the element limit.                                 |
|           | - `changesets`: Find changesets with specific IDs (comma-separated).                                                                   |
|           | - `limit`: Maximum number of changesets to return (1 to maximum limit value).                                                          |
          
| Return Type                     | Description                                                                                                                                                                               |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Returns a list of all changesets ordered by creation date. The `<osm>` element may be empty if there were no results for the query. The response is sent with a content type of text/xml. |

<br/>

### Changeset diff upload

The `changesetGetQuery` function calls files in the OsmChange format can be uploaded to the server. This is guaranteed to be running in a transaction. So either all the changes are applied or none.

| Parameter | Type       | Description                                           |
| --------- | ---------- | ----------------------------------------------------- |
| id        | `strOrNum` | The ID of the changeset this diff belongs to.         |
| body      | any        | The OsmChange file data to be uploaded to the server. |

| Return Type                     | Description                                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Promise\<XMLDocument \| Error\> | If a diff is successfully applied, an XML document (content type text/xml) is returned in a specific format. |

<br/>

### Changeset comment

The `changesetComment` function adds a comment to a changeset. The changeset must be closed.

⚠️ **Auth needed**

| Parameter | Type       | Description                                                                            |
| --------- | ---------- | -------------------------------------------------------------------------------------- |
| id        | `strOrNum` | The ID of the changeset this comment belongs to.                                       |
| comment   | string     | The comment text to be added. The content type is "application/x-www-form-urlencoded". |

| Return Type                     | Description                                             |
| ------------------------------- | ------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | This request needs to be done as an authenticated user. |

<br/>

### Changeset subscribe

The `changesetSubscribe` function subscribes to the discussion of a changeset to receive notifications for new comments.

⚠️ **Auth needed**

| Parameter | Type       | Description                                                |
| --------- | ---------- | ---------------------------------------------------------- |
| id        | `strOrNum` | The ID of the changeset to which the subscription belongs. |

| Return Type                     | Description                                             |
| ------------------------------- | ------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | This request needs to be done as an authenticated user. |

<br/>

### Changeset unsubscribe

The `changesetUnsubscribe` function unsubscribe from the discussion of a changeset to stop receiving notifications.

⚠️ **Auth needed**

| Parameter | Type       | Description                                        |
| --------- | ---------- | -------------------------------------------------- |
| id        | `strOrNum` | The ID of the changeset from which to unsubscribe. |

| Return Type                     | Description                                             |
| ------------------------------- | ------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | This request needs to be done as an authenticated user. |

<br/>

### Changeset hide comment

The `changesetHideComment` function sets visible flag on changeset comment to false.

⚠️ **Auth needed**

| Parameter | Type       | Description                                             |
| --------- | ---------- | ------------------------------------------------------- |
| id        | `strOrNum` | The ID of the changeset comment to flag as not visible. |

| Return Type                     | Description                                                                                                                                   |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | This request needs to be done as an authenticated user with moderator role. Note that the changeset comment ID differs from the changeset ID. |

<br/>

### Changeset unhide comment

The `changesetUnhideComment` function sets visible flag on changeset comment to true.

⚠️ **Auth needed**

| Parameter | Type       | Description                                         |
| --------- | ---------- | --------------------------------------------------- |
| id        | `strOrNum` | The ID of the changeset comment to flag as visible. |

| Return Type                     | Description                                                                                                                                   |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | This request needs to be done as an authenticated user with moderator role. Note that the changeset comment ID differs from the changeset ID. |

<br/>

### Create node

The `createNode` function creates a new element of the specified type. Note that the entire request should be wrapped in a `<osm>...</osm>` element.

| Parameter | Type   | Description                         |
| --------- | ------ | ----------------------------------- |
| xmlBody   | string | The data of the node to be created. |

| Return Type                     | Description                                                                    |
| ------------------------------- | ------------------------------------------------------------------------------ |
| Promise\<XMLDocument \| Error\> | Returns the ID of the newly created element with a content type of text/plain. |

<br/>

### Create way

The `createWay` function creates a new element of the specified type. Note that the entire request should be wrapped in a `<osm>...</osm>` element.

| Parameter | Type   | Description                        |
| --------- | ------ | ---------------------------------- |
| xmlBody   | string | The data of the way to be created. |

| Return Type                     | Description                                                                    |
| ------------------------------- | ------------------------------------------------------------------------------ |
| Promise\<XMLDocument \| Error\> | Returns the ID of the newly created element with a content type of text/plain. |

<br/>

### Create relation

The `createRelation` function creates a new element of the specified type. Note that the entire request should be wrapped in a `<osm>...</osm>` element.

| Parameter | Type   | Description                             |
| --------- | ------ | --------------------------------------- |
| xmlBody   | string | The data of the relation to be created. |

| Return Type                     | Description                                                                    |
| ------------------------------- | ------------------------------------------------------------------------------ |
| Promise\<XMLDocument \| Error\> | Returns the ID of the newly created element with a content type of text/plain. |

<br/>

### Get node

The `getNode` function reads: GET /api/0.6/node/#id or /api/0.6/node/#id.json

| Parameter    | Type            | Description                                         |
| ------------ | --------------- | --------------------------------------------------- |
| id           | `strOrNum`      | The ID of the node to retrieve.                     |
| returnMethod | "json" \| "xml" | (optional) Choose return method, default is "json". |

| Return Type                             | Description                                    |
| --------------------------------------- | ---------------------------------------------- |
| Promise\<XMLDocument \| JSON \| Error\> | Returns the XML representation of the element. |

<br/>

### Get way

The `getWay` function reads: GET /api/0.6/way/#id or /api/0.6/way/#id.json

| Parameter    | Type            | Description                                         |
| ------------ | --------------- | --------------------------------------------------- |
| id           | `strOrNum`      | The ID of the way to retrieve.                      |
| returnMethod | "json" \| "xml" | (optional) Choose return method, default is "json". |

| Return Type                             | Description                                    |
| --------------------------------------- | ---------------------------------------------- |
| Promise\<XMLDocument \| JSON \| Error\> | Returns the XML representation of the element. |

<br/>

### Get relation

The `getRelation` function reads: GET /api/0.6/relation/#id or /api/0.6/relation/#id.json

| Parameter    | Type            | Description                                         |
| ------------ | --------------- | --------------------------------------------------- |
| id           | `strOrNum`      | The ID of the relation to retrieve.                 |
| returnMethod | "json" \| "xml" | (optional) Choose return method, default is "json". |

| Return Type                             | Description                                    |
| --------------------------------------- | ---------------------------------------------- |
| Promise\<XMLDocument \| JSON \| Error\> | Returns the XML representation of the element. |

<br/>

### Update node

The `updateNode` function updates data from a preexisting element. A full representation of the element as it should be after the update has to be provided. Any tags, way-node refs, and relation members that remain unchanged must be in the update as well. A version number must be provided as well, it must match the current version of the element in the database.

| Parameter | Type       | Description                                                                                                                                                                                                                      |
| --------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | `strOrNum` | The ID of the node to update.                                                                                                                                                                                                    |
| xmlBody   | string     | The full representation of the node after the update. It should include any unchanged tags, way-node refs, and relation members. A version number must be provided, matching the current version of the element in the database. |

| Return Type                     | Description                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Returns the new version number of the updated node with a content type of text/plain. |

<br/>

### Update way

The `updateWay` function updates data from a preexisting element. A full representation of the element as it should be after the update has to be provided. Any tags, way-node refs, and relation members that remain unchanged must be in the update as well. A version number must be provided as well, it must match the current version of the element in the database.

| Parameter | Type       | Description                                                                                                                                                                                                                     |
| --------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | `strOrNum` | The ID of the way to update.                                                                                                                                                                                                    |
| xmlBody   | string     | The full representation of the way after the update. It should include any unchanged tags, way-node refs, and relation members. A version number must be provided, matching the current version of the element in the database. |

| Return Type                     | Description                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| Promise\<XMLDocument \| Error\> | Returns the new version number of the updated way with a content type of text/plain. |

<br/>

### Update relation

The `updateRelation` function updates data from a preexisting element. A full representation of the element as it should be after the update has to be provided. Any tags, way-node refs, and relation members that remain unchanged must be in the update as well. A version number must be provided as well, it must match the current version of the element in the database.

| Parameter | Type       | Description                                                                                                                                                                                                                          |
| --------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| id        | `strOrNum` | The ID of the relation to update.                                                                                                                                                                                                    |
| xmlBody   | string     | The full representation of the relation after the update. It should include any unchanged tags, way-node refs, and relation members. A version number must be provided, matching the current version of the element in the database. |

| Return Type                     | Description                                                                               |
| ------------------------------- | ----------------------------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Returns the new version number of the updated relation with a content type of text/plain. |

<br/>

### Delete node

The `deleteNode` function expects a valid XML representation of the element to be deleted.

| Parameter | Type       | Description                                          |
| --------- | ---------- | ---------------------------------------------------- |
| id        | `strOrNum` | The ID of the way to delete.                         |
| xmlBody   | string     | A valid XML representation of the way to be deleted. |

| Return Type                     | Description                                                       |
| ------------------------------- | ----------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Returns the new version number with a content type of text/plain. |

<br/>

### Delete way

The `deleteWay` function expects a valid XML representation of the element to be deleted.

| Parameter | Type       | Description                                           |
| --------- | ---------- | ----------------------------------------------------- |
| id        | `strOrNum` | The ID of the node to delete.                         |
| xmlBody   | string     | A valid XML representation of the node to be deleted. |

| Return Type                     | Description                                                       |
| ------------------------------- | ----------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Returns the new version number with a content type of text/plain. |

<br/>

### Delete relation

The `deleteRelation` function expects a valid XML representation of the element to be deleted.

| Parameter | Type       | Description                                               |
| --------- | ---------- | --------------------------------------------------------- |
| id        | `strOrNum` | The ID of the relation to delete.                         |
| xmlBody   | string     | A valid XML representation of the relation to be deleted. |

| Return Type                     | Description                                                       |
| ------------------------------- | ----------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Returns the new version number with a content type of text/plain. |

<br/>

### Get node history

The `getNodeHistory` function gets node history: GET /api/0.6/way/#id/history

| Parameter | Type       | Description                                    |
| --------- | ---------- | ---------------------------------------------- |
| id        | `strOrNum` | The ID of the way to retrieve the history for. |

| Return Type                     | Description                                                         |
| ------------------------------- | ------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Retrieves all old versions of the specified way as an XML document. |

<br/>

### Get way history

The `getWayHistory` function gets way history: GET /api/0.6/way/#id/history

| Parameter | Type       | Description                                         |
| --------- | ---------- | --------------------------------------------------- |
| id        | `strOrNum` | The ID of the relation to retrieve the history for. |

| Return Type                     | Description                                                              |
| ------------------------------- | ------------------------------------------------------------------------ |
| Promise\<XMLDocument \| Error\> | Retrieves all old versions of the specified relation as an XML document. |

<br/>

### Get relation history

The `getRelationHistory` function gets relation history: GET /api/0.6/relation/#id/history

| Parameter | Type       | Description                                         |
| --------- | ---------- | --------------------------------------------------- |
| id        | `strOrNum` | The ID of the relation to retrieve the history for. |

| Return Type                     | Description                                                              |
| ------------------------------- | ------------------------------------------------------------------------ |
| Promise\<XMLDocument \| Error\> | Retrieves all old versions of the specified relation as an XML document. |

<br/>

### Get node version

The `getNodeVersion` function gets node version: GET /api/0.6/node/#id/#version

| Parameter | Type       | Description                                            |
| --------- | ---------- | ------------------------------------------------------ |
| id        | `strOrNum` | The ID of the node to retrieve a specific version for. |
| version   | `strOrNum` | The specific version number of the node to retrieve.   |

| Return Type                     | Description                                                            |
| ------------------------------- | ---------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Retrieves a specific version of the specified node as an XML document. |

<br/>

### Get way version

The `getWayVersion` function gets way version: GET /api/0.6/way/#id/#version

| Parameter | Type       | Description                                           |
| --------- | ---------- | ----------------------------------------------------- |
| id        | `strOrNum` | The ID of the way to retrieve a specific version for. |
| version   | `strOrNum` | The specific version number of the way to retrieve.   |

| Return Type                     | Description                                                            |
| ------------------------------- | ---------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Retrieves a specific version of the specified node as an XML document. |

<br/>

### Get relation version

The `getRelationVersion` function gets relation version: GET /api/0.6/relation/#id/#version

| Parameter | Type       | Description                                                |
| --------- | ---------- | ---------------------------------------------------------- |
| id        | `strOrNum` | The ID of the relation to retrieve a specific version for. |
| version   | `strOrNum` | The specific version number of the relation to retrieve.   |

| Return Type                     | Description                                                            |
| ------------------------------- | ---------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Retrieves a specific version of the specified node as an XML document. |

<br/>

### Get nodes parameters

The `getNodesParameters` function allows a user to fetch multiple nodes at once.

| Parameter  | Type  | Description                                                                                                                                                                                                                                                             |
| ---------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| parameters | any[] | An array of parameters to specify the nodes to fetch. Each parameter should be the same as in the URL (e.g., `123`, `456`, `789`). Version numbers for each object may be optionally provided following a lowercase "v" character (e.g., `421586779v1`, `421586779v2`). |

| Return Type                     | Description                                                            |
| ------------------------------- | ---------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Retrieves multiple versions of the specified nodes as an XML document. |

<br/>

### Get ways parameters

The `getWaysParameters` function allows a user to fetch multiple ways at once.

| Parameter  | Type  | Description                                                                                                                                                                                                                                                            |
| ---------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| parameters | any[] | An array of parameters to specify the ways to fetch. Each parameter should be the same as in the URL (e.g., `123`, `456`, `789`). Version numbers for each object may be optionally provided following a lowercase "v" character (e.g., `421586779v1`, `421586779v2`). |

| Return Type                     | Description                                                           |
| ------------------------------- | --------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Retrieves multiple versions of the specified ways as an XML document. |

<br/>

### Get relations parameters

The `getRelationsParameters` function allows a user to fetch multiple relations at once.

| Parameter  | Type  | Description                                                                                                                                                                                                                                                                 |
| ---------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| parameters | any[] | An array of parameters to specify the relations to fetch. Each parameter should be the same as in the URL (e.g., `123`, `456`, `789`). Version numbers for each object may be optionally provided following a lowercase "v" character (e.g., `421586779v1`, `421586779v2`). |

| Return Type                     | Description                                                                |
| ------------------------------- | -------------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Retrieves multiple versions of the specified relations as an XML document. |

<br/>

### Get relations for node

The `getRelationsForNode` function to get relations for node: GET /api/0.6/node/#id/relations

| Parameter | Type       | Description                                         |
| --------- | ---------- | --------------------------------------------------- |
| id        | `strOrNum` | The ID of the node for which to retrieve relations. |

| Return Type                     | Description                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Returns an XML document containing all (not deleted) relations in which the given node is used. |

<br/>

### Get relations for way

The `getRelationsForWay` function to get relations for way: GET /api/0.6/way/#id/relations

| Parameter | Type       | Description                                        |
| --------- | ---------- | -------------------------------------------------- |
| id        | `strOrNum` | The ID of the way for which to retrieve relations. |

| Return Type                     | Description                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Returns an XML document containing all (not deleted) relations in which the given node is used. |

<br/>

### Get relations for relation :)

The `getRelationsForRelation` function to get relations for relation: GET /api/0.6/relation/#id/relations

| Parameter | Type       | Description                                             |
| --------- | ---------- | ------------------------------------------------------- |
| id        | `strOrNum` | The ID of the relation for which to retrieve relations. |

| Return Type                     | Description                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Returns an XML document containing all (not deleted) relations in which the given node is used. |

<br/>

### Full get way

The `fullGetWay` function calls retrieves a way and all other elements referenced by it.

| Parameter | Type       | Description                                                                    |
| --------- | ---------- | ------------------------------------------------------------------------------ |
| id        | `strOrNum` | The ID of the way to retrieve, along with all other elements referenced by it. |

| Return Type                     | Description                                                                                            |
| ------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Promise\<XMLDocument \| Error\> | Retrieves the specified way along with the full XML representation of all nodes referenced by the way. |

<br/>

### Full get relation

The `fullGetRelation` function calls retrieves a relation and all other elements referenced by it.

| Parameter | Type       | Description                                                                         |
| --------- | ---------- | ----------------------------------------------------------------------------------- |
| id        | `strOrNum` | The ID of the relation to retrieve, along with all other elements referenced by it. |

| Return Type                     | Description                                                                                                                                                                                                                |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Retrieves the specified relation along with all nodes, ways, and relations that are members of the relation, plus all nodes used by ways referenced by the relation. The same recursive logic is not applied to relations. |

<br/>

### Redaction node

The `redactionNode` function originally created for the ODbL license change to hide contributions from users that did not accept the new CT/licence. It is now used by the DWG to hide old versions of elements containing data privacy or copyright infringements. All API retrieval request for the element #version will return an HTTP error 403.

| Parameter    | Type       | Description                                             |
| ------------ | ---------- | ------------------------------------------------------- |
| id           | `strOrNum` | The ID of the node for which to apply redaction.        |
| version      | `strOrNum` | The specific version number of the node to redact.      |
| redaction_id | `strOrNum` | The ID of the redaction operation to apply to the node. |

| Return Type                     | Description                                                                                                                                                                   |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Applies redaction to the specified version of the node based on the provided redaction ID. All API retrieval requests for the redacted element will return an HTTP error 403. |

<br/>

### Redaction way

The `redactionWay` function originally created for the ODbL license change to hide contributions from users that did not accept the new CT/licence. It is now used by the DWG to hide old versions of elements containing data privacy or copyright infringements. All API retrieval request for the element #version will return an HTTP error 403.

| Parameter    | Type       | Description                                            |
| ------------ | ---------- | ------------------------------------------------------ |
| id           | `strOrNum` | The ID of the way for which to apply redaction.        |
| version      | `strOrNum` | The specific version number of the way to redact.      |
| redaction_id | `strOrNum` | The ID of the redaction operation to apply to the way. |

| Return Type                     | Description                                                                                                                                                                  |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Applies redaction to the specified version of the way based on the provided redaction ID. All API retrieval requests for the redacted element will return an HTTP error 403. |

<br/>

### Redaction relation

The `redactionRelation` function originally created for the ODbL license change to hide contributions from users that did not accept the new CT/licence. It is now used by the DWG to hide old versions of elements containing data privacy or copyright infringements. All API retrieval request for the element #version will return an HTTP error 403.

| Parameter    | Type       | Description                                                 |
| ------------ | ---------- | ----------------------------------------------------------- |
| id           | `strOrNum` | The ID of the relation for which to apply redaction.        |
| version      | `strOrNum` | The specific version number of the relation to redact.      |
| redaction_id | `strOrNum` | The ID of the redaction operation to apply to the relation. |

| Return Type                     | Description                                                                                                                                                                       |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Applies redaction to the specified version of the relation based on the provided redaction ID. All API retrieval requests for the redacted element will return an HTTP error 403. |

<br/>

### Get GPS point

The `getGpsPoint` function retrieve the GPS track points that are inside a given bounding box (formatted in a GPX format). The maximal width (right - left) and height (top - bottom) of the bounding box is 0.25 degree.

| Parameter  | Type       | Description                                                                                                                    |
| ---------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| boxObj     | `boxT`     | An object defining the bounding box coordinates. It includes the left, bottom, right, and top coordinates of the bounding box. |
| pageNumber | `strOrNum` | The number of the page to retrieve, specifying which group of 5,000 points to return.                                          |

| Return Type                     | Description                                                                                                                                                                                                            |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Retrieves GPS track points that are inside the specified bounding box and are formatted in GPX format. The function supports pagination, allowing you to retrieve points in batches of 5,000 based on the page number. |

<br/>

### Create gpx

The `createGpx` function uploads a GPX file or archive of GPX files. Requires authentication.

⚠️ **Auth needed**

| Parameter | Type  | Description                                                                                                       |
| --------- | ----- | ----------------------------------------------------------------------------------------------------------------- |
| body      | `any` | The parameters required in a `multipart/form-data` HTTP message for uploading a GPX file or archive of GPX files. |

| Return Type                     | Description                                                                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Uploads a GPX file or archive of GPX files. This function requires authentication and returns a number representing the ID of the new GPX file. |

<br/>

### Update gpx

The `updateGpx` function updates a GPX file. Only usable by the owner account. Requires authentication.

⚠️ **Auth needed**

| Parameter | Type       | Description                                                                                  |
| --------- | ---------- | -------------------------------------------------------------------------------------------- |
| id        | `strOrNum` | The ID of the GPX file to update. Only usable by the owner account. Requires authentication. |
| body      | `any`      | The parameters required in a `multipart/form-data` HTTP message for updating the GPX file.   |

| Return Type                     | Description                                                                                   |
| ------------------------------- | --------------------------------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Updates a GPX file. This function requires authentication and returns an empty response body. |

<br/>

### Delete gpx

The `deleteGpx` function deletes a GPX file. Only usable by the owner account. Requires authentication.

⚠️ **Auth needed**

| Parameter | Type       | Description                                                                                  |
| --------- | ---------- | -------------------------------------------------------------------------------------------- |
| id        | `strOrNum` | The ID of the GPX file to delete. Only usable by the owner account. Requires authentication. |
| body      | `any`      | The parameters required in a `multipart/form-data` HTTP message for deleting the GPX file.   |

| Return Type                     | Description                                                                                   |
| ------------------------------- | --------------------------------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Deletes a GPX file. This function requires authentication and returns an empty response body. |

<br/>

### Download meta deta gpx

The `downloadMetaDetaGpx` function has access to the metadata about a GPX file. Available without authentication if the file is marked public. Otherwise only usable by the owner account and requires authentication.

| Parameter | Type       | Description                                                                                                                                                                              |
| --------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | `strOrNum` | The ID of the GPX file to access metadata about. Available without authentication if the file is marked public. Otherwise, only usable by the owner account and requires authentication. |

| Return Type                     | Description                                                                                                                                                                                               |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Accesses metadata about a GPX file. This function can be used without authentication if the file is marked as public. Otherwise, it requires authentication and returns OSM/XML metadata of the GPX file. |

<br/>

### Download data gpx

The `downloadDataGpx` function downloads the full GPX file. Available without authentication if the file is marked public. Otherwise only usable by the owner account and requires authentication. ' The response will always be a GPX format file if you use a .gpx URL suffix, a XML file in an undocumented format if you use a .xml URL suffix, otherwise the response will be the exact file that was uploaded.

| Parameter | Type       | Description                                                                                                                                                                 |
| --------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | `strOrNum` | The ID of the GPX file to download. Available without authentication if the file is marked public. Otherwise, only usable by the owner account and requires authentication. |

| Return Type                     | Description                                                                                                                                                                                                                                                                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Downloads the full GPX file. This function can be used without authentication if the file is marked as public. Otherwise, it requires authentication and returns OSM/XML data of the GPX file. The response format depends on the URL suffix used: .gpx for GPX format, .xml for XML format, or the exact uploaded file format. |

<br/>

### List gpx files

The `listGpxFiles` function gets a list of GPX traces owned by the authenticated user: Requires authentication.

⚠️ **Auth needed**

| Return Type                     | Description                                                                                                                                                           |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Retrieves a list of GPX traces owned by the authenticated user. Requires authentication. This call always returns GPX traces for the current authenticated user only. |

<br/>

### Get user detail

The `getUserDetail` function gets details of a user: GET /api/0.6/user/#id or /api/0.6/user/#id.json

| Parameter      | Type                                    | Description                                                           |
| -------------- | --------------------------------------- | --------------------------------------------------------------------- |
| `id`           | `strOrNum`                              | The id of the user.                                                   |
| `returnMethod` | `"json"` or `"xml"`                     | (optional) Choose return method, default is `"json"`.                 |
| Return Type    | `Promise<XMLDocument \| JSON \| Error>` | Retrieves user details or an empty file if the user has been deleted. |

<br/>

### Get multi users details

The `getMultiUsersDetails` function gets details of multiple users: GET /api/0.6/users?users=#id1,#id2,...,#idn or /api/0.6/users.json?users=#id1,#id2,...,#idn

| Parameter      | Type                                    | Description                                                                                               |
| -------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `ids`          | `strOrNum[]`                            | An array of user ids.                                                                                     |
| `returnMethod` | `"json"` or `"xml"`                     | (optional) Choose return method, default is `"json"`.                                                     |
| Return Type    | `Promise<XMLDocument \| JSON \| Error>` | Retrieves user details for the specified user ids or an empty file if any of the users have been deleted. |

<br/>

### Get detail of logged in user

The `getDetailOfLoggedInUser` function gets details of the logged-in user: GET /api/0.6/user/details or /api/0.6/user/details.json

| Parameter      | Type                                    | Description                                                                           |
| -------------- | --------------------------------------- | ------------------------------------------------------------------------------------- |
| `returnMethod` | `"json"` or `"xml"`                     | (optional) Choose return method, default is `"json"`.                                 |
| Return Type    | `Promise<XMLDocument \| JSON \| Error>` | Retrieves details of the logged-in user or an error if the user is not authenticated. |

<br/>

### Get preferences of logged in user

The `getPreferencesOfLoggedInUser` function gets preferences of the logged-in user: GET /api/0.6/user/preferences or /api/0.6/user/preferences.json

| Parameter      | Type                                    | Description                                                                               |
| -------------- | --------------------------------------- | ----------------------------------------------------------------------------------------- |
| `returnMethod` | `"json"` or `"xml"`                     | (optional) Choose return method, default is `"json"`.                                     |
| Return Type    | `Promise<XMLDocument \| JSON \| Error>` | Retrieves preferences of the logged-in user or an error if the user is not authenticated. |

<br/>

### Upload preferences

The `uploadPreferences` function has same structure in the body of the a PUT will upload preferences. All existing preferences are replaced by the newly uploaded set.

| Parameter   | Type                            | Description                                                              |
| ----------- | ------------------------------- | ------------------------------------------------------------------------ |
| `body`      | `any`                           | The data to be uploaded as preferences.                                  |
| Return Type | `Promise<XMLDocument \| Error>` | Uploads the provided preferences and returns an XMLDocument or an error. |

<br/>

### Get preferences with key

The `getPreferencesWithKey` function get preference with your key

| Parameter   | Type                                      | Description                                                                                            |
| ----------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `key`       | `strOrNum`                                | Your preference key.                                                                                   |
| Return Type | `Promise<XMLDocument \| Error \| string>` | Retrieves a preference value associated with the provided key and returns it as a string, or an error. |

<br/>

### Set preference with key

The `setPreferencesWithKey` function will set a single preference's value to a string passed as the content of the request.

| Parameter   | Type                            | Description                                                                                                  |
| ----------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `key`       | `strOrNum`                      | Your preference key.                                                                                         |
| `body`      | `any`                           | The string value to set as the preference content.                                                           |
| Return Type | `Promise<XMLDocument \| Error>` | Sets a single preference's value using the provided key and content, and returns an XMLDocument or an Error. |

<br/>

### Delete preference with key

In the `deletePreferenceWithKey` function, a single preference entry can be deleted with. In this instance, the payload of the request should only contain the value of the preference, i.e. not XML formatted.

| Parameter   | Type                            | Description                                                                                      |
| ----------- | ------------------------------- | ------------------------------------------------------------------------------------------------ |
| `key`       | `strOrNum`                      | Your preference key.                                                                             |
| Return Type | `Promise<XMLDocument \| Error>` | Deletes a single preference entry using the provided key and returns an XMLDocument or an Error. |

<br/>

### Get notes

In the `getNotes` function returns the existing notes in the specified bounding box.

| Parameter       | Type   | Description                                                         |
| --------------- | ------ | ------------------------------------------------------------------- |
| `boxObj`        | Object | An object representing the bounding box.                            |
| `boxObj.left`   | Number | The longitude of the left (westernmost) side of the bounding box.   |
| `boxObj.bottom` | Number | The latitude of the bottom (southernmost) side of the bounding box. |
| `boxObj.right`  | Number | The longitude of the right (easternmost) side of the bounding box.  |
| `boxObj.top`    | Number | The latitude of the top (northernmost) side of the bounding box.    |


| Return Type             | Description                                                         |
| ----------------------- | ------------------------------------------------------------------- |
| `XMLDocument` or `JSON` | Application/xml or application/json response containing notes data. |
| `Error`                 | An error object if there's an issue with the request or response.   |

<br/>

### Get note

In the `getNote` function returns the existing note with the given ID. The output can be in several formats (e.g. XML, RSS, json or GPX) depending on the file extension.

| Parameter      | Type       | Description                                   |
| -------------- | ---------- | --------------------------------------------- |
| `id`           | `strOrNum` | The ID of the changeset this flag belongs to. |
| `returnMethod` | `"json"    | "xml"`                                        | (optional) Choose return method, default is "json". |
| Return Type    |            | `XMLDocument                                  | JSON                                                | Error` |

<br/>

### Create note xml

In the `createNoteXml` function creates a new note: POST /api/0.6/notes

| Parameter   | Type       | Description                           |
| ----------- | ---------- | ------------------------------------- |
| `text`      | `string`   | The text content of the note.         |
| `lat`       | `strOrNum` | The latitude coordinate of the note.  |
| `lon`       | `strOrNum` | The longitude coordinate of the note. |
| Return Type |            | `XMLDocument                          | Error` |

<br/>

### Create note json

In the `createNoteJson` function creates a new note: POST /api/0.6/notes.json

| Parameter   | Type        | Description                                    |
| ----------- | ----------- | ---------------------------------------------- |
| `body`      | `noteBodyT` | An object containing note data in JSON format. |
| Return Type |             | `XMLDocument                                   | Error` |

<br/>

### Create note comment xml

In the `createNoteCommentXml` function adds a new comment to note #id

| Parameter   | Type       | Description                                            |
| ----------- | ---------- | ------------------------------------------------------ |
| `id`        | `strOrNum` | The ID of the note to which you want to add a comment. |
| `comment`   | `string`   | The text of the comment you want to add to the note.   |
| Return Type |            | `XMLDocument                                           | Error` |

<br/>

### Close note

In the `closeNote` function closes a note as fixed. This request needs to be done as an authenticated user.

⚠️ **Auth needed**

| Parameter   | Type       | Description                                 |
| ----------- | ---------- | ------------------------------------------- |
| `id`        | `strOrNum` | The ID of the note you want to close.       |
| `comment`   | `string`   | The comment or reason for closing the note. |
| Return Type |            | `XMLDocument                                | Error` |

<br/>

### Reopen note

In the `reopenNote` function reopens a closed note. This request needs to be done as an authenticated user.

⚠️ **Auth needed**

| Parameter   | Type       | Description                                   |
| ----------- | ---------- | --------------------------------------------- |
| `id`        | `strOrNum` | The ID of the note you want to reopen.        |
| `comment`   | `string`   | The comment or reason for reopening the note. |
| Return Type |            | `XMLDocument                                  | Error` |

<br/>

### Hide note

In the `hideNote` function hides (deletes) a note. This request needs to be done as an authenticated user. Use Reopen request to make the note visible again.

⚠️ **Auth needed**

| Parameter   | Type       | Description                                |
| ----------- | ---------- | ------------------------------------------ |
| `id`        | `strOrNum` | The ID of the note you want to hide.       |
| `comment`   | `string`   | The comment or reason for hiding the note. |
| Return Type |            | `XMLDocument                               | Error` |

<br/>

### Search notes

In the `searchNotes` function searchs for notes: GET /api/0.6/notes/search .The list of notes can be returned in several different forms (e.g. XML, RSS, json or GPX) depending on file extension given.

| Parameter     | Type                          | Description                                         |
| ------------- | ----------------------------- | --------------------------------------------------- |
| `searchTerms` | `{ [key: string]: strOrNum }` | An object representing the search terms and values. |
| Return Type   |                               | `XMLDocument                                        | JSON | string | Error` |

<br/>

### Get RSS feed

In the `getRSSFeed` function gets an RSS feed for notes within an area.

| Parameter   | Type | Description                                |
| ----------- | ---- | ------------------------------------------ |
| None        |      | There are no parameters for this function. |
| Return Type |      | `XMLDocument                               | Error` |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The MIT License is a permissive open-source license that allows you to freely use, modify, distribute, and sublicense this software for both commercial and non-commercial purposes. You can find the full text of the MIT License in the [LICENSE](LICENSE) file included with this project.

Feel free to fork this project and use it in your own work, but please make sure to give proper attribution and include the original license text.