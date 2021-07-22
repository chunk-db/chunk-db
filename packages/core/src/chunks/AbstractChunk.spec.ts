import { ChunkDB } from '../ChunkDB';

describe('AbstractChunk', () => {
    test('fromUnknown', () => {
        new ChunkDB({} as any);
    });
});
