import { MapModifier, PipeOperation } from '../Query.types';

import { QueryParams } from './operators.types';

export function map<T, R>(fn: MapModifier<T, R>): PipeOperation<T, R> {
    return (record: T, params: QueryParams) => fn(record, params);
}
