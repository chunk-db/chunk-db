import { v4 } from 'uuid';

import { ChunkDB } from './ChunkDB';
import { Model } from './Model';
import { TemporaryTransactionChunk } from './chunks';
import { ChunkID, makeChunkID, SpaceID, UUID } from './common.types';
import { DelayedRefs } from './delayed-ref';
import { InnerDBError } from './errors';
import { UpdateEvent } from './events';
import { IRecord } from './record.types';
import { Space } from './space';
import { SpaceReader } from './space-reader';

export class Accessor {
    public readonly initialRefs: ReadonlyMap<SpaceID, ChunkID>;
    public readonly updatedRefs = new Map<SpaceID, ChunkID>();
    public readonly refs = new Map<SpaceID, ChunkID>();

    private stats: UpdateEvent = {
        deleted: [],
        inserted: [],
        updated: [],
        upserted: [],
    };

    public chunks: { [name: string]: TemporaryTransactionChunk } = {};

    constructor(private db: ChunkDB, private space: Space) {
        this.initialRefs = new Map([[space.id, space.ref]]);
        this.refs = new Map([[space.id, space.ref]]);
    }

    getDB() {
        return this.db;
    }

    getSpace() {
        return this.space;
    }

    getStats(): UpdateEvent {
        return this.stats;
    }

    public collection<T extends IRecord>(model: Model<T>): SpaceReader<T> {
        return new SpaceReader<any>(this.db, model, this.makeDelayedRefs(model));
    }

    async upsert<T extends IRecord>(scheme: Model<T>, record: T): Promise<T> {
        this.prepareSpaceForWriting(this.space.id);
        if (!this.chunks[this.space.id]!.hasRecords(scheme, record[scheme.uuid] as any)) {
            // todo
            this.stats.upserted.push(record[scheme.uuid] as any);
        }
        this.chunks[this.space.id]!.setRecord(scheme, record[scheme.uuid] as any, record); // todo

        this.db.storage.saveTemporalChunk(this.chunks[this.space.id]!);

        return record as T;
    }

    async remove<T extends IRecord>(scheme: Model<T>, id: UUID): Promise<void> {
        this.prepareSpaceForWriting(this.space.id);
        if (!this.chunks[this.space.id]!.hasRecords(scheme, id)) {
            this.stats.deleted.push(id);
        }
        this.chunks[this.space.id]!.setRecord(scheme, id, null);

        this.db.storage.saveTemporalChunk(this.chunks[this.space.id]!);
    }

    private prepareSpaceForWriting(space: SpaceID): void {
        if (this.updatedRefs.has(space)) return;

        const chunkID = makeChunkID(v4());

        const chunk = new TemporaryTransactionChunk(chunkID, this.refs.get(space)!);

        this.updateRef(this.space.id, chunkID);
        this.chunks[space] = chunk;
    }

    private makeDelayedRefs<T extends IRecord>(_: Model<T>): DelayedRefs {
        return () => Promise.resolve([this.refs.get(this.space.id)!]);
    }

    private updateRef(space: SpaceID, chunk: ChunkID): boolean {
        if (!this.initialRefs.has(space)) throw new InnerDBError(`Forbidden to write into not defined spaces`);

        if (this.initialRefs.get(space) === chunk) return false;

        if (this.updatedRefs.get(space) === chunk) return false;

        this.updatedRefs.set(space, chunk);
        this.refs.set(space, chunk);
        return true;
    }
}
