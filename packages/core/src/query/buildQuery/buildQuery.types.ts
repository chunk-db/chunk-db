import { Model } from '../../Model';
import { ChunkID, SpaceID } from '../../common.types';
import { Refs } from '../../space';
import { FindQuery } from '../operators/find.types';
import { QueryParams } from '../operators/operators.types';

export interface BuildQueryContext {
    refs: Map<SpaceID, { ref: ChunkID }>;
}

export interface BuiltQuery<T, R = T> {
    refs: ChunkID[];
    model: Model<T>;
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
