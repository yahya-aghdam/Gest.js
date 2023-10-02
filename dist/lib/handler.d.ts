import { fetchInputT, searchTermT } from "../interface/index";
export declare function fetcher(url: string, path: string | undefined, { method, param, headers, body }: fetchInputT): Promise<any>;
export declare function interfaceToURLSearchParams(data: searchTermT): URLSearchParams;
