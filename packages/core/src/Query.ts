import { Model } from './Model';
import { DynamicSortQuery, FindQuery, IPart, SortQuery } from './Query.types';
import { IRecord } from './record.types';
import { isSerializable } from './utils';

/**
 * Создание запроса к БД
 */
export class Query<T extends IRecord = IRecord> {
    public readonly parts: IPart<T>[] = [];
    public readonly params: Record<string, any> = {};
    private readonly model: Model<T>;

    constructor(model: Model<T>);
    constructor(query: Query<T>);
    constructor(query: Query<T> | Model<T>) {
        if (query instanceof Model) {
            this.model = query;
        } else {
            this.model = query.model;
            this.parts = [...query.parts];
            this.params = { ...query.params };
        }
    }

    private addPart(newPart: IPart<T>): Query<T> {
        const query = new Query(this);
        query.parts.push(newPart);
        return query;
    }

    find(staticQuery: FindQuery): Query<T> {
        if (!isSerializable(staticQuery)) throw new Error('Query.find allow only serializable argument');

        return this.addPart({
            type: 'find',
            value: staticQuery,
        });
    }

    filter(fn: (record: T) => boolean): Query<T> {
        if (typeof fn !== 'function') throw new Error('Query.filter allow only function');
        return this.addPart({
            type: 'filter',
            value: fn,
        });
    }

    spaces(): Query<T> {
        return this;
    }

    sort(sort: SortQuery | DynamicSortQuery<T>): Query<T> {
        if (typeof sort === 'function')
            return this.addPart({
                type: 'dynamicSort',
                value: sort,
            } as IPart<T>);
        if (isSerializable(sort, true))
            return this.addPart({
                type: 'staticSort',
                value: sort,
            });
        throw new Error('Query.sort allow only serializable object or function as an argument');
    }
}

export function param(strings: TemplateStringsArray) {
    const paramName = strings[0];
    if (!paramName || strings.length !== 1) throw new Error(`Invalid parameter "${strings.raw}"`);
    return '$parameter$' + paramName;
}
