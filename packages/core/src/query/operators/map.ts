import { MapModifier, PipeOperation, QueryParams } from '../Query.types';

export function map<T, R>(fn: MapModifier<T, R>): PipeOperation<T, R> {
    return (record: T, params: QueryParams) => fn(record, params);
}
