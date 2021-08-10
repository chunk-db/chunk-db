import { FilterQuery, IPart, PipeOperation } from './Query.types';
import { IRecord } from '../record.types';

export function makePipeByParts<T extends IRecord = IRecord, R = T>(parts: IPart[]): ((record: T) => R | undefined) {

}

export function partToPipeOperator<T extends IRecord = IRecord, R = T>(part: IPart<T>): PipeOperation<T, R> {
    const { type, value, withParams = false } = part;
    switch (type) {
        case 'filter':
    }
    return part.value;
}

export const Operators = {
    filter,
}

export function filter<T>(fn: FilterQuery<T>): T | undefined {
    return
}
