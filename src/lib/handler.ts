import urljoin from "url-join";
import { fetchInputT } from "../interface/index";

export async function fetcher(
  url: string,
  path: string = "",
  { method, param = undefined, headers, body }: fetchInputT
): Promise<any> {
  let urlParam: string = "";

  // arrange params if exist
  if (param != undefined) {
    urlParam = new URLSearchParams(param).toString();
  }

  const finalUrl = url + "/" + path + urlParam;
  console.log("🚀 ~ file: handler.ts:17 ~ finalUrl:", finalUrl)
  const response = await fetch(finalUrl, { method, headers, body });

  const contentType = response.headers.get("Content-Type");

  if (contentType) {
    if (contentType.includes("application/json")) {
      return response.json(); // JSON data
    } else if (contentType.includes("application/xml")) {
      return response.text(); // XML data
    } else {
      return response;
    }
  } else {
    throw new Error("Content-Type header not found");
  }
}
