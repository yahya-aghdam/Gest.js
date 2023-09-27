export interface urlT {
  main: string;
  dev: string;
}

export type mainUrlT =
  | string
  | "https://api.openstreetmap.org/"
  | "https://master.apis.dev.openstreetmap.org/";

export interface fetchInputT {
  method: string | "GET" | "POST" | "PUT" | "DELETE";
  param?: { [key: string]: string } | undefined;
  body?: any | undefined;
  headers?: any | undefined;
}
