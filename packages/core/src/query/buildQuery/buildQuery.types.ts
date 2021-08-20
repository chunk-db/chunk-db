import { FindQuery } from '../operators/find.types';
import { QueryParams } from '../operators/operators.types';

export interface BuildQueryContext {}

export interface BuiltQuery<T, R = T> {
    staticQuery: FindQuery;
    /**
     * @deprecated Property not ready
     */
    params: QueryParams;
    /**
     * @deprecated Property not ready
     */
    pipe: (record: T, params: QueryParams) => T | undefined;
    /**
     * @deprecated Property not ready
     */
    postProcessing: undefined | ((record: T) => R);
    /**
     * @deprecated Property not ready
     */
    limit: number;
    /**
     * @deprecated Property not ready
     */
    offset: number;
}

export enum Optimization {
    Auto = 'auto',
    None = 'none',
}

export interface BuildQueryOptions {
    optimization?: false | Optimization;
}
