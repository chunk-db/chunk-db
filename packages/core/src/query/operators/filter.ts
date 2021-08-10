import { FilterQuery, PipeOperation } from '../Query.types';

import { QueryParams } from './operators.types';

export function filter<T>(fn: FilterQuery<T>): PipeOperation<T, T> {
    return (record: T, params: QueryParams) => (fn(record, params) ? record : void 0);
}
