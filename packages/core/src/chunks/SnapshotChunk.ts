import { IRecord } from '../record.types';

import { AbstractChunk, ChunkType } from './AbstractChunk';
import { IGenericChunk } from './ChunkFactory';

export class SnapshotChunk<T extends IRecord = IRecord> extends AbstractChunk<T> {
    public readonly type = ChunkType.Snapshot;

    constructor(data: IGenericChunk) {
        super(data);
    }
}
