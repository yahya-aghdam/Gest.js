import urljoin from "url-join";
import { fetchInputT, mainUrlT } from "../interface/index";

export async function fetcher(
  url: mainUrlT,
  path: string| undefined = undefined,
  { method, param = undefined, headers, body }: fetchInputT
): Promise<any> {
  let urlParam: string = "";
  let editedPath: string = "";

  // arrange params if exist
  if (param != undefined) {
    urlParam = new URLSearchParams(param).toString();
  }

  if (path != undefined) editedPath = urljoin(path);

  const finalUrl = urljoin(url, editedPath, urlParam);
  const res = await fetch(finalUrl, { method, headers, body });

  return await res.json();
}
