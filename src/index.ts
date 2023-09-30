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

export default class Gest {
  constructor(
    private apiUrl: string = url.dev,
    private apiV: string = apiVersion
  ) {}

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
  async get(path: string): Promise<any> {
    const url = urljoin(this.apiUrl, this.apiV);
    return await fetcher(url, path, { method: "GET" });
  }

  // ANCHOR - Put
  async put(path: string, headers?: any, body?: any): Promise<any> {
    const url = urljoin(this.apiUrl, this.apiV);
    return await fetcher(url, path, { method: "PUT", headers, body });
  }

  // ANCHOR - Post
  async post(path: string, headers?: any, body?: any): Promise<any> {
    const url = urljoin(this.apiUrl, this.apiV);
    return await fetcher(url, path, { method: "POST", headers, body });
  }

  // ANCHOR - Delete
  async delete(path: string, headers?: any, body?: any): Promise<any> {
    const url = urljoin(this.apiUrl, this.apiV);
    return await fetcher(url, path, { method: "DELETE", headers, body });
  }

  async versions(returnMethod: "xml" | "json" = "json") {
    return await fetcher(
      this.apiUrl,
      this.jsonDefiner("versions", returnMethod),
      { method: "GET" }
    );
  }

  async capabilities(returnMethod: "xml" | "json" = "json") {
    return await fetcher(
      this.apiUrl,
      this.jsonDefiner("capabilities", returnMethod),
      { method: "GET" }
    );
  }

  async map({ left, bottom, right, top }: boxT) {
    const path = `map?bbox=${left},${bottom},${right},${top}`;
    return await this.get(path);
  }

  async permissions(returnMethod: "json" | "xml" = "json") {
    return await this.get(this.jsonDefiner("permissions", returnMethod));
  }

