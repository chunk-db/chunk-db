import { IRecord } from "./record.types";
import { ChunkID } from "./common";
import { IGenericChunk } from "./chunks/ChunkFactory";
import { IRefCollection } from "./db.types";

export interface IRefStorageDriver {
    saveRefs(refs: IRefCollection): Promise<void>;

    loadRefs(): Promise<IRefCollection>;
}

export interface IChunkStorageDriver {
    get(id: ChunkID): Promise<IGenericChunk>;

    set(chunk: IGenericChunk): Promise<IGenericChunk>;

    remove(id: ChunkID): Promise<void>;
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
