import { ChunkType, IGenericChunk, InMemoryChunkStorage, IRecord, Model, UUID } from '../src';

export interface IDemoRecord extends IRecord {
    _id: UUID;
    user: number;
    value: string;
}

export const TestRecord = new Model<IDemoRecord>('records', {
    uuid: '_id',
    factory(data: any): IDemoRecord {
        return data;
    },
    indexes: {},
});

export const chunkABC1: IGenericChunk<IDemoRecord> = {
    id: 'initial',
    parents: [],
    type: ChunkType.Snapshot,
    data: {
        records: {
            a: { _id: 'a', user: 1, value: 'a0' },
            d: { _id: 'd', user: 2, value: 'd0' },
        },
    },
};

export const chunkA1: IGenericChunk<IDemoRecord> = {
    id: 'a1',
    parents: ['initial'],
    type: ChunkType.Incremental,
    data: {
        records: {
            a: { _id: 'a', user: 1, value: 'a1' },
        },
    },
};

export const allDemoChunks = [chunkABC1, chunkA1];

export async function demoStorage() {
    const storage = new InMemoryChunkStorage();
    await storage.saveChunk(chunkABC1);
    await storage.saveChunk(chunkA1);
    return storage;
}
