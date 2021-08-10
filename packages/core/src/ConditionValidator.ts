import { Primitive } from './common.types';
import { IRecord } from './record.types';
import { getFieldByPath } from './utils';

/**
 * Доступные операторы
 * https://docs.mongodb.com/manual/reference/operator/query/
 */
export const QueryOperators = {
    $eq: (condition: Primitive) => (value: any) => value === condition,
    $gt: (condition: string | number) => (value: any) => value > condition,
    $gte: (condition: string | number) => (value: any) => value >= condition,
    $lt: (condition: string | number) => (value: any) => value < condition,
    $lte: (condition: string | number) => (value: any) => value <= condition,
    $in: (condition: (string | number)[]) => (value: any) => condition.indexOf(value) !== -1,
};

type Condition = { [key in keyof typeof QueryOperators]?: any };

export type IQuery = {
    [key: string]: Primitive | Condition;
};

export type ConditionValidator<T extends IRecord = IRecord> = (record: T) => boolean;

export function buildConditionQuery(query: IQuery): ConditionValidator {
    if (typeof query !== 'object') throw new Error('ConditionValidator must be an object');

    const byFields = Object.keys(query).map(path => {
        const getter = getFieldByPath(path);
        const conditions = makeConditionChecker(query[path]);
        return {
            getter,
            conditions,
        };
    });

    return (record: IRecord): boolean => {
        return byFields.every(({ getter, conditions }) => {
            const value = getter(record);
            return conditions.every(condition => condition(value));
        });
    };
}

function makeConditionChecker(rule: Condition | number | string | boolean) {
    const condition: Condition = typeof rule === 'object' ? rule : { $eq: rule };
    return Object.keys(condition).map(attr => {
        const operator = attr as keyof typeof QueryOperators;
        if (!(operator in QueryOperators)) throw new InvalidQueryError(`Unknown operator "${operator}"`);

        return QueryOperators[operator](condition[operator]);
    });
}

export class InvalidQueryError extends Error {
    constructor(message: string, public path?: string, public query?: IQuery) {
        super(message);
    }
}
