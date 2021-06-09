import { ChunkID, makeChunkID, UUID } from '../common.types';
import { IRecord } from '../record.types';

import { IGenericChunk } from './ChunkFactory';
import { calculateSizes, chunkDataToMap } from './utils';

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
 * Чанк содержит информацию об одном одновлении во всех коллекциях
 */
export abstract class AbstractChunk<T extends IRecord = IRecord> {
    public readonly id: ChunkID = makeChunkID('');
    public abstract type: ChunkType;
    /**
     * All records stored in chunk
     *
     * This Map of Map like [collection][record uuid]
     */
    public readonly data: ReadonlyMap<string, ReadonlyMap<UUID, T>>;
    public readonly parents: ChunkID[];
    public readonly size: number = 0;
    public readonly sizes: { [collection: string]: number } = {};

    protected constructor(data: IGenericChunk) {
        this.id = makeChunkID(data.id || '');
        this.parents = data.parents.map(uuid => makeChunkID(uuid));
        this.data = chunkDataToMap(data.data) as any;
        const { size, sizes } = calculateSizes(this.data);
        this.size = size;
        this.sizes = sizes;
    }

    public toGenericChunk(): IGenericChunk {
        const data: { [collection: string]: { [key: string]: T } } = {};
        this.data.forEach((records, collection) => {
            const list: { [key: string]: T } = {};
            records.forEach((record, id) => list[id] = record);
            data[collection] = list;
        });
        return {
            id: this.id,
            type: this.type,
            parents: this.parents.slice(),
            data,
        };
    }
}
