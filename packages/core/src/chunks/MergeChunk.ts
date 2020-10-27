import { IRecord } from '../record.types';
import { AbstractChunk, ChunkType } from './AbstractChunk';
import { UUID } from "../common";

export class MergeChunk<T extends IRecord = IRecord> extends AbstractChunk<T> {
    public readonly type = ChunkType.Merge;
    public readonly commonChunk: string;

    constructor(data: { parents: UUID[], records: ReadonlyMap<string, T> }) {
        super(data);
        this.commonChunk = '';
    }
}
