import { Model } from '../Model';
import { SpaceID } from '../common.types';
import { IRecord } from '../record.types';
import { isSerializable } from '../utils';

import { DynamicSortQuery, IPart, SortQuery } from './Query.types';
import { FindQuery } from './operators/find.types';
import { QueryParams } from './operators/operators.types';

/**
 * Создание запроса к БД
 */
export class Query<T extends IRecord = IRecord> {
    public readonly parts: IPart<T>[] = [];
    public readonly params: QueryParams = {};
    public readonly model: Model<T>;

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

    findByPk(id: string | string[]): Query<T> {
        if (!id) throw new Error();
        if (Array.isArray(id)) {
            return this.addPart({
                type: 'find',
                value: { [this.model.uuid]: { $in: id } },
            });
        } else {
            return this.addPart({
                type: 'find',
                value: { [this.model.uuid]: { $eq: id } },
            });
        }
    }

    find(staticQuery: FindQuery): Query<T> {
        if (!isSerializable(staticQuery)) throw new Error('Query.find allow only serializable argument');

        return this.addPart({
            type: 'find',
            value: staticQuery,
        });
    }

    /**
     * @deprecated Method not ready
     * @param fn
     */
    filter(fn: (record: T) => boolean): Query<T> {
        if (typeof fn !== 'function') throw new Error('Query.filter allow only function');
        return this.addPart({
            type: 'filter',
            value: fn,
        });
    }

    /**
     * @deprecated Method not ready
     * @param fn
     */
    spaces(): Query<T> {
        return this;
    }

    /**
     * @deprecated Method not ready
     * @param fn
     */
    space(spaceID: SpaceID | SpaceID[]): Query<T> {
        return this;
    }

    /**
     * @deprecated Method not ready
     * @param fn
     */
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

    one(): Query<T> {
        return this;
    }

    all(): Query<T> {
        return this;
    }
}
