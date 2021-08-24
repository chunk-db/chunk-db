import { Model } from '../Model';
import { ChunkID, makeChunkID, SpaceID } from '../common.types';
import { IRecord } from '../record.types';
import { Refs } from '../space';
import { isSerializable } from '../utils';

import { DynamicSortQuery, IPart, SortQuery } from './Query.types';
import { FindQuery } from './operators/find.types';
import { QueryParams } from './operators/operators.types';

/**
 * API for creating query
 */
export class Query<T extends IRecord = IRecord> {
    private readonly _parts: IPart<T>[] = [];
    private readonly _model: Model<T>;
    private readonly _params: QueryParams = {};
    private readonly _refs: Refs = {};

    constructor(model: Model<T>);
    constructor(query: Query<T>);
    constructor(query: Query<T> | Model<T> | any) {
        if (query instanceof Model) {
            this._model = query;
        } else if (query instanceof Query) {
            this._model = query._model;
            this._parts = [...query._parts];
            this._params = { ...query._params };
            this._refs = { ...query._refs };
        } else {
            throw new Error('Scheme must be instance of Model');
        }
    }

    private addPart(newPart: IPart<T>): Query<T> {
        const query = new Query(this);
        query._parts.push(newPart);
        return query;
    }

    findByPk(id: string | string[]): Query<T> {
        if (!id) throw new Error();
        if (Array.isArray(id)) {
            return this.addPart({
                type: 'find',
                value: { [this._model.uuid]: { $in: id } },
            });
        } else {
            return this.addPart({
                type: 'find',
                value: { [this._model.uuid]: { $eq: id } },
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

    spaces(spaceIDs: SpaceID[]): Query<T> {
        const query = new Query(this);
        spaceIDs.forEach(spaceID => (query._refs[spaceID] = makeChunkID('')));
        return query;
    }

    space(spaceID: SpaceID, chunkID?: ChunkID): Query<T> {
        const query = new Query(this);
        query._refs[spaceID] = makeChunkID(chunkID || '');
        return query;
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

    getParams(): Readonly<QueryParams> {
        return this._params;
    }

    getRefs(): Readonly<Refs> {
        return this._refs;
    }

    getModel(): Readonly<Model<T>> {
        return this._model;
    }

    getParts(): Readonly<IPart<T>[]> {
        return this._parts;
    }
}
