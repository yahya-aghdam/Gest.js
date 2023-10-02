import isEmpty from "lodash/isEmpty";
import {
  boxT,
  changesetGetQueryT,
  noteBodyT,
  searchTermT,
  strOrNum,
} from "./interface";
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
  constructor(
    private apiUrl: string = url.dev,
    private apiV: string = apiVersion
  ) {}

  //ANCHOR - Headers
  private xmlHeader: any = {
    "Content-Type": "application/xml",
  };

  private formHeader: any = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  private multiPartFormHeader: any = {
    "Content-Type": "multipart/form-data",
  };

  private textHeader: any = {
    "Content-Type": "text/plain",
  };

  private jsonHeader: any = {
    "Content-Type": "application/json",
  };

  jsonDefiner(path: string, returnMethod: "xml" | "json" = "json") {
    let returnPath = path;
    if (returnMethod == "json") returnPath += ".json";
    return returnPath;
  }

  // ANCHOR - Get
  private async get(path: string): Promise<any> {
    const url = urljoin(this.apiUrl, this.apiV);
    return await fetcher(url, path, { method: "GET" });
  }

  // ANCHOR - Put
  private async put(path: string, headers?: any, body?: any): Promise<any> {
    const url = urljoin(this.apiUrl, this.apiV);
    return await fetcher(url, path, { method: "PUT", headers, body });
  }

  // ANCHOR - Post
  private async post(path: string, headers?: any, body?: any): Promise<any> {
    const url = urljoin(this.apiUrl, this.apiV);
    return await fetcher(url, path, { method: "POST", headers, body });
  }

  // ANCHOR - Delete
  private async delete(path: string, headers?: any, body?: any): Promise<any> {
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
  public async versions(
    returnMethod: "xml" | "json" = "json"
  ): Promise<XMLDocument | JSON | Error> {
    return await fetcher(
      this.apiUrl,
      this.jsonDefiner("versions", returnMethod),
      { method: "GET" }
    );
  }

  /**
   * This API call is meant to provide information about the capabilities and limitations of the current API.
   *
   * @param {"xml" | "json"} returnMethod - (optional) choose return method, default is "json".
   * @return {XMLDocument | JSON | Error}  Returns a XML document (content type text/xml)
   */
  public async capabilities(
    returnMethod: "xml" | "json" = "json"
  ): Promise<XMLDocument | JSON | Error> {
    return await fetcher(
      this.apiUrl,
      this.jsonDefiner("capabilities", returnMethod),
      { method: "GET" }
    );
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
  public async map({
    left,
    bottom,
    right,
    top,
  }: boxT): Promise<XMLDocument | Error> {
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
  public async permissions(
    returnMethod: "json" | "xml" = "json"
  ): Promise<XMLDocument | JSON | Error> {
    return await this.get(this.jsonDefiner("permissions", returnMethod));
  }

  /**
   * Create: PUT /api/0.6/changeset/create
   *
   * @param {string} xmlBody - (optional) choose return method, default is "json".
   * @return {XMLDocument | Error}  The ID of the newly created changeset with a content type of text/plain
   */
  public async changesetCreate(xmlBody: string): Promise<XMLDocument | Error> {
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
  public async changesetGet(
    id: strOrNum,
    include_discussion: boolean = true,
    returnMethod: "json" | "xml" = "json"
  ): Promise<XMLDocument | JSON | Error> {
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
  public async changesetUpdate(
    id: strOrNum,
    xmlBody: string
  ): Promise<XMLDocument | Error> {
    const path = `changeset/${id}`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  /**
   * Closes a changeset. A changeset may already have been closed without the owner issuing this API call. In this case an error code is returned.
   *
   * @param {strOrNum} id - The id of the changeset to close. The user issuing this API call has to be the same that created the changeset.
   * @return {XMLDocument | Error} Nothing is returned upon successful closing of a changeset (HTTP status code 200)
   */
  public async changesetClose(id: strOrNum): Promise<XMLDocument | Error> {
    const path = `changeset/${id}/close`;
    return await this.put(path);
  }

  /**
   * Returns the OsmChange document describing all changes associated with the changeset.
   *
   * @param {strOrNum} id - The id of the changeset for which the OsmChange is requested.
   * @return {XMLDocument | Error} The OsmChange XML with a content type of text/xml.
   */
  public async changesetDownload(id: strOrNum): Promise<XMLDocument | Error> {
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
  public async changesetGetQuery(
    inputData: changesetGetQueryT
  ): Promise<XMLDocument | Error> {
    let path: string = "";

    if (!isEmpty(inputData.box)) {
      path = `bbox=${
        (inputData.box.min_lon,
        inputData.box.min_lat,
        inputData.box.max_lon,
        inputData.box.max_lon)
      }`;
    }

    if (!isEmpty(inputData.user)) {
      path = `user=${inputData.user}`;
    }

    if (!isEmpty(inputData.display_name)) {
      path = `display_name=${inputData.display_name}`;
    }

    if (!isEmpty(inputData.time)) {
      if (
        typeof inputData.time == "number" ||
        typeof inputData.time == "string"
      ) {
        path = `time=${inputData.time}`;
      } else {
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
      } else {
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
  public async changesetDiffUpload(
    id: strOrNum,
    body: any
  ): Promise<XMLDocument | Error> {
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
  public async changesetComment(
    id: strOrNum,
    comment: string
  ): Promise<XMLDocument | Error> {
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
  public async changesetSubscribe(id: strOrNum): Promise<XMLDocument | Error> {
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
  public async changesetUnsubscribe(
    id: strOrNum
  ): Promise<XMLDocument | Error> {
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
  public async changesetHideComment(
    id: strOrNum
  ): Promise<XMLDocument | Error> {
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
  public async changesetUnhideComment(
    id: strOrNum
  ): Promise<XMLDocument | Error> {
    const path = `changeset/comment/${id}/unhide`;
    return await this.post(path);
  }

  /**
   * Creates a new element of the specified type. Note that the entire request should be wrapped in a <osm>...</osm> element.
   *
   * @param {string} xmlBody - The data of node
   * @return {XMLDocument | Error} The ID of the newly created element (content type is text/plain)
   */
  public async createNode(xmlBody: string): Promise<XMLDocument | Error> {
    const path = `node/create`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  /**
   * Creates a new element of the specified type. Note that the entire request should be wrapped in a <osm>...</osm> element.
   *
   * @param {string} xmlBody - The data of way
   * @return {XMLDocument | Error} The ID of the newly created element (content type is text/plain)
   */
  public async createWay(xmlBody: string): Promise<XMLDocument | Error> {
    const path = `way/create`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  /**
   * Creates a new element of the specified type. Note that the entire request should be wrapped in a <osm>...</osm> element.
   *
   * @param {string} xmlBody - The data of relation
   * @return {XMLDocument | Error} The ID of the newly created element (content type is text/plain)
   */
  public async createRelation(xmlBody: string): Promise<XMLDocument | Error> {
    const path = `relation/create`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  /**
   * Read: GET /api/0.6/node/#id or /api/0.6/node/#id.json
   *
   * @param {strOrNum} id - The ID of the node
   * @return {XMLDocument | Error} Returns the XML representation of the element.
   */
  public async getNode(
    id: strOrNum,
    returnMethod: "json" | "xml" = "json"
  ): Promise<XMLDocument | JSON | Error> {
    const path = `node/${this.jsonDefiner(`${id}`, returnMethod)}`;
    return await this.get(path);
  }

  /**
   * Read: GET /api/0.6/way/#id or /api/0.6/way/#id.json
   *
   * @param {strOrNum} id - The ID of the way
   * @return {XMLDocument | Error} Returns the XML representation of the element.
   */
  public async getWay(
    id: strOrNum,
    returnMethod: "json" | "xml" = "json"
  ): Promise<XMLDocument | JSON | Error> {
    const path = `way/${this.jsonDefiner(`${id}`, returnMethod)}`;
    return await this.get(path);
  }

  /**
   * Read: GET /api/0.6/relation/#id or /api/0.6/relation/#id.json
   *
   * @param {strOrNum} id - The ID of the relation
   * @return {XMLDocument | Error} Returns the XML representation of the element.
   */
  public async getRelation(
    id: strOrNum,
    returnMethod: "json" | "xml" = "json"
  ): Promise<XMLDocument | JSON | Error> {
    const path = `relation/${this.jsonDefiner(`${id}`, returnMethod)}`;
    return await this.get(path);
  }

  /**
   * Updates data from a preexisting element. A full representation of the element as it should be after the update has to be provided. Any tags, way-node refs, and relation members that remain unchanged must be in the update as well. A version number must be provided as well, it must match the current version of the element in the database.
   *
   * @param {strOrNum} id - The ID of the node
   * @return {XMLDocument | Error} Returns the new version number with a content type of text/plain.
   */
  public async updateNode(
    id: strOrNum,
    xmlBody: string
  ): Promise<XMLDocument | Error> {
    const path = `node/${id}`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  /**
   * Updates data from a preexisting element. A full representation of the element as it should be after the update has to be provided. Any tags, way-node refs, and relation members that remain unchanged must be in the update as well. A version number must be provided as well, it must match the current version of the element in the database.
   *
   * @param {strOrNum} id - The ID of the way
   * @return {XMLDocument | Error} Returns the new version number with a content type of text/plain.
   */
  public async updateWay(
    id: strOrNum,
    xmlBody: string
  ): Promise<XMLDocument | Error> {
    const path = `way/${id}`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  /**
   * Updates data from a preexisting element. A full representation of the element as it should be after the update has to be provided. Any tags, way-node refs, and relation members that remain unchanged must be in the update as well. A version number must be provided as well, it must match the current version of the element in the database.
   *
   * @param {strOrNum} id - The ID of the relation
   * @return {XMLDocument | Error} Returns the new version number with a content type of text/plain.
   */
  public async updateRelation(
    id: strOrNum,
    xmlBody: string
  ): Promise<XMLDocument | Error> {
    const path = `relation/${id}`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  /**
   * Expects a valid XML representation of the element to be deleted.
   *
   * @param {strOrNum} id - The ID of the node
   * @return {XMLDocument | Error} Returns the new version number with a content type of text/plain.
   */
  public async deleteNode(
    id: strOrNum,
    xmlBody: string
  ): Promise<XMLDocument | Error> {
    const path = `node/${id}`;
    return await this.delete(path, this.xmlHeader, xmlBody);
  }

  /**
   * Expects a valid XML representation of the element to be deleted.
   *
   * @param {strOrNum} id - The ID of the way
   * @return {XMLDocument | Error} Returns the new version number with a content type of text/plain.
   */
  public async deleteWay(
    id: strOrNum,
    xmlBody: string
  ): Promise<XMLDocument | Error> {
    const path = `way/${id}`;
    return await this.delete(path, this.xmlHeader, xmlBody);
  }

  /**
   * Expects a valid XML representation of the element to be deleted.
   *
   * @param {strOrNum} id - The ID of the relation
   * @return {XMLDocument | Error} Returns the new version number with a content type of text/plain.
   */
  public async deleteRelation(
    id: strOrNum,
    xmlBody: string
  ): Promise<XMLDocument | Error> {
    const path = `relation/${id}`;
    return await this.delete(path, this.xmlHeader, xmlBody);
  }

  /**
   * History: GET /api/0.6/node/#id/history
   *
   * @param {strOrNum} id - The ID of the node
   * @return {XMLDocument | Error} Retrieves all old versions of an element.
   */
  public async getNodeHistory(id: strOrNum): Promise<XMLDocument | Error> {
    const path = `node/${id}/history`;
    return await this.get(path);
  }

  /**
   * History: GET /api/0.6/way/#id/history
   *
   * @param {strOrNum} id - The ID of the way
   * @return {XMLDocument | Error} Retrieves all old versions of an element.
   */
  public async getWayHistory(id: strOrNum): Promise<XMLDocument | Error> {
    const path = `way/${id}/history`;
    return await this.get(path);
  }

  /**
   * History: GET /api/0.6/relation/#id/history
   *
   * @param {strOrNum} id - The ID of the relation
   * @return {XMLDocument | Error} Retrieves all old versions of an element.
   */
  public async getRelationHistory(id: strOrNum): Promise<XMLDocument | Error> {
    const path = `relation/${id}/history`;
    return await this.get(path);
  }

  /**
   * Version: GET /api/0.6/node/#id/#version
   *
   * @param {strOrNum} id - The ID of the node
   * @return {XMLDocument | Error} Retrieves a specific version of the element.
   */
  public async getNodeVersion(
    id: strOrNum,
    version: strOrNum
  ): Promise<XMLDocument | Error> {
    const path = `node/${id}/${version}`;
    return await this.get(path);
  }

  /**
   * Version: GET /api/0.6/way/#id/#version
   *
   * @param {strOrNum} id - The ID of the way
   * @return {XMLDocument | Error} Retrieves a specific version of the element.
   */
  public async getWayVersion(
    id: strOrNum,
    version: strOrNum
  ): Promise<XMLDocument | Error> {
    const path = `way/${id}/${version}`;
    return await this.get(path);
  }

  /**
   * Version: GET /api/0.6/relation/#id/#version
   *
   * @param {strOrNum} id - The ID of the relation
   * @return {XMLDocument | Error} Retrieves a specific version of the element.
   */
  public async getRelationVersion(
    id: strOrNum,
    version: strOrNum
  ): Promise<XMLDocument | Error> {
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
  public async getNodesParameters(
    parameters: any[]
  ): Promise<XMLDocument | Error> {
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
  public async getWaysParameters(
    parameters: any[]
  ): Promise<XMLDocument | Error> {
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
  public async getRelationsParameters(
    parameters: any[]
  ): Promise<XMLDocument | Error> {
    const path = `relations?relations=${parameters}`;
    return await this.get(path);
  }

  /**
   * Relations for element: GET /api/0.6/node/#id/relations
   *
   * @param {strOrNum} id - The id of element
   * @return {XMLDocument | Error} Returns a XML document containing all (not deleted) relations in which the given element is used.
   */
  public async getRelationsForNode(id: strOrNum): Promise<XMLDocument | Error> {
    const path = `node/${id}/relations`;
    return await this.get(path);
  }

  /**
   * Relations for element: GET /api/0.6/way/#id/relations
   *
   * @param {strOrNum} id - The id of element
   * @return {XMLDocument | Error} Returns a XML document containing all (not deleted) relations in which the given element is used.
   */
  public async getRelationsForWay(id: strOrNum): Promise<XMLDocument | Error> {
    const path = `way/${id}/relations`;
    return await this.get(path);
  }

  /**
   * Relations for element: GET /api/0.6/relation/#id/relations
   *
   * @param {strOrNum} id - The id of element
   * @return {XMLDocument | Error} Returns a XML document containing all (not deleted) relations in which the given element is used.
   */
  public async getRelationsForRelation(
    id: strOrNum
  ): Promise<XMLDocument | Error> {
    const path = `relation/${id}/relations`;
    return await this.get(path);
  }

  /**
   * This API call retrieves a way and all other elements referenced by it
   *
   * @param {strOrNum} id - The id of way
   * @return {XMLDocument | Error} it will return the way specified plus the full XML of all nodes referenced by the way.
   */
  public async fullGetWay(id: strOrNum): Promise<XMLDocument | Error> {
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
  public async fullGetRelation(id: strOrNum): Promise<XMLDocument | Error> {
    const path = `way/${id}/relation`;
    return await this.get(path);
  }

  /**
   * This is an API method originally created for the ODbL license change to hide contributions from users that did not accept the new CT/licence. It is now used by the DWG to hide old versions of elements containing data privacy or copyright infringements. All API retrieval request for the element #version will return an HTTP error 403.
   *
   * @param {strOrNum} id - The id of node
   * @return {XMLDocument | Error}
   */
  public async redactionNode(
    id: strOrNum,
    version: strOrNum,
    redaction_id: strOrNum
  ): Promise<XMLDocument | Error> {
    const path = `node/${id}/${version}/redact?redaction=${redaction_id}`;
    return await this.post(path);
  }

  /**
   * This is an API method originally created for the ODbL license change to hide contributions from users that did not accept the new CT/licence. It is now used by the DWG to hide old versions of elements containing data privacy or copyright infringements. All API retrieval request for the element #version will return an HTTP error 403.
   *
   * @param {strOrNum} id - The id of way
   * @return {XMLDocument | Error}
   */
  public async redactionWay(
    id: strOrNum,
    version: strOrNum,
    redaction_id: strOrNum
  ): Promise<XMLDocument | Error> {
    const path = `way/${id}/${version}/redact?redaction=${redaction_id}`;
    return await this.post(path);
  }

  /**
   * This is an API method originally created for the ODbL license change to hide contributions from users that did not accept the new CT/licence. It is now used by the DWG to hide old versions of elements containing data privacy or copyright infringements. All API retrieval request for the element #version will return an HTTP error 403.
   *
   * @param {strOrNum} id - The id of relation
   * @return {XMLDocument | Error}
   */
  public async redactionRelation(
    id: strOrNum,
    version: strOrNum,
    redaction_id: strOrNum
  ): Promise<XMLDocument | Error> {
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
  public async getGpsPoint(
    { left, bottom, right, top }: boxT,
    pageNumber: strOrNum
  ): Promise<XMLDocument | Error> {
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
  public async createGpx(body: any): Promise<XMLDocument | Error> {
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
  public async updateGpx(
    id: strOrNum,
    body: any
  ): Promise<XMLDocument | Error> {
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
  public async deleteGpx(
    id: strOrNum,
    body: any
  ): Promise<XMLDocument | Error> {
    const path = `gpx/${id}`;
    return await this.delete(path, this.multiPartFormHeader, body);
  }

  /**
   * Use this to access the metadata about a GPX file. Available without authentication if the file is marked public. Otherwise only usable by the owner account and requires authentication.
   *
   * @param {strOrNum} id - The id of gpx
   * @return {XMLDocument | Error} Will return OSM/XML meta data of the gpx
   */
  public async downloadMetaDetaGpx(id: strOrNum): Promise<XMLDocument | Error> {
    const path = `gpx/${id}/details`;
    return await this.get(path);
  }

  /**
   * Use this to download the full GPX file. Available without authentication if the file is marked public. Otherwise only usable by the owner account and requires authentication. ' The response will always be a GPX format file if you use a .gpx URL suffix, a XML file in an undocumented format if you use a .xml URL suffix, otherwise the response will be the exact file that was uploaded.
   *
   * @param {strOrNum} id - The id of gpx
   * @return {XMLDocument | Error} Will return OSM/XML data of the gpx
   */
  public async downloadDataGpx(id: strOrNum): Promise<XMLDocument | Error> {
    const path = `gpx/${id}/data`;
    return await this.get(path);
  }

  //! auth needed
  /**
   * Use this to get a list of GPX traces owned by the authenticated user: Requires authentication.
   *
   * @return {XMLDocument | Error} This call always returns GPX traces for the current authenticated user only
   */
  public async listGpxFiles(): Promise<XMLDocument | Error> {
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
  public async getUserDetail(
    id: strOrNum,
    returnMethod: "json" | "xml" = "json"
  ): Promise<XMLDocument | JSON | Error> {
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
  public async getMultiUsersDetails(
    ids: strOrNum[],
    returnMethod: "json" | "xml" = "json"
  ): Promise<XMLDocument | JSON | Error> {
    const path = `${this.jsonDefiner("users", returnMethod)}?=users=${ids}`;
    return await this.get(path);
  }

  /**
   * Details of the logged-in user: GET /api/0.6/user/details or /api/0.6/user/details.json
   *
   * @param {"xml" | "json"} returnMethod - (optional) choose return method, default is "json".
   * @return {XMLDocument | Error} Will return details of logged in users.
   */
  public async getDetailOfLoggedInUser(
    returnMethod: "json" | "xml" = "json"
  ): Promise<XMLDocument | JSON | Error> {
    const path = `user/${this.jsonDefiner("details", returnMethod)}`;
    return await this.get(path);
  }

  /**
   * Preferences of the logged-in user: GET /api/0.6/user/preferences or /api/0.6/user/preferences.json
   *
   * @param {"xml" | "json"} returnMethod - (optional) choose return method, default is "json".
   * @return {XMLDocument | Error} Will return preferences of logged in user
   */
  public async getPreferencesOfLoggedInUser(
    returnMethod: "json" | "xml" = "json"
  ): Promise<XMLDocument | JSON | Error> {
    const path = `user/${this.jsonDefiner("preferences", returnMethod)}`;
    return await this.get(path);
  }

  /**
   * The same structure in the body of the a PUT will upload preferences. All existing preferences are replaced by the newly uploaded set.
   *
   * @param {any} body - The data will be upload
   * @return {XMLDocument | Error}
   */
  public async uploadPreferences(body: any): Promise<XMLDocument | Error> {
    const path = `/user/preferences`;
    return await this.put(path, this.textHeader, body);
  }

  /**
   * You can get preference with your key
   *
   * @param {strOrNum} key - Your key
   * @return {XMLDocument | Error | string} Returns a string with that preference's value.
   */
  public async getPreferencesWithKey(
    key: strOrNum
  ): Promise<XMLDocument | Error | string> {
    const path = `user/preferences/${key}`;
    return await this.get(path);
  }

  /**
   * Will set a single preference's value to a string passed as the content of the request.
   *
   * @param {strOrNum} key - Your key
   * @return {XMLDocument | Error}
   */
  public async setPreferenceWithKey(
    key: strOrNum,
    body: any
  ): Promise<XMLDocument | Error> {
    const path = `user/preferences/${key}`;
    return await this.put(path, this.textHeader, body);
  }

  /**
   * A single preference entry can be deleted with. In this instance, the payload of the request should only contain the value of the preference, i.e. not XML formatted.
   *
   * @param {strOrNum} key - Your key
   * @return {XMLDocument | Error}
   */
  public async deletePreferenceWithKey(
    key: strOrNum
  ): Promise<XMLDocument | Error> {
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
  public async getNotes(
    { left, bottom, right, top }: boxT,
    returnMethod: "json" | "xml" = "json"
  ): Promise<XMLDocument | JSON | Error> {
    const path = `${this.jsonDefiner(
      "notes",
      returnMethod
    )}?bbox=${left},${bottom},${right},${top}`;
    return await this.get(path);
  }

  /**
   * Returns the existing note with the given ID. The output can be in several formats (e.g. XML, RSS, json or GPX) depending on the file extension.
   *
   * @param {strOrNum} id - The ID of the changeset this flag belongs to.
   * @param {"xml" | "json"} returnMethod - (optional) choose return method, default is "json".
   * @return {XMLDocument | Error} Return type: application/xml
   */
  public async getNote(
    id: strOrNum,
    returnMethod: "json" | "xml" = "json"
  ): Promise<XMLDocument | JSON | Error> {
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
  public async createNoteXml(
    text: string,
    { lat, lon }: { [key: string]: strOrNum }
  ): Promise<XMLDocument | Error> {
    const path = `notes?lat=${lat}&lon=${lon}&text=${text}`;
    return await this.post(path);
  }

  /**
   * Create a new note: POST /api/0.6/notes.json
   *
   * @param { noteBodyT} body - like: {"lat":51.00, "lon": 0.1&, "text":"This is a note\n\nThis is another line"}
   * @return {XMLDocument | Error} A JSON-file with the details of the note will be returned
   */
  public async createNoteJson(body: noteBodyT): Promise<XMLDocument | Error> {
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
  public async createNoteCommentXml(
    id: strOrNum,
    comment: string
  ): Promise<XMLDocument | Error> {
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
  public async closeNote(
    id: strOrNum,
    comment: string
  ): Promise<XMLDocument | Error> {
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
  public async reopenNote(
    id: strOrNum,
    comment: string
  ): Promise<XMLDocument | Error> {
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
  public async hideNote(
    id: strOrNum,
    comment: string
  ): Promise<XMLDocument | Error> {
    const path = `notes/${id}?text=${comment}`;
    return await this.delete(path);
  }

  /**
   * Search for notes: GET /api/0.6/notes/search .The list of notes can be returned in several different forms (e.g. XML, RSS, json or GPX) depending on file extension given.
   *
   * @param {searchTermT} searchTerms - Search terms
   * @return {XMLDocument | Error} Returns the existing notes matching either the initial note text or any of the comments
   */
  public async searchNotes(
    searchTerms: searchTermT
  ): Promise<XMLDocument |JSON | string | Error> {
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
  public async getRSSFeed(): Promise<XMLDocument | Error> {
    const path = `notes/feed`;
    return await this.get(path);
  }
}
