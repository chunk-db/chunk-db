import { ChunkDB } from '../ChunkDB';

describe('AbstractChunk', () => {
    test('fromUnknown', () => {
        const db = new ChunkDB({} as any);
    });
});
