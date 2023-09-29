export interface urlObjT {
  main: string;
  dev: string;
}

export interface fetchInputT {
  method: "GET" | "POST" | "PUT" | "DELETE";
  param?: { [key: string]: string } | undefined;
  body?: any | undefined;
  headers?: any | undefined;
}

export interface boxT {
  left: string | number;
  bottom: string | number;
  right: string | number;
  top: string | number;
}

export type changesetGetQueryT = {
  box?: {
    min_lon: number;
    min_lat: number;
    max_lon: number;
    max_lat: number;
  };
  user?: string;
  display_name?: string;
  time?: string | number | { T1: string | number; T2: string | number };
  open?: boolean;
  closed?: boolean;
  changesets?: string | string[];
  limit?: number | string;
};

export type strOrInt = string | number;
