import { ChunkDB } from './ChunkDB';
import { IQuery } from './ConditionValidator';
import { Cursor } from './cursor';
import { IRecord } from './record.types';
import { QuerySelector } from './query-selector';
import { ChunkID } from './common.types';

/**
 * Создание и донастройка запроса к БД
 */
export class Query<T extends IRecord = IRecord> {
    private _query: IQuery;

    constructor(public readonly db: ChunkDB<any>,
                public readonly chunkID: ChunkID,
                query: IQuery) {
        this._query = query;
    }

    public exec<R extends T = T>(): Cursor<R> {
        const querySelector = new QuerySelector<R>(this.db, this.chunkID, this._query);
        return new Cursor<R>(querySelector);
    }
}
