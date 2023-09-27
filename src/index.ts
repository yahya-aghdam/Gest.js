import { fetcher } from "./lib/handler";
import { url } from "./lib/url";

export default class Gest {
  constructor(
    private mainUrl: string = url.dev,
    private path: string = "api/",
    private method: "xml" | "json" = "json"
  ) {}

   methodHandler() {
    if(this.method == "json") return ".json"
  }

  async version(): Promise<any> {
    const path = this.path + "versions" + this.methodHandler();
    return await fetcher(this.mainUrl, path, { method: "GET" });
  }
}
