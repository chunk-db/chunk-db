import { Query } from '../Query';
import { IPart, IStaticPart } from '../Query.types';
import { QueryOperators } from '../operators/find';
import { FindQuery } from '../operators/find.types';

/**
 * Calculate safe part of query what can be stored as serializable object
 * @param query
 * @return Object of query
 */
export function buildStaticQuery<T>(query: Query<T>): FindQuery {
    const staticQuery: FindQuery = {};
    for (const part of query.getParts()) {
        if (!isStaticPartOfQuery(part)) break;

        addPartIntoFindQuery(staticQuery, part.value);
    }
    return staticQuery;
}

export function isStaticPartOfQuery<T>(part: IPart<T>): part is IStaticPart<T> {
    return part.type === 'find';
}

/**
 * Add conditions into FindQuery
 * @param targetQuery
 * @param additional
 * @return mutated target
 */
export function addPartIntoFindQuery(targetQuery: FindQuery, additional: IPart['value'] | FindQuery): FindQuery {
    const target: any = targetQuery;

    Object.entries(additional).forEach(([key, value]) => {
        if (value === void 0) throw new Error(`Invalid value: 'undefined'`);
        if (value === null) throw new Error(`Invalid value: 'null'`);

        if (!(key in target)) target[key] = {};

        if (typeof value !== 'object') {
            value = { $eq: value };
        }

        Object.entries(value).forEach(([name, cond]) => {
            switch (name as keyof typeof QueryOperators) {
                case '$eq':
                    if (target[key].$eq) throw new Error(`Condition $eq already exists in "${key}"`);
                    target[key].$eq = cond;
                    break;
                case '$in':
                    if (target[key].$in) {
                        target[key].$in = target[key].$in.filter((v: unknown) => (cond as any[]).includes(v));
                    } else {
                        target[key].$in = [];
                        (cond as any[]).forEach(item => !target[key].$in.includes(item) && target[key].$in.push(item));
                    }
                    break;
                default:
                    throw new Error(`Operator ${name} not implements`);
            }
        });

        if (Object.keys(target[key]).length === 0) delete target[key];
    });

    return target;
}
