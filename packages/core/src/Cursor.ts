import { UUID } from './common.types';
import { QuerySelector } from './query-selector';
import { BuiltQuery } from './query/buildQuery/buildQuery.types';
import { IRecord } from './record.types';
import { makePipeByParts } from './query/partProcessing';
import { QueryParams } from './query/operators/operators.types';

/**
 * Предоставляет возможность получения данных по конкретному запросу
 */
export class Cursor<T extends IRecord = IRecord> {
    private _done = false;

    private pipe: (record: T, params: QueryParams) => T | undefined;

    public get done() {
        return this._done;
    }

    constructor(private selector: QuerySelector<T>, private query: BuiltQuery<T>, params: QueryParams) {
        const operations = query.pipe;
        const length = operations.length;

        this.pipe = (record: T): T | undefined => {
            for (let i = 0; i < length; i++) {
                record = operations[i](record, params) as T;
                if (!record) return void 0;
            }
            return record;
        };
    }

    // public async next(): Promise<T> {
    //
    // }

    // public nextChunk(): Promise<{ chunkID: ChunkID, records: T[] }>;

    public async one(): Promise<T | null> {
        while (!this.selector.done) {
            const { records } = await this.selector.next();
            if (records) {
                const iterator = records.entries();
                for (;;) {
                    const { done, value } = iterator.next();
                    if (done) break;
                    if (!value) continue;
                    const [key, item] = value;
                    const processed = this.pipe(item, {});
                    if (processed) {
                        this._done = true;
                        return processed;
                    }
                    if (done) break;
                }
            }
        }
        this._done = true;
        return null;
    }

    public async all(): Promise<T[]> {
        if (this._done) throw new Error('Cursor already complete');
        const allRecords = new Map<UUID, T | null>();
        while (!this.selector.done) {
            const { records } = await this.selector.next();
            if (!records) continue;
            records.forEach((item, key) => {
                // null
                if (item === null) {
                    allRecords.set(key, null);
                    return;
                }
                const processed = this.pipe(item, {});
                if (processed && !allRecords.has(key)) allRecords.set(key, processed);
            });
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
