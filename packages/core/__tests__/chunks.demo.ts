import { IGenericChunk } from '../src/chunks/ChunkFactory';
import { ChunkType } from '../src/chunks/AbstractChunk';
import { IRecord } from '../src/record.types';
import { InMemoryChunkStorage } from '../src/in-memory-chunk-storage';

export interface IDemoRecord extends IRecord {
    user: number;
    value: string;
}

export const chunkABC1: IGenericChunk<IDemoRecord> = {
    id: 'initial',
    parents: [],
    type: ChunkType.Snapshot,
    records: {
        'a': { _id: 'a', user: 1, value: 'a0' },
        'd': { _id: 'd', user: 2, value: 'd0' },
    },
};

export const chunkA1: IGenericChunk<IDemoRecord> = {
    id: 'a1',
    parents: ['initial'],
    type: ChunkType.Incremental,
    records: {
        'a': { _id: 'a', user: 1, value: 'a1' },
    },
};

export const allDemoChunks = [
    chunkABC1,
    chunkA1,
];

export async function demoStorage() {
    const storage = new InMemoryChunkStorage();
    await storage.saveChunk(chunkABC1);
    await storage.saveChunk(chunkA1);
    return storage;
}