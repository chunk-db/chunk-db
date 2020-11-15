import { IRecord } from '../record.types';

import { AbstractChunk, ChunkType } from './AbstractChunk';
import { IGenericChunk } from './ChunkFactory';

export class MergeChunk<T extends IRecord = IRecord> extends AbstractChunk<T> {
    public readonly type = ChunkType.Merge;
    public readonly commonChunk: string;

    constructor(data: IGenericChunk) {
        super(data);
        this.commonChunk = '';
    }
}
