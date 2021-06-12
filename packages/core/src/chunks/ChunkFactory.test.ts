import { ChunkType } from './AbstractChunk';
import { chunkFactory } from './ChunkFactory';
import { IncrementalChunk } from './IncrementalChunk';
import { SnapshotChunk } from './SnapshotChunk';

describe('chunk factory', () => {
    it('snapshot chunk', () => {
        const data = {
            type: ChunkType.Snapshot,
            parents: [],
            data: {
                records: {
                    '123': {
                        _id: '123',
                        name: 'name',
                    },
                },
            },
        };

        const chunk = chunkFactory(data);

        expect(chunk).toBeInstanceOf(SnapshotChunk);
    });
    it('incremental chunk', () => {
        const data = {
            type: ChunkType.Incremental,
            parents: [],
            data: {
                records: {
                    '123': {
                        _id: '123',
                        name: 'name 2',
                    },
                },
            },
        };

        const chunk = chunkFactory(data);

        expect(chunk).toBeInstanceOf(IncrementalChunk);
    });
});
