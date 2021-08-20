import { UUID } from './common.types';
import { QuerySelector } from './query-selector';
import { BuiltQuery } from './query/buildQuery/buildQuery.types';
import { IRecord } from './record.types';

/**
 * Предоставляет возможность получения данных по конкретному запросу
 */
export class Cursor<T extends IRecord = IRecord> {
    private _done = false;
    public get done() {
        return this._done;
    }

    constructor(private selector: QuerySelector<T>, private query: BuiltQuery<T>) {}

    // public async next(): Promise<T> {
    //
    // }

    // public nextChunk(): Promise<{ chunkID: ChunkID, records: T[] }>;

    public async one(): Promise<T | null> {
        let record: T | null = null;
        while (!this.selector.done || !record) {
            const { records } = await this.selector.next();
            if (records && records.size) {
                record = Array.from(records.values())[0];
            }
        }
        this._done = true;
        return record;
    }

    public async all(): Promise<T[]> {
        if (this._done) throw new Error('Cursor already complete');
        const allRecords = new Map<UUID, T | null>();
        while (!this.selector.done) {
            const { records } = await this.selector.next();
            if (records) {
                records.forEach((value, key) => !allRecords.has(key) && allRecords.set(key, value));
            }
        }
        this._done = true;
        return Array.from(allRecords.values()).filter(record => !!record) as T[];
    }

    public async reduce<R>(reducer: (acc: R, record: T) => R, initialValue: R): Promise<R> {
        if (this._done) throw new Error('Cursor already complete');

        let result = initialValue;
        while (!this.selector.done) {
            const { records } = await this.selector.next();
            if (records) {
                records.forEach(record => {
                    if (record) result = reducer(result, record);
                });
            }
        }
        this._done = true;
        return result;
    }
}