  async changesetCreate(xmlBody: any) {
    const path = "changeset/create";
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  async changesetGet(
    id: strOrInt,
    include_discussion: boolean = true,
    returnMethod: "json" | "xml" = "json"
  ) {
    const editedPath = this.jsonDefiner(`changeset/${id}`, returnMethod);
    const path = `${editedPath}?include_discussion=${include_discussion}`;
    return await this.get(path);
  }

  async changesetUpdate(id: strOrInt, xmlBody: any) {
    const path = `changeset/${id}`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  async changesetClose(id: strOrInt) {
    const path = `changeset/${id}/close`;
    return await this.put(path);
  }

  async changesetDownload(id: strOrInt) {
    const path = `changeset/${id}/download`;
    return await this.get(path);
  }

  //! must be test
  async changesetGetQuery(inputData: changesetGetQueryT) {
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

  async changesetDiffUpload(id: strOrInt, xmlBody: any) {
    const path = `changeset/${id}/create`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  //! auth needed
  async changesetComment(id: strOrInt, comment: any) {
    const path = `changeset/${id}/create`;
    return await this.post(path, this.formHeader, comment);
  }

  //! auth needed
  async changesetSubscribe(id: strOrInt) {
    const path = `changeset/${id}/subscribe`;
    return await this.post(path, this.formHeader);
  }

  //! auth needed
  async changesetUnsubscribe(id: strOrInt) {
    const path = `changeset/${id}/unsubscribe`;
    return await this.post(path, this.formHeader);
  }

  //! auth needed
  async changesetHideComment(id: strOrInt) {
    const path = `changeset/comment/${id}/hide`;
    return await this.post(path);
  }

  //! auth needed
  async changesetUnhideComment(id: strOrInt) {
    const path = `changeset/comment/${id}/unhide`;
    return await this.post(path);
  }

  async createNode(xmlBody: any) {
    const path = `node/create`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  async createWay(xmlBody: any) {
    const path = `way/create`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  async createRelation(xmlBody: any) {
    const path = `relation/create`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  async getNode(id: strOrInt, returnMethod: "json" | "xml" = "json") {
    const path = `node/${this.jsonDefiner(`${id}`, returnMethod)}`;
    return await this.get(path);
  }

  async getWay(id: strOrInt, returnMethod: "json" | "xml" = "json") {
    const path = `way/${this.jsonDefiner(`${id}`, returnMethod)}`;
    return await this.get(path);
  }

  async getRelation(id: strOrInt, returnMethod: "json" | "xml" = "json") {
    const path = `relation/${this.jsonDefiner(`${id}`, returnMethod)}`;
    return await this.get(path);
  }

  async updateNode(id: strOrInt, xmlBody: any) {
    const path = `node/${id}`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  async updateWay(id: strOrInt, xmlBody: any) {
    const path = `way/${id}`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  async updateRelation(id: strOrInt, xmlBody: any) {
    const path = `relation/${id}`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  async deleteNode(id: strOrInt, xmlBody: any) {
    const path = `node/${id}`;
    return await this.delete(path, this.xmlHeader, xmlBody);
  }

  async deleteWay(id: strOrInt, xmlBody: any) {
    const path = `way/${id}`;
    return await this.delete(path, this.xmlHeader, xmlBody);
  }

  async deleteRelation(id: strOrInt, xmlBody: any) {
    const path = `relation/${id}`;
    return await this.delete(path, this.xmlHeader, xmlBody);
  }

  async getNodeHistory(id: strOrInt) {
    const path = `node/${id}/history`;
    return await this.get(path);
  }

  async getWayHistory(id: strOrInt) {
    const path = `way/${id}/history`;
    return await this.get(path);
  }

  async getRelationHistory(id: strOrInt) {
    const path = `relation/${id}/history`;
    return await this.get(path);
  }

  async getNodeVersion(id: strOrInt, version: strOrInt) {
    const path = `node/${id}/${version}`;
    return await this.get(path);
  }

  async getWayVersion(id: strOrInt, version: strOrInt) {
    const path = `way/${id}/${version}`;
    return await this.get(path);
  }

  async getRelationVersion(id: strOrInt, version: strOrInt) {
    const path = `relation/${id}/${version}`;
    return await this.get(path);
  }

  async getNodesParameters(parameters: any[]) {
    const path = `nodes?nodes=${parameters}`;
    return await this.get(path);
  }

  async getWaysParameters(parameters: any[]) {
    const path = `ways?ways=${parameters}`;
    return await this.get(path);
  }

  async getRelationsParameters(parameters: any[]) {
    const path = `relations?relations=${parameters}`;
    return await this.get(path);
  }

  async getRelationsForNode(id: strOrInt) {
    const path = `node/${id}/relations`;
    return await this.get(path);
  }

  async getRelationsForWay(id: strOrInt) {
    const path = `way/${id}/relations`;
    return await this.get(path);
  }

  async getRelationsForRelation(id: strOrInt) {
    const path = `relation/${id}/relations`;
    return await this.get(path);
  }

  async getWaysForNode(id: strOrInt) {
    const path = `node/${id}/ways`;
    return await this.get(path);
  }

  async fullGetWay(id: strOrInt) {
    const path = `way/${id}/full`;
    return await this.get(path);
  }

  async fullGetRelation(id: strOrInt) {
    const path = `way/${id}/relation`;
    return await this.get(path);
  }

  async redactionNode(id: strOrInt, version: strOrInt, redaction_id: strOrInt) {
    const path = `node/${id}/${version}/redact?redaction=${redaction_id}`;
    return await this.post(path);
  }

  async redactionWay(id: strOrInt, version: strOrInt, redaction_id: strOrInt) {
    const path = `way/${id}/${version}/redact?redaction=${redaction_id}`;
    return await this.post(path);
  }

  async redactionRelation(
    id: strOrInt,
    version: strOrInt,
    redaction_id: strOrInt
  ) {
    const path = `relation/${id}/${version}/redact?redaction=${redaction_id}`;
    return await this.post(path);
  }

  async getGpsPoint(
    { left, bottom, right, top }: boxT,
    pageNumber: string | number
  ) {
    const path = `trackpoints?bbox=${left},${bottom},${right},${top}&page=${pageNumber}`;
    return await this.get(path);
  }

  async createGpx(body: any) {
    const path = `gpx/create`;
    return await this.post(path, this.multiPartFormHeader, body);
  }

  //! auth needed
  async updateGpx(id: strOrInt, body: any) {
    const path = `gpx/${id}`;
    return await this.put(path, this.multiPartFormHeader, body);
  }

  //! auth needed
  async deleteGpx(id: strOrInt, body: any) {
    const path = `gpx/${id}`;
    return await this.delete(path, this.multiPartFormHeader, body);
  }

  async downloadMetaDetaGpx(id: strOrInt) {
    const path = `gpx/${id}/details`;
    return await this.get(path);
  }

  async downloadDataGpx(id: strOrInt) {
    const path = `gpx/${id}/data`;
    return await this.get(path);
  }

  //! auth needed
  async listGpxFiles() {
    const path = `user/gpx_files`;
    return await this.get(path);
  }

  async getUserDetail(id: strOrInt, returnMethod: "json" | "xml" = "json") {
    const path = `user/${this.jsonDefiner(`${id}`, returnMethod)}`;
    return await this.get(path);
  }

  async getMultiUsersDetails(
    ids: strOrInt[],
    returnMethod: "json" | "xml" = "json"
  ) {
    const path = `${this.jsonDefiner("users", returnMethod)}?=users=${ids}`;
    return await this.get(path);
  }

  async getDetailOfLoggedInUser(returnMethod: "json" | "xml" = "json") {
    const path = `user/${this.jsonDefiner("details", returnMethod)}`;
    return await this.get(path);
  }

  async getPreferencesOfLoggedInUser(returnMethod: "json" | "xml" = "json") {
    const path = `user/${this.jsonDefiner("preferences", returnMethod)}`;
    return await this.get(path);
  }

  async uploadPreferences(body: any) {
    const path = `/user/preferences`;
    return await this.put(path, this.textHeader, body);
  }

  async getPreferencesWithKey(key: strOrInt) {
    const path = `user/preferences/${key}`;
    return await this.get(path);
  }

  async setPreferenceWithKey(key: strOrInt, body: any) {
    const path = `user/preferences/${key}`;
    return await this.put(path, this.textHeader, body);
  }

  async deletePreferenceWithKey(key: strOrInt) {
    const path = `user/preferences/${key}`;
    return await this.delete(path);
  }

  async getNotes(
    { left, bottom, right, top }: boxT,
    returnMethod: "json" | "xml" = "json"
  ) {
    const path = `${this.jsonDefiner(
      "notes",
      returnMethod
    )}?bbox=${left},${bottom},${right},${top}`;
    return await this.get(path);
  }

  async getAllNotes(returnMethod: "json" | "xml" = "json") {
    const path = `${this.jsonDefiner("notes", returnMethod)}`;
    return await this.get(path);
  }

  async getNote(id: strOrInt, returnMethod: "json" | "xml" = "json") {
    const path = `${this.jsonDefiner("notes", returnMethod)}/${id}`;
    return await this.get(path);
  }

  async createNoteXml(text: string, { lat, lon }: { [key: string]: strOrInt }) {
    const path = `notes?lat=${lat}&lon=${lon}&text=${text}`;
    return await this.post(path);
  }

  async createNoteJson(body: noteBodyT) {
    const path = `notes.json`;
    return await this.post(path, this.jsonHeader, body);
  }

  async createNoteCommentXml(id: strOrInt, comment: string) {
    const path = `notes/${id}/comment?text=${comment}`;
    return await this.post(path);
  }

  async closeNote(id: strOrInt, comment: string) {
    const path = `notes/${id}/close?text=${comment}`;
    return await this.post(path);
  }

  async reopenNote(id: strOrInt, comment: string) {
    const path = `notes/${id}/reopen?text=${comment}`;
    return await this.post(path);
  }

  async hideNote(id: strOrInt, comment: string) {
    const path = `notes/${id}?text=${comment}`;
    return await this.delete(path);
  }

  async searchNotes(searchTerms: searchTermT) {
    const searchParams = interfaceToURLSearchParams(searchTerms);
    const params = new URLSearchParams(searchParams).toString();
    const path = `notes/search?q=${params}`;
    return await this.get(path);
  }

  async getRSSFeed(){
    const path = `notes/feed`
    return await this.get(path)
  }
}
