import { IGenericChunk } from './chunks/ChunkFactory';
import { ChunkID, SpaceID } from './common.types';
import { IRecord } from './record.types';
import { ISpace } from './space';

export interface IStorageDriver {
    // chunks
    loadChunk(id: ChunkID): Promise<IGenericChunk | undefined>;

    saveChunk(chunk: IGenericChunk): Promise<IGenericChunk>;

    markDraftChunkAsUnused(id: ChunkID): Promise<void>;

    // spaces
    loadSpace(id: SpaceID): Promise<ISpace | undefined>;

    saveSpace(space: ISpace): Promise<ISpace>;

    // save meta
    // load meta
    // remove meta
}

export interface IStorageCacheDriver extends IStorageDriver {
    // chunks
    removeChunk(id: ChunkID): Promise<void>;

    clearChunks(): Promise<void>;

    // spaces
    getAllSpaces(): Promise<ISpace[]>;

    clearSpaces(): Promise<void>;
}

export interface IChunk<T extends IRecord = IRecord> {
    id: string;
    records: { [collection: string]: { [key: string]: T } };
}

export class NotFoundChunkError extends Error {
    constructor(id: ChunkID) {
        super(`Chunk "${id}" not found in storage`);
    }
}
