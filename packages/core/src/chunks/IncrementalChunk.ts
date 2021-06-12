import { IRecord } from '../record.types';

import { AbstractChunk, ChunkType } from './AbstractChunk';
import { IGenericChunk } from './ChunkFactory';

export class IncrementalChunk<T extends IRecord = IRecord> extends AbstractChunk<T> {
    public readonly type = ChunkType.Incremental;

    constructor(data: IGenericChunk) {
        super(data);

        if (!this.data.size) throw new Error('Incremental chunk can not be empty');
    }
}
