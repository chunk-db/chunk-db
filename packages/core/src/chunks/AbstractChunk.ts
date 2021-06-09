import { ChunkID, makeChunkID, UUID } from '../common.types';
import { IRecord } from '../record.types';

import { IGenericChunk } from './ChunkFactory';
import { objectToMap } from './utils';

export enum ChunkType {
    Unknown = '',
    Snapshot = 'snapshot',
    Incremental = 'incremental',
    Update = 'update',
    Merge = 'merge',
    Draft = 'draft',
    TemporaryTransaction = 'temporary-transaction',
}

/**
 * Чанк содержит информацию об одном одновлении в одной коллекции
 */
export abstract class AbstractChunk<T extends IRecord = IRecord> {
    public readonly id: ChunkID = makeChunkID('');
    public abstract type: ChunkType;
    public readonly records: ReadonlyMap<UUID, T>;
    public readonly parents: ChunkID[];

    protected constructor(data: IGenericChunk) {
        this.id = makeChunkID(data.id!);
        this.parents = data.parents.map(id => makeChunkID(id));
        this.records = objectToMap(data.records) as any;
    }

    public toGenericChunk(): IGenericChunk {
        const records: { [key: string]: T } = {};
        this.records.forEach((record, id) => records[id] = record);
        return {
            id: this.id,
            type: this.type,
            parents: this.parents.slice(),
            records,
        };
    }
}
