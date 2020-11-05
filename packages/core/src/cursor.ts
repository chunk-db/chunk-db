import { IRecord } from './record.types';
import { QuerySelector } from './query-selector';

/**
 * Предоставляет возможность получения данных по конкретному запросу
 */
export class Cursor<T extends IRecord = IRecord> {
    #done = false;
    public get done() {
        return this.#done;
    }

    constructor(private querySelector: QuerySelector<T>) {
    }

    // public async next(): Promise<T> {
    //
    // }

    // public nextChunk(): Promise<{ chunkID: ChunkID, records: T[] }>;

    public async one(): Promise<T | null> {
        let record: T | null = null;
        while (!this.querySelector.done || !record) {
            const { records } = await this.querySelector.next();
            record = records[0] || null;
        }
        this.#done = true;
        return record;
    }

    public async all(): Promise<T[]> {
        if (this.#done)
            throw new Error('Cursor already complete');
        const allRecords: T[] = [];
        while (!this.querySelector.done) {
            const { records } = await this.querySelector.next();
            allRecords.push(...records);
        }
        this.#done = true;
        return allRecords;
    }

    public async reduce<R>(reducer: (acc: R, record: T) => R, initialValue: R): Promise<R> {
        if (this.#done)
            throw new Error('Cursor already complete');

        let result = initialValue;
        while (!this.querySelector.done) {
            const { records } = await this.querySelector.next();
            records.forEach(record => result = reducer(result, record));
        }
        this.#done = true;
        return result;
    }
}
