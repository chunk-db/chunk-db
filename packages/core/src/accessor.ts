import { Optional } from 'utility-types';
import { v4 } from 'uuid';

import { ChunkDB } from './ChunkDB';
import { ICollectionTypes, UUID } from './common.types';
import { Refs, Space } from './space';
import { SpaceReader } from './space-reader';
import { TemporaryTransactionChunk } from './chunks/TemporaryTransactionChunk';
import { UpdateEvent } from './events';

export class Accessor<RECORDS extends ICollectionTypes> {
    public updatedRefs: { [NAME in keyof RECORDS]?: UUID; } = {};

    public get refs(): Refs<RECORDS> {
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

    private chunks: { [name in keyof RECORDS]?: TemporaryTransactionChunk } = {};

    constructor(private db: ChunkDB<RECORDS>,
                private space: Space<RECORDS>) {}

    getDB() {
        return this.db;
    }

    getSpace() {
        return this.space;
    }

    getStats(): UpdateEvent {
        return this.stats;
    }

    public collection<NAME extends keyof RECORDS>(name: NAME): SpaceReader<RECORDS[NAME]> {
        return new SpaceReader<any>(this.db, this.refs, this.db.collections[name as keyof RECORDS].config);
    }

    async insert<NAME extends keyof RECORDS, T extends RECORDS[NAME]>(collection: NAME, record: Optional<T, '_id'>): Promise<T> {
        this.writeIntoCollection(collection);
        console.log(`insert into ${collection}`);
        if (!record._id)
            record = {
                ...record,
                _id: v4(),
            };
        this.chunks[collection]!.records.set(record._id!, record as T);
        this.stats.inserted.push(record._id!);
        this.stats.upserted.push(record._id!);
        return record as T;
    }

    async upsert<NAME extends keyof RECORDS, T extends RECORDS[NAME]>(collection: NAME, record: T): Promise<T> {
        this.writeIntoCollection(collection);
        console.log(`insert into ${collection}`);
        this.chunks[collection]!.records.set(record._id, record);
        if (!this.chunks[collection]!.records.has(record._id))
            this.stats.upserted.push(record._id);

        this.db.storage.saveChunk(this.chunks[collection]!);

        return record as T;
    }

    private writeIntoCollection<NAME extends keyof RECORDS>(collection: NAME): void {
        if (collection in this.updatedRefs)
            return;
        const chunkID = v4();

        const chunk = new TemporaryTransactionChunk(chunkID, this.refs[collection]);

        this.updatedRefs[collection] = chunkID;
        this.chunks[collection] = chunk;
        console.log(this.updatedRefs);
    }
}
