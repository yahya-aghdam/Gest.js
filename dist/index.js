import isEmpty from "lodash/isEmpty";
import { fetcher, interfaceToURLSearchParams } from "./lib/handler";
import { url } from "./lib/url";
import urljoin from "url-join";
const apiVersion = "0.6";
/**
 * You can do any method in openStreetMap official v0.6 api
 *
 * @param {string} apiUrl - (optional) api url for OSM, default is Dev url.
 * @param {string} apiV - (optional) version of api, default is 0.6
 */
export default class Gestjs {
    apiUrl;
    apiV;
    constructor(apiUrl = url.dev, apiV = apiVersion) {
        this.apiUrl = apiUrl;
        this.apiV = apiV;
    }
    //ANCHOR - Headers
    xmlHeader = {
        "Content-Type": "application/xml",
    };
    formHeader = {
        "Content-Type": "application/x-www-form-urlencoded",
    };
    multiPartFormHeader = {
        "Content-Type": "multipart/form-data",
    };
    textHeader = {
        "Content-Type": "text/plain",
    };
    jsonHeader = {
        "Content-Type": "application/json",
    };
    jsonDefiner(path, returnMethod = "json") {
        let returnPath = path;
        if (returnMethod == "json")
            returnPath += ".json";
        return returnPath;
    }
    // ANCHOR - Get
    async get(path) {
        const url = urljoin(this.apiUrl, this.apiV);
        return await fetcher(url, path, { method: "GET" });
    }
    // ANCHOR - Put
    async put(path, headers, body) {
        const url = urljoin(this.apiUrl, this.apiV);
        return await fetcher(url, path, { method: "PUT", headers, body });
    }
    // ANCHOR - Post
    async post(path, headers, body) {
        const url = urljoin(this.apiUrl, this.apiV);
        return await fetcher(url, path, { method: "POST", headers, body });
    }
    // ANCHOR - Delete
    async delete(path, headers, body) {
        const url = urljoin(this.apiUrl, this.apiV);
        return await fetcher(url, path, { method: "DELETE", headers, body });
    }
    //ANCHOR - Requests
    /**
     * Available API versions: GET /api/versions or /api/versions.json
     *
     * @param {"xml" | "json"} returnMethod - (optional) choose return method, default is "json".
     * @return {XMLDocument | JSON | Error}  Returns a list of API versions supported by this instance.
     */
    async versions(returnMethod = "json") {
        return await fetcher(this.apiUrl, this.jsonDefiner("versions", returnMethod), { method: "GET" });
    }
    /**
     * This API call is meant to provide information about the capabilities and limitations of the current API.
     *
     * @param {"xml" | "json"} returnMethod - (optional) choose return method, default is "json".
     * @return {XMLDocument | JSON | Error}  Returns a XML document (content type text/xml)
     */
    async capabilities(returnMethod = "json") {
        return await fetcher(this.apiUrl, this.jsonDefiner("capabilities", returnMethod), { method: "GET" });
    }
    /**
     * Retrieving map data by bounding box: GET /api/0.6/map
     *
     * @param {boxT} boxObj - left is the longitude of the left (westernmost) side of the bounding box.
  bottom is the latitude of the bottom (southernmost) side of the bounding box.
  right is the longitude of the right (easternmost) side of the bounding box.
  top is the latitude of the top (northernmost) side of the bounding box.
     * @return {XMLDocument | Error}  All nodes that are inside a given bounding box and any relations that reference them.
  All ways that reference at least one node that is inside a given bounding box, any relations that reference them [the ways], and any nodes outside the bounding box that the ways may reference.
  All relations that reference one of the nodes, ways or relations included due to the above rules. (Does not apply recursively, see explanation below.)
     */
    async map({ left, bottom, right, top, }) {
        const path = `map?bbox=${left},${bottom},${right},${top}`;
        return await this.get(path);
    }
    /**
     * Retrieving permissions: GET /api/0.6/permissions or /api/0.6/permissions.json
     *
     * @param {"xml" | "json"} returnMethod - (optional) choose return method, default is "json".
     * @return {XMLDocument | JSON | Error}  If the API client is not authorized, an empty list of permissions will be returned.
  If the API client uses Basic Auth, the list of permissions will contain all permissions.
  If the API client uses OAuth 1.0a, the list will contain the permissions actually granted by the user.
  If the API client uses OAuth 2.0, the list will be based on the granted scopes.
  Note that for compatibility reasons, all OAuth 2.0 scopes will be prefixed by "allow_", e.g. scope "read_prefs" will be shown as permission "allow_read_prefs".
     */
    async permissions(returnMethod = "json") {
        return await this.get(this.jsonDefiner("permissions", returnMethod));
    }
    /**
     * Create: PUT /api/0.6/changeset/create
     *
     * @param {string} xmlBody - (optional) choose return method, default is "json".
     * @return {XMLDocument | Error}  The ID of the newly created changeset with a content type of text/plain
     */
    async changesetCreate(xmlBody) {
        const path = "changeset/create";
        return await this.put(path, this.xmlHeader, xmlBody);
    }
    /**
     * Read: GET /api/0.6/changeset/#id?include_discussion=true or /api/0.6/changeset/#id.json?include_discussion=true
     *
     * @param {strOrNum} id - The id of the changeset to retrieve
     * @param {boolean} include_discussion - Indicates whether the result should contain the changeset discussion or not. If this parameter is set to anything, the discussion is returned. If it is empty or omitted, the discussion will not be in the result.
     * @param {"xml" | "json"} returnMethod - (optional) choose return method, default is "json".
     * @return {XMLDocument | JSON | Error}  Returns the changeset with the given id in OSM-XML format.
     */
    async changesetGet(id, include_discussion = true, returnMethod = "json") {
        const editedPath = this.jsonDefiner(`changeset/${id}`, returnMethod);
        const path = `${editedPath}?include_discussion=${include_discussion}`;
        return await this.get(path);
    }
    /**
     * For updating tags on the changeset, e.g. changeset comment=foo.
     *
     * @param {strOrNum} id - The id of the changeset to update. The user issuing this API call has to be the same that created the changeset
     * @param {string} xmlBody - text/xml data for update
     * @return {XMLDocument | Error} An OSM document containing the new version of the changeset with a content type of text/xml
     */
    async changesetUpdate(id, xmlBody) {
        const path = `changeset/${id}`;
        return await this.put(path, this.xmlHeader, xmlBody);
    }
    /**
     * Closes a changeset. A changeset may already have been closed without the owner issuing this API call. In this case an error code is returned.
     *
     * @param {strOrNum} id - The id of the changeset to close. The user issuing this API call has to be the same that created the changeset.
     * @return {XMLDocument | Error} Nothing is returned upon successful closing of a changeset (HTTP status code 200)
     */
    async changesetClose(id) {
        const path = `changeset/${id}/close`;
        return await this.put(path);
    }
    /**
     * Returns the OsmChange document describing all changes associated with the changeset.
     *
     * @param {strOrNum} id - The id of the changeset for which the OsmChange is requested.
     * @return {XMLDocument | Error} The OsmChange XML with a content type of text/xml.
     */
    async changesetDownload(id) {
        const path = `changeset/${id}/download`;
        return await this.get(path);
    }
    //! must be test
    /**
     * This is an API method for querying changesets. It supports querying by different criteria.
     *
     * @param {changesetGetQueryT} inputData - bbox=min_lon,min_lat,max_lon,max_lat (W,S,E,N)
  Find changesets within the given bounding box
  user=#uid or display_name=#name
  Find changesets by the user with the given user id or display name. Providing both is an error.
  time=T1
  Find changesets closed after T1
  time=T1,T2
  Find changesets that were closed after T1 and created before T2. In other words, any changesets that were open at some time during the given time range T1 to T2.
  open=true
  Only finds changesets that are still open but excludes changesets that are closed or have reached the element limit for a changeset (10.000 at the moment[4])
  closed=true
  Only finds changesets that are closed or have reached the element limit
  changesets=#cid{,#cid}
  Finds changesets with the specified ids (since 2013-12-05)
  limit=N
  Specifies the maximum number of changesets returned. A number between 1 and the maximum limit value (currently 100). If omitted, the default limit value is used (currently 100). The actual maximum and default limit values can be found with a capabilities request.
     * @return {XMLDocument | Error} Returns a list of all changeset ordered by creation date. The <osm> element may be empty if there were no results for the query. The response is sent with a content type of text/xml.
     */
    async changesetGetQuery(inputData) {
        let path = "";
        if (!isEmpty(inputData.box)) {
            path = `bbox=${(inputData.box.min_lon,
                inputData.box.min_lat,
                inputData.box.max_lon,
                inputData.box.max_lon)}`;
        }
        if (!isEmpty(inputData.user)) {
            path = `user=${inputData.user}`;
        }
        if (!isEmpty(inputData.display_name)) {
            path = `display_name=${inputData.display_name}`;
        }
        if (!isEmpty(inputData.time)) {
            if (typeof inputData.time == "number" ||
                typeof inputData.time == "string") {
                path = `time=${inputData.time}`;
            }
            else {
                path = `time=${inputData.time?.T1},${inputData.time?.T2}`;
            }
        }
        if (!isEmpty(inputData.open)) {
            path = `open=${inputData.open}`;
        }
        if (!isEmpty(inputData.closed)) {
            path = `closed=${inputData.closed}`;
        }
        if (!isEmpty(inputData.changesets)) {
            if (typeof inputData.changesets == "string") {
                path = `changesets=${inputData.changesets}`;
            }
            else {
                if (inputData.changesets != undefined) {
                    path = `changesets={${inputData.changesets.toString()}}`;
                }
            }
        }
        if (!isEmpty(inputData.limit)) {
            path = `limit=${inputData.limit}`;
        }
        return await this.get(path);
    }
    /**
     * With this API call files in the OsmChange format can be uploaded to the server. This is guaranteed to be running in a transaction. So either all the changes are applied or none.
     *
     * @param {strOrNum} id - The ID of the changeset this diff belongs to.
     * @param {any} body - The OsmChange file data
     * @return {XMLDocument | Error} If a diff is successfully applied a XML (content type text/xml) is returned in the following format
     */
    async changesetDiffUpload(id, body) {
        const path = `changeset/${id}/create`;
        return await this.put(path, this.xmlHeader, body);
    }
    //! auth needed
    /**
     * Add a comment to a changeset. The changeset must be closed.
     *
     * @param {strOrNum} id - The ID of the changeset this comment belongs to.
     * @param {string} comment - The comment text. The content type is "application/x-www-form-urlencoded".
     * @return {XMLDocument | Error} This request needs to be done as an authenticated user.
     */
    async changesetComment(id, comment) {
        const path = `changeset/${id}/create`;
        return await this.post(path, this.formHeader, comment);
    }
    //! auth needed
    /**
     * Subscribe to the discussion of a changeset to receive notifications for new comments.
     *
     * @param {strOrNum} id - The ID of the changeset this subscribe belongs to.
     * @return {XMLDocument | Error} This request needs to be done as an authenticated user.
     */
    async changesetSubscribe(id) {
        const path = `changeset/${id}/subscribe`;
        return await this.post(path, this.formHeader);
    }
    //! auth needed
    /**
     * Unsubscribe from the discussion of a changeset to stop receiving notifications.
     *
     * @param {strOrNum} id - The ID of the changeset this unsubscribe belongs to.
     * @return {XMLDocument | Error} This request needs to be done as an authenticated user.
     */
    async changesetUnsubscribe(id) {
        const path = `changeset/${id}/unsubscribe`;
        return await this.post(path, this.formHeader);
    }
    //! auth needed
    /**
     * Sets visible flag on changeset comment to false.
     *
     * @param {strOrNum} id - The ID of the changeset this flag belongs to.
     * @return {XMLDocument | Error} This request needs to be done as an authenticated user with moderator role.
  Note that the changeset comment id differs from the changeset id.
     */
    async changesetHideComment(id) {
        const path = `changeset/comment/${id}/hide`;
        return await this.post(path);
    }
    //! auth needed
    /**
     * Sets visible flag on changeset comment to true.
     *
     * @param {strOrNum} id - The ID of the changeset this flag belongs to.
     * @return {XMLDocument | Error} This request needs to be done as an authenticated user with moderator role.
  Note that the changeset comment id differs from the changeset id.
     */
    async changesetUnhideComment(id) {
        const path = `changeset/comment/${id}/unhide`;
        return await this.post(path);
    }
    /**
     * Creates a new element of the specified type. Note that the entire request should be wrapped in a <osm>...</osm> element.
     *
     * @param {string} xmlBody - The data of node
     * @return {XMLDocument | Error} The ID of the newly created element (content type is text/plain)
     */
    async createNode(xmlBody) {
        const path = `node/create`;
        return await this.put(path, this.xmlHeader, xmlBody);
    }
    /**
     * Creates a new element of the specified type. Note that the entire request should be wrapped in a <osm>...</osm> element.
     *
     * @param {string} xmlBody - The data of way
     * @return {XMLDocument | Error} The ID of the newly created element (content type is text/plain)
     */
    async createWay(xmlBody) {
        const path = `way/create`;
        return await this.put(path, this.xmlHeader, xmlBody);
    }
    /**
     * Creates a new element of the specified type. Note that the entire request should be wrapped in a <osm>...</osm> element.
     *
     * @param {string} xmlBody - The data of relation
     * @return {XMLDocument | Error} The ID of the newly created element (content type is text/plain)
     */
    async createRelation(xmlBody) {
        const path = `relation/create`;
        return await this.put(path, this.xmlHeader, xmlBody);
    }
    /**
     * Read: GET /api/0.6/node/#id or /api/0.6/node/#id.json
     *
     * @param {strOrNum} id - The ID of the node
     * @return {XMLDocument | Error} Returns the XML representation of the element.
     */
    async getNode(id, returnMethod = "json") {
        const path = `node/${this.jsonDefiner(`${id}`, returnMethod)}`;
        return await this.get(path);
    }
    /**
     * Read: GET /api/0.6/way/#id or /api/0.6/way/#id.json
     *
     * @param {strOrNum} id - The ID of the way
     * @return {XMLDocument | Error} Returns the XML representation of the element.
     */
    async getWay(id, returnMethod = "json") {
        const path = `way/${this.jsonDefiner(`${id}`, returnMethod)}`;
        return await this.get(path);
    }
    /**
     * Read: GET /api/0.6/relation/#id or /api/0.6/relation/#id.json
     *
     * @param {strOrNum} id - The ID of the relation
     * @return {XMLDocument | Error} Returns the XML representation of the element.
     */
    async getRelation(id, returnMethod = "json") {
        const path = `relation/${this.jsonDefiner(`${id}`, returnMethod)}`;
        return await this.get(path);
    }
    /**
     * Updates data from a preexisting element. A full representation of the element as it should be after the update has to be provided. Any tags, way-node refs, and relation members that remain unchanged must be in the update as well. A version number must be provided as well, it must match the current version of the element in the database.
     *
     * @param {strOrNum} id - The ID of the node
     * @return {XMLDocument | Error} Returns the new version number with a content type of text/plain.
     */
    async updateNode(id, xmlBody) {
        const path = `node/${id}`;
        return await this.put(path, this.xmlHeader, xmlBody);
    }
    /**
     * Updates data from a preexisting element. A full representation of the element as it should be after the update has to be provided. Any tags, way-node refs, and relation members that remain unchanged must be in the update as well. A version number must be provided as well, it must match the current version of the element in the database.
     *
     * @param {strOrNum} id - The ID of the way
     * @return {XMLDocument | Error} Returns the new version number with a content type of text/plain.
     */
    async updateWay(id, xmlBody) {
        const path = `way/${id}`;
        return await this.put(path, this.xmlHeader, xmlBody);
    }
    /**
     * Updates data from a preexisting element. A full representation of the element as it should be after the update has to be provided. Any tags, way-node refs, and relation members that remain unchanged must be in the update as well. A version number must be provided as well, it must match the current version of the element in the database.
     *
     * @param {strOrNum} id - The ID of the relation
     * @return {XMLDocument | Error} Returns the new version number with a content type of text/plain.
     */
    async updateRelation(id, xmlBody) {
        const path = `relation/${id}`;
        return await this.put(path, this.xmlHeader, xmlBody);
    }
    /**
     * Expects a valid XML representation of the element to be deleted.
     *
     * @param {strOrNum} id - The ID of the node
     * @return {XMLDocument | Error} Returns the new version number with a content type of text/plain.
     */
    async deleteNode(id, xmlBody) {
        const path = `node/${id}`;
        return await this.delete(path, this.xmlHeader, xmlBody);
    }
    /**
     * Expects a valid XML representation of the element to be deleted.
     *
     * @param {strOrNum} id - The ID of the way
     * @return {XMLDocument | Error} Returns the new version number with a content type of text/plain.
     */
    async deleteWay(id, xmlBody) {
        const path = `way/${id}`;
        return await this.delete(path, this.xmlHeader, xmlBody);
    }
    /**
     * Expects a valid XML representation of the element to be deleted.
     *
     * @param {strOrNum} id - The ID of the relation
     * @return {XMLDocument | Error} Returns the new version number with a content type of text/plain.
     */
    async deleteRelation(id, xmlBody) {
        const path = `relation/${id}`;
        return await this.delete(path, this.xmlHeader, xmlBody);
    }
    /**
     * History: GET /api/0.6/node/#id/history
     *
     * @param {strOrNum} id - The ID of the node
     * @return {XMLDocument | Error} Retrieves all old versions of an element.
     */
    async getNodeHistory(id) {
        const path = `node/${id}/history`;
        return await this.get(path);
    }
    /**
     * History: GET /api/0.6/way/#id/history
     *
     * @param {strOrNum} id - The ID of the way
     * @return {XMLDocument | Error} Retrieves all old versions of an element.
     */
    async getWayHistory(id) {
        const path = `way/${id}/history`;
        return await this.get(path);
    }
    /**
     * History: GET /api/0.6/relation/#id/history
     *
     * @param {strOrNum} id - The ID of the relation
     * @return {XMLDocument | Error} Retrieves all old versions of an element.
     */
    async getRelationHistory(id) {
        const path = `relation/${id}/history`;
        return await this.get(path);
    }
    /**
     * Version: GET /api/0.6/node/#id/#version
     *
     * @param {strOrNum} id - The ID of the node
     * @return {XMLDocument | Error} Retrieves a specific version of the element.
     */
    async getNodeVersion(id, version) {
        const path = `node/${id}/${version}`;
        return await this.get(path);
    }
    /**
     * Version: GET /api/0.6/way/#id/#version
     *
     * @param {strOrNum} id - The ID of the way
     * @return {XMLDocument | Error} Retrieves a specific version of the element.
     */
    async getWayVersion(id, version) {
        const path = `way/${id}/${version}`;
        return await this.get(path);
    }
    /**
     * Version: GET /api/0.6/relation/#id/#version
     *
     * @param {strOrNum} id - The ID of the relation
     * @return {XMLDocument | Error} Retrieves a specific version of the element.
     */
    async getRelationVersion(id, version) {
        const path = `relation/${id}/${version}`;
        return await this.get(path);
    }
    /**
     * Allows a user to fetch multiple nodes at once.
     *
     * @param {any[]} parameters - The parameter has to be the same in the URL (e.g. /api/0.6/nodes?nodes=123,456,789)
  Version numbers for each object may be optionally provided following a lowercase "v" character, e.g. /api/0.6/nodes?nodes=421586779v1,421586779v2
     * @return {XMLDocument | Error} Retrieves multi version of the element.
     */
    async getNodesParameters(parameters) {
        const path = `nodes?nodes=${parameters}`;
        return await this.get(path);
    }
    /**
     * Allows a user to fetch multiple ways at once.
     *
     * @param {any[]} parameters - The parameter has to be the same in the URL (e.g. /api/0.6/nodes?nodes=123,456,789)
  Version numbers for each object may be optionally provided following a lowercase "v" character, e.g. /api/0.6/nodes?nodes=421586779v1,421586779v2
     * @return {XMLDocument | Error} Retrieves multi version of the element.
     */
    async getWaysParameters(parameters) {
        const path = `ways?ways=${parameters}`;
        return await this.get(path);
    }
    /**
     * Allows a user to fetch multiple relations at once.
     *
     * @param {any[]} parameters - The parameter has to be the same in the URL (e.g. /api/0.6/nodes?nodes=123,456,789)
  Version numbers for each object may be optionally provided following a lowercase "v" character, e.g. /api/0.6/nodes?nodes=421586779v1,421586779v2
     * @return {XMLDocument | Error} Retrieves multi version of the element.
     */
    async getRelationsParameters(parameters) {
        const path = `relations?relations=${parameters}`;
        return await this.get(path);
    }
    /**
     * Relations for node: GET /api/0.6/node/#id/relations
     *
     * @param {strOrNum} id - The id of node
     * @return {XMLDocument | Error} Returns a XML document containing all (not deleted) relations in which the given element is used.
     */
    async getRelationsForNode(id) {
        const path = `node/${id}/relations`;
        return await this.get(path);
    }
    /**
     * Relations for way: GET /api/0.6/way/#id/relations
     *
     * @param {strOrNum} id - The id of way
     * @return {XMLDocument | Error} Returns a XML document containing all (not deleted) relations in which the given element is used.
     */
    async getRelationsForWay(id) {
        const path = `way/${id}/relations`;
        return await this.get(path);
    }
    /**
     * Relations for relation: GET /api/0.6/relation/#id/relations
     *
     * @param {strOrNum} id - The id of relation
     * @return {XMLDocument | Error} Returns a XML document containing all (not deleted) relations in which the given element is used.
     */
    async getRelationsForRelation(id) {
        const path = `relation/${id}/relations`;
        return await this.get(path);
    }
    /**
     * This API call retrieves a way and all other elements referenced by it
     *
     * @param {strOrNum} id - The id of way
     * @return {XMLDocument | Error} it will return the way specified plus the full XML of all nodes referenced by the way.
     */
    async fullGetWay(id) {
        const path = `way/${id}/full`;
        return await this.get(path);
    }
    /**
     * This API call retrieves a relation and all other elements referenced by it
     *
     * @param {strOrNum} id - The id of relation
     * @return {XMLDocument | Error} it will return The relation itself
  All nodes, ways, and relations that are members of the relation
  Plus all nodes used by ways from the previous step
  The same recursive logic is not applied to relations. This means: If relation r1 contains way w1 and relation r2, and w1 contains nodes n1 and n2, and r2 contains node n3, then a "full" request for r1 will give you r1, r2, w1, n1, and n2. Not n3.
     */
    async fullGetRelation(id) {
        const path = `way/${id}/relation`;
        return await this.get(path);
    }
    /**
     * This is an API method originally created for the ODbL license change to hide contributions from users that did not accept the new CT/licence. It is now used by the DWG to hide old versions of elements containing data privacy or copyright infringements. All API retrieval request for the element #version will return an HTTP error 403.
     *
     * @param {strOrNum} id - The id of node
     * @return {XMLDocument | Error}
     */
    async redactionNode(id, version, redaction_id) {
        const path = `node/${id}/${version}/redact?redaction=${redaction_id}`;
        return await this.post(path);
    }
    /**
     * This is an API method originally created for the ODbL license change to hide contributions from users that did not accept the new CT/licence. It is now used by the DWG to hide old versions of elements containing data privacy or copyright infringements. All API retrieval request for the element #version will return an HTTP error 403.
     *
     * @param {strOrNum} id - The id of way
     * @return {XMLDocument | Error}
     */
    async redactionWay(id, version, redaction_id) {
        const path = `way/${id}/${version}/redact?redaction=${redaction_id}`;
        return await this.post(path);
    }
    /**
     * This is an API method originally created for the ODbL license change to hide contributions from users that did not accept the new CT/licence. It is now used by the DWG to hide old versions of elements containing data privacy or copyright infringements. All API retrieval request for the element #version will return an HTTP error 403.
     *
     * @param {strOrNum} id - The id of relation
     * @return {XMLDocument | Error}
     */
    async redactionRelation(id, version, redaction_id) {
        const path = `relation/${id}/${version}/redact?redaction=${redaction_id}`;
        return await this.post(path);
    }
    /**
     * Use this to retrieve the GPS track points that are inside a given bounding box (formatted in a GPX format). The maximal width (right - left) and height (top - bottom) of the bounding box is 0.25 degree.
     *
     * @param {boxT} boxObj - left is the longitude of the left (westernmost) side of the bounding box.
  bottom is the latitude of the bottom (southernmost) side of the bounding box.
  right is the longitude of the right (easternmost) side of the bounding box.
  top is the latitude of the top (northernmost) side of the bounding box.
  pageNumber specifies which group of 5,000 points, or page, to return. Since the command does not return more than 5,000 points at a time, this parameter must be incremented—and the command sent again (using the same bounding box)—in order to retrieve all of the points for a bounding box that contains more than 5,000 points. When this parameter is 0 (zero), the command returns the first 5,000 points; when it is 1, the command returns points 5,001–10,000, etc.
     * @param {strOrNum} pageNumber - The number of page
     * @return {XMLDocument | Error} Retrieve the points for a bounding box
     */
    async getGpsPoint({ left, bottom, right, top }, pageNumber) {
        const path = `trackpoints?bbox=${left},${bottom},${right},${top}&page=${pageNumber}`;
        return await this.get(path);
    }
    //! auth needed
    /**
     * Use this to upload a GPX file or archive of GPX files. Requires authentication.
     *
     * @param {any} body - The parameters are required in a multipart/form-data HTTP message
     * @return {XMLDocument | Error} A number representing the ID of the new gpx
     */
    async createGpx(body) {
        const path = `gpx/create`;
        return await this.post(path, this.multiPartFormHeader, body);
    }
    //! auth needed
    /**
     * Use this to update a GPX file. Only usable by the owner account. Requires authentication.
     *
     * @param {strOrNum} id - The id of gpx
     * @param {any} body - The parameters are required in a multipart/form-data HTTP message
     * @return {XMLDocument | Error} The response body will be empty.
     */
    async updateGpx(id, body) {
        const path = `gpx/${id}`;
        return await this.put(path, this.multiPartFormHeader, body);
    }
    //! auth needed
    /**
     * Use this to delete a GPX file. Only usable by the owner account. Requires authentication.
     *
     * @param {strOrNum} id - The id of gpx
     * @param {any} body - The parameters are required in a multipart/form-data HTTP message
     * @return {XMLDocument | Error} The response body will be empty.
     */
    async deleteGpx(id, body) {
        const path = `gpx/${id}`;
        return await this.delete(path, this.multiPartFormHeader, body);
    }
    /**
     * Use this to access the metadata about a GPX file. Available without authentication if the file is marked public. Otherwise only usable by the owner account and requires authentication.
     *
     * @param {strOrNum} id - The id of gpx
     * @return {XMLDocument | Error} Will return OSM/XML meta data of the gpx
     */
    async downloadMetaDetaGpx(id) {
        const path = `gpx/${id}/details`;
        return await this.get(path);
    }
    /**
     * Use this to download the full GPX file. Available without authentication if the file is marked public. Otherwise only usable by the owner account and requires authentication. ' The response will always be a GPX format file if you use a .gpx URL suffix, a XML file in an undocumented format if you use a .xml URL suffix, otherwise the response will be the exact file that was uploaded.
     *
     * @param {strOrNum} id - The id of gpx
     * @return {XMLDocument | Error} Will return OSM/XML data of the gpx
     */
    async downloadDataGpx(id) {
        const path = `gpx/${id}/data`;
        return await this.get(path);
    }
    //! auth needed
    /**
     * Use this to get a list of GPX traces owned by the authenticated user: Requires authentication.
     *
     * @return {XMLDocument | Error} This call always returns GPX traces for the current authenticated user only
     */
    async listGpxFiles() {
        const path = `user/gpx_files`;
        return await this.get(path);
    }
    /**
     * Details of a user: GET /api/0.6/user/#id or /api/0.6/user/#id.json
     *
     * @param {strOrNum} id - The id of user
     * @param {"xml" | "json"} returnMethod - (optional) choose return method, default is "json".
     * @return {XMLDocument | Error} Will return user details or empty file if user be deleted.
     */
    async getUserDetail(id, returnMethod = "json") {
        const path = `user/${this.jsonDefiner(`${id}`, returnMethod)}`;
        return await this.get(path);
    }
    /**
     * Details of multiple users: GET /api/0.6/users?users=#id1,#id2,...,#idn or /api/0.6/users.json?users=#id1,#id2,...,#idn
     *
     * @param {strOrNum[]} ids - The ids of users
     * @param {"xml" | "json"} returnMethod - (optional) choose return method, default is "json".
     * @return {XMLDocument | Error} Will return user details or empty file if user be deleted.
     */
    async getMultiUsersDetails(ids, returnMethod = "json") {
        const path = `${this.jsonDefiner("users", returnMethod)}?=users=${ids}`;
        return await this.get(path);
    }
    /**
     * Details of the logged-in user: GET /api/0.6/user/details or /api/0.6/user/details.json
     *
     * @param {"xml" | "json"} returnMethod - (optional) choose return method, default is "json".
     * @return {XMLDocument | Error} Will return details of logged in users.
     */
    async getDetailOfLoggedInUser(returnMethod = "json") {
        const path = `user/${this.jsonDefiner("details", returnMethod)}`;
        return await this.get(path);
    }
    /**
     * Preferences of the logged-in user: GET /api/0.6/user/preferences or /api/0.6/user/preferences.json
     *
     * @param {"xml" | "json"} returnMethod - (optional) choose return method, default is "json".
     * @return {XMLDocument | Error} Will return preferences of logged in user
     */
    async getPreferencesOfLoggedInUser(returnMethod = "json") {
        const path = `user/${this.jsonDefiner("preferences", returnMethod)}`;
        return await this.get(path);
    }
    /**
     * The same structure in the body of the a PUT will upload preferences. All existing preferences are replaced by the newly uploaded set.
     *
     * @param {any} body - The data will be upload
     * @return {XMLDocument | Error}
     */
    async uploadPreferences(body) {
        const path = `/user/preferences`;
        return await this.put(path, this.textHeader, body);
    }
    /**
     * You can get preference with your key
     *
     * @param {strOrNum} key - Your key
     * @return {XMLDocument | Error | string} Returns a string with that preference's value.
     */
    async getPreferencesWithKey(key) {
        const path = `user/preferences/${key}`;
        return await this.get(path);
    }
    /**
     * Will set a single preference's value to a string passed as the content of the request.
     *
     * @param {strOrNum} key - Your key
     * @return {XMLDocument | Error}
     */
    async setPreferenceWithKey(key, body) {
        const path = `user/preferences/${key}`;
        return await this.put(path, this.textHeader, body);
    }
    /**
     * A single preference entry can be deleted with. In this instance, the payload of the request should only contain the value of the preference, i.e. not XML formatted.
     *
     * @param {strOrNum} key - Your key
     * @return {XMLDocument | Error}
     */
    async deletePreferenceWithKey(key) {
        const path = `user/preferences/${key}`;
        return await this.delete(path);
    }
    /**
     * Returns the existing notes in the specified bounding box
     *
     * @param {boxT} boxObj - left is the longitude of the left (westernmost) side of the bounding box.
  bottom is the latitude of the bottom (southernmost) side of the bounding box.
  right is the longitude of the right (easternmost) side of the bounding box.
  top is the latitude of the top (northernmost) side of the bounding box.
    * @param {"xml" | "json"} returnMethod - (optional) choose return method, default is "json".
    * @return {XMLDocument | Error}  Return type: application/xml
    */
    async getNotes({ left, bottom, right, top }, returnMethod = "json") {
        const path = `${this.jsonDefiner("notes", returnMethod)}?bbox=${left},${bottom},${right},${top}`;
        return await this.get(path);
    }
    /**
     * Returns the existing note with the given ID. The output can be in several formats (e.g. XML, RSS, json or GPX) depending on the file extension.
     *
     * @param {strOrNum} id - The ID of the changeset this flag belongs to.
     * @param {"xml" | "json"} returnMethod - (optional) choose return method, default is "json".
     * @return {XMLDocument | Error} Return type: application/xml
     */
    async getNote(id, returnMethod = "json") {
        const path = `${this.jsonDefiner("notes", returnMethod)}/${id}`;
        return await this.get(path);
    }
    /**
     * Create a new note: POST /api/0.6/notes
     *
     * @param {string} text - Text of note
     * @param { [key: string]: strOrNum} latLonObj - Detail of lat & lon
     * @return {XMLDocument | Error} An XML-file with the details of the note will be returned
     */
    async createNoteXml(text, { lat, lon }) {
        const path = `notes?lat=${lat}&lon=${lon}&text=${text}`;
        return await this.post(path);
    }
    /**
     * Create a new note: POST /api/0.6/notes.json
     *
     * @param { noteBodyT} body - like: {"lat":51.00, "lon": 0.1&, "text":"This is a note\n\nThis is another line"}
     * @return {XMLDocument | Error} A JSON-file with the details of the note will be returned
     */
    async createNoteJson(body) {
        const path = `notes.json`;
        return await this.post(path, this.jsonHeader, body);
    }
    /**
     * Add a new comment to note #id
     *
     * @param {strOrNum} id - id of note
     * @param {string} comment - Text of note
     * @return {XMLDocument | Error} The response will contain the XML of note.
     */
    async createNoteCommentXml(id, comment) {
        const path = `notes/${id}/comment?text=${comment}`;
        return await this.post(path);
    }
    //! auth needed
    /**
     * Close a note as fixed. This request needs to be done as an authenticated user.
     *
     * @param {strOrNum} id - id of note
     * @param {string} comment - Text of note
     * @return {XMLDocument | Error} Return type: application/xml
     */
    async closeNote(id, comment) {
        const path = `notes/${id}/close?text=${comment}`;
        return await this.post(path);
    }
    //! auth needed
    /**
     * Reopen a closed note. This request needs to be done as an authenticated user.
     *
     * @param {strOrNum} id - id of note
     * @param {string} comment - Text of note
     * @return {XMLDocument | Error} Return type: application/xml
     */
    async reopenNote(id, comment) {
        const path = `notes/${id}/reopen?text=${comment}`;
        return await this.post(path);
    }
    //! auth needed
    /**
     * Hide (delete) a note. This request needs to be done as an authenticated user. Use Reopen request to make the note visible again.
     *
     * @param {strOrNum} id - id of note
     * @param {string} comment - Text of note
     * @return {XMLDocument | Error} Return type: application/xml
     */
    async hideNote(id, comment) {
        const path = `notes/${id}?text=${comment}`;
        return await this.delete(path);
    }
    /**
     * Search for notes: GET /api/0.6/notes/search .The list of notes can be returned in several different forms (e.g. XML, RSS, json or GPX) depending on file extension given.
     *
     * @param {searchTermT} searchTerms - Search terms
     * @return {XMLDocument | Error} Returns the existing notes matching either the initial note text or any of the comments
     */
    async searchNotes(searchTerms) {
        const searchParams = interfaceToURLSearchParams(searchTerms);
        const params = new URLSearchParams(searchParams).toString();
        const path = `notes/search?q=${params}`;
        return await this.get(path);
    }
    /**
     * Gets an RSS feed for notes within an area.
     *
     * @return {XMLDocument | Error} Return type: application/xml
     */
    async getRSSFeed() {
        const path = `notes/feed`;
        return await this.get(path);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxPQUFPLE1BQU0sZ0JBQWdCLENBQUM7QUFRckMsT0FBTyxFQUFFLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNwRSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ2hDLE9BQU8sT0FBTyxNQUFNLFVBQVUsQ0FBQztBQUUvQixNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFFekI7Ozs7O0dBS0c7QUFDSCxNQUFNLENBQUMsT0FBTyxPQUFPLE1BQU07SUFFZjtJQUNBO0lBRlYsWUFDVSxTQUFpQixHQUFHLENBQUMsR0FBRyxFQUN4QixPQUFlLFVBQVU7UUFEekIsV0FBTSxHQUFOLE1BQU0sQ0FBa0I7UUFDeEIsU0FBSSxHQUFKLElBQUksQ0FBcUI7SUFDaEMsQ0FBQztJQUVKLGtCQUFrQjtJQUNWLFNBQVMsR0FBUTtRQUN2QixjQUFjLEVBQUUsaUJBQWlCO0tBQ2xDLENBQUM7SUFFTSxVQUFVLEdBQVE7UUFDeEIsY0FBYyxFQUFFLG1DQUFtQztLQUNwRCxDQUFDO0lBRU0sbUJBQW1CLEdBQVE7UUFDakMsY0FBYyxFQUFFLHFCQUFxQjtLQUN0QyxDQUFDO0lBRU0sVUFBVSxHQUFRO1FBQ3hCLGNBQWMsRUFBRSxZQUFZO0tBQzdCLENBQUM7SUFFTSxVQUFVLEdBQVE7UUFDeEIsY0FBYyxFQUFFLGtCQUFrQjtLQUNuQyxDQUFDO0lBRUYsV0FBVyxDQUFDLElBQVksRUFBRSxlQUErQixNQUFNO1FBQzdELElBQUksVUFBVSxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLFlBQVksSUFBSSxNQUFNO1lBQUUsVUFBVSxJQUFJLE9BQU8sQ0FBQztRQUNsRCxPQUFPLFVBQVUsQ0FBQztJQUNwQixDQUFDO0lBRUQsZUFBZTtJQUNQLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFB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