export interface urlObjT {
    main: string;
    dev: string;
}
export interface fetchInputT {
    method: "GET" | "POST" | "PUT" | "DELETE";
    param?: {
        [key: string]: string;
    } | undefined;
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
    time?: string | number | {
        T1: string | number;
        T2: string | number;
    };
    open?: boolean;
    closed?: boolean;
    changesets?: string | string[];
    limit?: number | string;
};
export type strOrNum = string | number;
export interface noteBodyT {
    lat: number;
    lon: number;
    text: string;
}
type GenerateRange<Min extends number, Max extends number> = {
    [K in Min | Exclude<number, Max>]: K;
};
export interface searchTermT {
    "limit": GenerateRange<1, 1000>;
    "closed": number;
    "display_name": string;
    "user": string;
    "from": string;
    "to": string;
    "sort": "created_at" | "updated_at";
    "order": "oldest" | "newest";
}
export {};
