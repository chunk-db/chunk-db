import { Model } from '../../Model';
import { Collection } from '../../collection';
import { ChunkID, SpaceID } from '../../common.types';
import { FindQuery } from '../operators/find.types';
import { QueryParams } from '../operators/operators.types';

export interface BuildQueryContext {
    collections: { [key: string]: Collection<Model> };
    refs: Map<SpaceID, { ref: ChunkID }>;
}

export type PipeItem<T> = (record: T, params: QueryParams) => T | undefined;

export interface BuiltQuery<T> {
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
    pipe: PipeItem<T>[];
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
