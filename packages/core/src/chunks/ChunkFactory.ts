import { UUID } from '../common.types';
import { IRecord } from '../record.types';

import { AbstractChunk, ChunkType } from './AbstractChunk';
import { IncrementalChunk } from './IncrementalChunk';
import { SnapshotChunk } from './SnapshotChunk';
import { isGenericChunk } from './utils';

export interface IGenericChunk<T extends IRecord = IRecord> {
    id?: UUID;
    type: ChunkType;
    parents: UUID[];
    data: { [collection: string]: { [id: string]: T } };
}

export function chunkFactory(data: unknown): AbstractChunk {
    if (!isGenericChunk(data)) throw new Error('Invalid chunk');
    switch (data.type) {
        case ChunkType.Snapshot:
            return new SnapshotChunk(data);
        case ChunkType.TemporaryTransaction:
        case ChunkType.Incremental:
        default:
            return new IncrementalChunk(data);
    }
}
