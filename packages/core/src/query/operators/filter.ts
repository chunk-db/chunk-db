import { FilterQuery, PipeOperation, QueryParams } from '../Query.types';

export function filter<T>(fn: FilterQuery<T>): PipeOperation<T, T> {
    return (record: T, params: QueryParams) => (fn(record, params) ? record : void 0);
}
