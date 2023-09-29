import isEmpty from "lodash/isEmpty";
import { boxT, changesetGetQueryT } from "./interface";
import { fetcher } from "./lib/handler";
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
    id: string | number,
    include_discussion: boolean = true,
    returnMethod: "json" | "xml" = "json"
  ) {
    const editedPath = this.jsonDefiner(`changeset/${id}`, returnMethod);
    const path = `${editedPath}?include_discussion=${include_discussion}`;
    return await this.get(path);
  }

  async changesetUpdate(id: string | number, xmlBody: any) {
    const path = `changeset/${id}`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  async changesetClose(id: string | number) {
    const path = `changeset/${id}/close`;
    return await this.put(path);
  }

  async changesetDownload(id: string | number) {
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

  async changesetDiffUpload(id: string | number, xmlBody: any) {
    const path = `changeset/${id}/create`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  //! auth needed
  async changesetComment(id: string | number, comment: any) {
    const path = `changeset/${id}/create`;
    return await this.post(path, this.formHeader, comment);
  }

  //! auth needed
  async changesetSubscribe(id: string | number) {
    const path = `changeset/${id}/subscribe`;
    return await this.post(path, this.formHeader);
  }

  //! auth needed
  async changesetUnsubscribe(id: string | number) {
    const path = `changeset/${id}/unsubscribe`;
    return await this.post(path, this.formHeader);
  }

  //! auth needed
  async changesetHideComment(id: string | number) {
    const path = `changeset/comment/${id}/hide`;
    return await this.post(path);
  }

  //! auth needed
  async changesetUnhideComment(id: string | number) {
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

  async getNode(id: string | number, returnMethod: "json" | "xml" = "json") {
    const path = `node/${this.jsonDefiner(`${id}`, returnMethod)}`;
    return await this.get(path);
  }

  async getWay(id: string | number, returnMethod: "json" | "xml" = "json") {
    const path = `way/${this.jsonDefiner(`${id}`, returnMethod)}`;
    return await this.get(path);
  }

  async getRelation(
    id: string | number,
    returnMethod: "json" | "xml" = "json"
  ) {
    const path = `relation/${this.jsonDefiner(`${id}`, returnMethod)}`;
    return await this.get(path);
  }

  async updateNode(id: string | number, xmlBody: any) {
    const path = `node/${id}`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  async updateWay(id: string | number, xmlBody: any) {
    const path = `way/${id}`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  async updateRelation(id: string | number, xmlBody: any) {
    const path = `relation/${id}`;
    return await this.put(path, this.xmlHeader, xmlBody);
  }

  async deleteNode(id: string | number, xmlBody: any) {
    const path = `node/${id}`;
    return await this.delete(path, this.xmlHeader, xmlBody);
  }

  async deleteWay(id: string | number, xmlBody: any) {
    const path = `way/${id}`;
    return await this.delete(path, this.xmlHeader, xmlBody);
  }

  async deleteRelation(id: string | number, xmlBody: any) {
    const path = `relation/${id}`;
    return await this.delete(path, this.xmlHeader, xmlBody);
  }

  async getNodeHistory(id: string | number) {
    const path = `node/${id}/history`;
    return await this.get(path);
  }
}
