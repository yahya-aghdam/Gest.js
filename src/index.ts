import isEmpty from "lodash/isEmpty";
import {
  boxT,
  changesetGetQueryT,
  noteBodyT,
  searchTermT,
  strOrInt,
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
export default class Gest {
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

  public async changesetCreate(xmlBody: any): Promise<XMLDocument | Error> {
    const path = "changeset/create";
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  public async changesetGet(
    id: strOrInt,
    include_discussion: boolean = true,
    returnMethod: "json" | "xml" = "json"
  ): Promise<XMLDocument | JSON | Error> {
    const editedPath = this.jsonDefiner(`changeset/${id}`, returnMethod);
    const path = `${editedPath}?include_discussion=${include_discussion}`;
    return await this.get(path);
  }

  public async changesetUpdate(
    id: strOrInt,
    xmlBody: any
  ): Promise<XMLDocument | Error> {
    const path = `changeset/${id}`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  public async changesetClose(id: strOrInt): Promise<XMLDocument | Error> {
    const path = `changeset/${id}/close`;
    return await this.put(path);
  }

  public async changesetDownload(id: strOrInt): Promise<XMLDocument | Error> {
    const path = `changeset/${id}/download`;
    return await this.get(path);
  }

  //! must be test
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

  public async changesetDiffUpload(
    id: strOrInt,
    xmlBody: any
  ): Promise<XMLDocument | Error> {
    const path = `changeset/${id}/create`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  //! auth needed
  public async changesetComment(
    id: strOrInt,
    comment: any
  ): Promise<XMLDocument | Error> {
    const path = `changeset/${id}/create`;
    return await this.post(path, this.formHeader, comment);
  }

  //! auth needed
  public async changesetSubscribe(id: strOrInt): Promise<XMLDocument | Error> {
    const path = `changeset/${id}/subscribe`;
    return await this.post(path, this.formHeader);
  }

  //! auth needed
  public async changesetUnsubscribe(
    id: strOrInt
  ): Promise<XMLDocument | Error> {
    const path = `changeset/${id}/unsubscribe`;
    return await this.post(path, this.formHeader);
  }

  //! auth needed
  public async changesetHideComment(
    id: strOrInt
  ): Promise<XMLDocument | Error> {
    const path = `changeset/comment/${id}/hide`;
    return await this.post(path);
  }

  //! auth needed
  public async changesetUnhideComment(
    id: strOrInt
  ): Promise<XMLDocument | Error> {
    const path = `changeset/comment/${id}/unhide`;
    return await this.post(path);
  }

  public async createNode(xmlBody: any): Promise<XMLDocument | Error> {
    const path = `node/create`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  public async createWay(xmlBody: any): Promise<XMLDocument | Error> {
    const path = `way/create`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  public async createRelation(xmlBody: any): Promise<XMLDocument | Error> {
    const path = `relation/create`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  public async getNode(
    id: strOrInt,
    returnMethod: "json" | "xml" = "json"
  ): Promise<XMLDocument | JSON | Error> {
    const path = `node/${this.jsonDefiner(`${id}`, returnMethod)}`;
    return await this.get(path);
  }

  public async getWay(
    id: strOrInt,
    returnMethod: "json" | "xml" = "json"
  ): Promise<XMLDocument | JSON | Error> {
    const path = `way/${this.jsonDefiner(`${id}`, returnMethod)}`;
    return await this.get(path);
  }

  public async getRelation(
    id: strOrInt,
    returnMethod: "json" | "xml" = "json"
  ): Promise<XMLDocument | JSON | Error> {
    const path = `relation/${this.jsonDefiner(`${id}`, returnMethod)}`;
    return await this.get(path);
  }

  public async updateNode(
    id: strOrInt,
    xmlBody: any
  ): Promise<XMLDocument | Error> {
    const path = `node/${id}`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  public async updateWay(
    id: strOrInt,
    xmlBody: any
  ): Promise<XMLDocument | Error> {
    const path = `way/${id}`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  public async updateRelation(
    id: strOrInt,
    xmlBody: any
  ): Promise<XMLDocument | Error> {
    const path = `relation/${id}`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  public async deleteNode(
    id: strOrInt,
    xmlBody: any
  ): Promise<XMLDocument | Error> {
    const path = `node/${id}`;
    return await this.delete(path, this.xmlHeader, xmlBody);
  }

  public async deleteWay(
    id: strOrInt,
    xmlBody: any
  ): Promise<XMLDocument | Error> {
    const path = `way/${id}`;
    return await this.delete(path, this.xmlHeader, xmlBody);
  }

  public async deleteRelation(
    id: strOrInt,
    xmlBody: any
  ): Promise<XMLDocument | Error> {
    const path = `relation/${id}`;
    return await this.delete(path, this.xmlHeader, xmlBody);
  }

  public async getNodeHistory(id: strOrInt): Promise<XMLDocument | Error> {
    const path = `node/${id}/history`;
    return await this.get(path);
  }

  public async getWayHistory(id: strOrInt): Promise<XMLDocument | Error> {
    const path = `way/${id}/history`;
    return await this.get(path);
  }

  public async getRelationHistory(id: strOrInt): Promise<XMLDocument | Error> {
    const path = `relation/${id}/history`;
    return await this.get(path);
  }

  public async getNodeVersion(
    id: strOrInt,
    version: strOrInt
  ): Promise<XMLDocument | Error> {
    const path = `node/${id}/${version}`;
    return await this.get(path);
  }

  public async getWayVersion(
    id: strOrInt,
    version: strOrInt
  ): Promise<XMLDocument | Error> {
    const path = `way/${id}/${version}`;
    return await this.get(path);
  }

  public async getRelationVersion(
    id: strOrInt,
    version: strOrInt
  ): Promise<XMLDocument | Error> {
    const path = `relation/${id}/${version}`;
    return await this.get(path);
  }

  public async getNodesParameters(
    parameters: any[]
  ): Promise<XMLDocument | Error> {
    const path = `nodes?nodes=${parameters}`;
    return await this.get(path);
  }

  public async getWaysParameters(
    parameters: any[]
  ): Promise<XMLDocument | Error> {
    const path = `ways?ways=${parameters}`;
    return await this.get(path);
  }

  public async getRelationsParameters(
    parameters: any[]
  ): Promise<XMLDocument | Error> {
    const path = `relations?relations=${parameters}`;
    return await this.get(path);
  }

  public async getRelationsForNode(id: strOrInt): Promise<XMLDocument | Error> {
    const path = `node/${id}/relations`;
    return await this.get(path);
  }

  public async getRelationsForWay(id: strOrInt): Promise<XMLDocument | Error> {
    const path = `way/${id}/relations`;
    return await this.get(path);
  }

  public async getRelationsForRelation(
    id: strOrInt
  ): Promise<XMLDocument | Error> {
    const path = `relation/${id}/relations`;
    return await this.get(path);
  }

  public async getWaysForNode(id: strOrInt): Promise<XMLDocument | Error> {
    const path = `node/${id}/ways`;
    return await this.get(path);
  }

  public async fullGetWay(id: strOrInt): Promise<XMLDocument | Error> {
    const path = `way/${id}/full`;
    return await this.get(path);
  }

  public async fullGetRelation(id: strOrInt): Promise<XMLDocument | Error> {
    const path = `way/${id}/relation`;
    return await this.get(path);
  }

  public async redactionNode(
    id: strOrInt,
    version: strOrInt,
    redaction_id: strOrInt
  ): Promise<XMLDocument | Error> {
    const path = `node/${id}/${version}/redact?redaction=${redaction_id}`;
    return await this.post(path);
  }

  public async redactionWay(
    id: strOrInt,
    version: strOrInt,
    redaction_id: strOrInt
  ): Promise<XMLDocument | Error> {
    const path = `way/${id}/${version}/redact?redaction=${redaction_id}`;
    return await this.post(path);
  }

  public async redactionRelation(
    id: strOrInt,
    version: strOrInt,
    redaction_id: strOrInt
  ): Promise<XMLDocument | Error> {
    const path = `relation/${id}/${version}/redact?redaction=${redaction_id}`;
    return await this.post(path);
  }

  public async getGpsPoint(
    { left, bottom, right, top }: boxT,
    pageNumber: string | number
  ): Promise<XMLDocument | Error> {
    const path = `trackpoints?bbox=${left},${bottom},${right},${top}&page=${pageNumber}`;
    return await this.get(path);
  }

  public async createGpx(body: any): Promise<XMLDocument | Error> {
    const path = `gpx/create`;
    return await this.post(path, this.multiPartFormHeader, body);
  }

  //! auth needed
  public async updateGpx(
    id: strOrInt,
    body: any
  ): Promise<XMLDocument | Error> {
    const path = `gpx/${id}`;
    return await this.put(path, this.multiPartFormHeader, body);
  }

  //! auth needed
  public async deleteGpx(
    id: strOrInt,
    body: any
  ): Promise<XMLDocument | Error> {
    const path = `gpx/${id}`;
    return await this.delete(path, this.multiPartFormHeader, body);
  }

  public async downloadMetaDetaGpx(id: strOrInt): Promise<XMLDocument | Error> {
    const path = `gpx/${id}/details`;
    return await this.get(path);
  }

  public async downloadDataGpx(id: strOrInt): Promise<XMLDocument | Error> {
    const path = `gpx/${id}/data`;
    return await this.get(path);
  }

  //! auth needed
  public async listGpxFiles(): Promise<XMLDocument | Error> {
    const path = `user/gpx_files`;
    return await this.get(path);
  }

  public async getUserDetail(
    id: strOrInt,
    returnMethod: "json" | "xml" = "json"
  ): Promise<XMLDocument | JSON | Error> {
    const path = `user/${this.jsonDefiner(`${id}`, returnMethod)}`;
    return await this.get(path);
  }

  public async getMultiUsersDetails(
    ids: strOrInt[],
    returnMethod: "json" | "xml" = "json"
  ): Promise<XMLDocument | JSON | Error> {
    const path = `${this.jsonDefiner("users", returnMethod)}?=users=${ids}`;
    return await this.get(path);
  }

  public async getDetailOfLoggedInUser(
    returnMethod: "json" | "xml" = "json"
  ): Promise<XMLDocument | JSON | Error> {
    const path = `user/${this.jsonDefiner("details", returnMethod)}`;
    return await this.get(path);
  }

  public async getPreferencesOfLoggedInUser(
    returnMethod: "json" | "xml" = "json"
  ): Promise<XMLDocument | JSON | Error> {
    const path = `user/${this.jsonDefiner("preferences", returnMethod)}`;
    return await this.get(path);
  }

  public async uploadPreferences(body: any): Promise<XMLDocument | Error> {
    const path = `/user/preferences`;
    return await this.put(path, this.textHeader, body);
  }

  public async getPreferencesWithKey(
    key: strOrInt
  ): Promise<XMLDocument | Error> {
    const path = `user/preferences/${key}`;
    return await this.get(path);
  }

  public async setPreferenceWithKey(
    key: strOrInt,
    body: any
  ): Promise<XMLDocument | Error> {
    const path = `user/preferences/${key}`;
    return await this.put(path, this.textHeader, body);
  }

  public async deletePreferenceWithKey(
    key: strOrInt
  ): Promise<XMLDocument | Error> {
    const path = `user/preferences/${key}`;
    return await this.delete(path);
  }

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

  public async getAllNotes(
    returnMethod: "json" | "xml" = "json"
  ): Promise<XMLDocument | JSON | Error> {
    const path = `${this.jsonDefiner("notes", returnMethod)}`;
    return await this.get(path);
  }

  public async getNote(
    id: strOrInt,
    returnMethod: "json" | "xml" = "json"
  ): Promise<XMLDocument | JSON | Error> {
    const path = `${this.jsonDefiner("notes", returnMethod)}/${id}`;
    return await this.get(path);
  }

  public async createNoteXml(
    text: string,
    { lat, lon }: { [key: string]: strOrInt }
  ): Promise<XMLDocument | Error> {
    const path = `notes?lat=${lat}&lon=${lon}&text=${text}`;
    return await this.post(path);
  }

  public async createNoteJson(body: noteBodyT): Promise<XMLDocument | Error> {
    const path = `notes.json`;
    return await this.post(path, this.jsonHeader, body);
  }

  public async createNoteCommentXml(
    id: strOrInt,
    comment: string
  ): Promise<XMLDocument | Error> {
    const path = `notes/${id}/comment?text=${comment}`;
    return await this.post(path);
  }

  public async closeNote(
    id: strOrInt,
    comment: string
  ): Promise<XMLDocument | Error> {
    const path = `notes/${id}/close?text=${comment}`;
    return await this.post(path);
  }

  public async reopenNote(
    id: strOrInt,
    comment: string
  ): Promise<XMLDocument | Error> {
    const path = `notes/${id}/reopen?text=${comment}`;
    return await this.post(path);
  }

  public async hideNote(
    id: strOrInt,
    comment: string
  ): Promise<XMLDocument | Error> {
    const path = `notes/${id}?text=${comment}`;
    return await this.delete(path);
  }

  public async searchNotes(
    searchTerms: searchTermT
  ): Promise<XMLDocument | Error> {
    const searchParams = interfaceToURLSearchParams(searchTerms);
    const params = new URLSearchParams(searchParams).toString();
    const path = `notes/search?q=${params}`;
    return await this.get(path);
  }

  public async getRSSFeed(): Promise<XMLDocument | Error> {
    const path = `notes/feed`;
    return await this.get(path);
  }
}
