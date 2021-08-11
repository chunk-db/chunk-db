import { FindQuery } from "./operators/find.types";
import { QueryParams } from "./operators/operators.types";

export interface BuildQueryContext {}

export interface BuiltQuery<T, R = T> {
    staticQuery: FindQuery;
    params: QueryParams;
    pipe: (record: T, params: QueryParams) => T | undefined;
    postProcessing: undefined | ((record: T) => R);
    limit: number;
    offset: number;
}

export enum Optimization {
    Auto = 'auto',
    None = 'none',
}

export interface BuildQueryOptions {
    optimization?: false | Optimization;
}
