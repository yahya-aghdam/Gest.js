# Gest.js

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

| Parameter  | Type  | Description                                                                                                                                                                                                                                                             |
| ---------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| parameters | any[] | An array of parameters to specify the ways to fetch. Each parameter should be the same as in the URL (e.g., `123`, `456`, `789`). Version numbers for each object may be optionally provided following a lowercase "v" character (e.g., `421586779v1`, `421586779v2`). |

| Return Type                     | Description                                                            |
| ------------------------------- | ---------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Retrieves multiple versions of the specified ways as an XML document. |

<br/>

### Get relations parameters

The `getRelationsParameters` function allows a user to fetch multiple relations at once.

| Parameter  | Type  | Description                                                                                                                                                                                                                                                             |
| ---------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| parameters | any[] | An array of parameters to specify the relations to fetch. Each parameter should be the same as in the URL (e.g., `123`, `456`, `789`). Version numbers for each object may be optionally provided following a lowercase "v" character (e.g., `421586779v1`, `421586779v2`). |

| Return Type                     | Description                                                            |
| ------------------------------- | ---------------------------------------------------------------------- |
| Promise\<XMLDocument \| Error\> | Retrieves multiple versions of the specified relations as an XML document. |

