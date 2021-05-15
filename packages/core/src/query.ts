import { ChunkDB } from './ChunkDB';
import { IQuery } from './ConditionValidator';
import { ChunkID, SpaceID } from './common.types';
import { Cursor } from './cursor';
import { QuerySelector } from './query-selector';
import { IRecord } from './record.types';
import { DelayedRef } from './delayed-ref';

/**
 * Создание и донастройка запроса к БД
 */
export class Query<T extends IRecord = IRecord> {
    private _query: IQuery;

    constructor(public readonly db: ChunkDB<any>,
                public readonly delayedRef: DelayedRef<T>,
                query: IQuery) {
        this._query = query;
    }

    public exec<R extends T = T>(): Cursor<R> {
        const querySelector = new QuerySelector<R>(this.db, this.delayedRef as any, this._query);
        return new Cursor<R>(querySelector);
    }
}
