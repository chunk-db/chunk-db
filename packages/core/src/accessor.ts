import { Optional } from 'utility-types';
import { v4 } from 'uuid';

import { ChunkDB } from './ChunkDB';
import { Model } from './Model';
import { TemporaryTransactionChunk } from './chunks';
import { ChunkID, makeChunkID } from './common.types';
import { DelayedRef } from './delayed-ref';
import { UpdateEvent } from './events';
import { IRecord } from './record.types';
import { Refs, Space } from './space';
import { SpaceReader } from './space-reader';

export class Accessor {
    public updatedRefs: { [NAME: string]: ChunkID; } = {};

    public get refs(): Refs {
        return {
            ...this.space.refs,
            ...this.updatedRefs,
        };
    }

    private stats: UpdateEvent = {
        deleted: [],
        inserted: [],
        updated: [],
        upserted: [],
    };

    public chunks: { [name: string]: TemporaryTransactionChunk } = {};

    constructor(private db: ChunkDB,
                private space: Space) {}

    getDB() {
        return this.db;
    }

    getSpace() {
        return this.space;
    }

    getStats(): UpdateEvent {
        return this.stats;
    }

    public collection<T extends IRecord>(scheme: Model<T>): SpaceReader<T> {
        return new SpaceReader<any>(this.db, this.makeDelayedRef(scheme));
    }

    async insert<T extends IRecord>(scheme: Model<T>, record: Optional<T, Model<T>['uuid']>): Promise<T> {
        const collection = scheme.name;
        this.writeIntoCollection(scheme);
        if (!record[scheme.uuid] as any)
            record = {
                ...record,
                [scheme.uuid]: v4(),
            };
        this.chunks[collection]!.records.set(record[scheme.uuid] as any, record as T);
        this.stats.inserted.push(record[scheme.uuid] as any);
        this.stats.upserted.push(record[scheme.uuid] as any);

        this.db.storage.saveTemporalChunk(this.chunks[collection]!);

        return record as T;
    }

    async upsert<T extends IRecord>(scheme: Model<T>, record: T): Promise<T> {
        const collection = scheme.name;
        this.writeIntoCollection(scheme);
        if (!this.chunks[collection]!.records.has(record[scheme.uuid] as any))
            this.stats.upserted.push(record[scheme.uuid] as any);
        this.chunks[collection]!.records.set(record[scheme.uuid] as any, record);

        this.db.storage.saveTemporalChunk(this.chunks[collection]!);

        return record as T;
    }

    private writeIntoCollection<T extends IRecord>(scheme: Model<T>): void {
        const collection = scheme.name;
        if (collection in this.updatedRefs)
            return;
        const chunkID = makeChunkID(v4());

        const chunk = new TemporaryTransactionChunk(chunkID, this.refs[collection]);

        this.updatedRefs[collection] = chunkID;
        this.chunks[collection] = chunk;
    }

    private makeDelayedRef<T extends IRecord>(scheme: Model<T>): DelayedRef {
        return () => Promise.resolve(this.refs[scheme.name]);
    }
}
