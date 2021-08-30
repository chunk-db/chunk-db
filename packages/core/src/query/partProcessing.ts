import { IRecord } from '../record.types';

import { IPart, PipeOperation, PipeOperator } from './Query.types';
import { filter } from './operators/filter';
import { find } from './operators/find';
import { map } from './operators/map';
import { QueryParams } from './operators/operators.types';

export const Operators = {
    find,
    filter,
    map,
    staticSort: (_: any) => (_record: any, _params: any) => void 0,
    dynamicSort: (_: any) => (_record: any, _params: any) => void 0,
};

export function makePipeByParts<T extends IRecord = IRecord>(
    parts: IPart<T>[]
): (record: T, params: QueryParams) => T | undefined {
    const operations = parts.map(makePipeOperation);
    const length = operations.length;

    return (record, params) => {
        for (let i = 0; i < length; i++) {
            record = operations[i](record, params) as T;
            if (!record) return void 0;
        }
        return record;
    };
}

export function makePipeOperation<T extends IRecord = IRecord>(part: IPart<T>): PipeOperation<T, T> {
    const { type, value } = part;
    const operator: PipeOperator<T, any> = Operators[type];
    if (!operator) {
        throw new Error(`Unknown part type "${part.type}"`);
    }
    return operator(value);
}
