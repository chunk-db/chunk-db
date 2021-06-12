import { ChunkDB } from './ChunkDB';
import { IQuery } from './ConditionValidator';
import { Model } from './Model';
import { Cursor } from './cursor';
import { DelayedRef } from './delayed-ref';
import { QuerySelector } from './query-selector';
import { IRecord } from './record.types';

/**
 * Создание и донастройка запроса к БД
 */
export class Query<T extends IRecord = IRecord> {
    private _query: IQuery;

    constructor(
        public readonly db: ChunkDB,
        public readonly delayedRef: DelayedRef<T>,
        public readonly model: Model<T>,
        query: IQuery
    ) {
        this._query = query;
    }

    public exec<R extends T = T>(): Cursor<R> {
        const querySelector = new QuerySelector<R>(this.db, this.delayedRef as any, this.model as any, this._query); // TODO
        return new Cursor<R>(querySelector);
    }
}
