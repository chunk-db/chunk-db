import { IRecord } from '../record.types';

import { IPart, PipeOperation, PipeOperator, QueryParams } from './Query.types';
import { filter } from './operators/filter';
import { map } from './operators/map';

export const Operators = {
    find: (_: any) => (_record: any, _params: any) => void 0,
    filter,
    map,
    staticSort: (_: any) => (_record: any, _params: any) => void 0,
    dynamicSort: (_: any) => (_record: any, _params: any) => void 0,
};

export function makePipeByParts<T extends IRecord = IRecord>(
    parts: IPart[]
): (record: T, params: QueryParams) => T | undefined {
    const operations = parts.map(partToPipeOperator);
    const length = operations.length;

    return (record, params) => {
        for (let i = 0; i < length; i++) {
            record = operations[i](record, params) as T;
            if (!record) return void 0;
        }
        return record;
    };
}

function partToPipeOperator<T extends IRecord = IRecord>(part: IPart<T>): PipeOperation<T, T> {
    const { type, value } = part;
    const operator: PipeOperator<T, any> = Operators[type];
    if (!operator) {
        throw new Error(`Unknown part type "${part.type}"`);
    }
    return operator(value);
}
