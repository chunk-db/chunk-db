import { IRecord } from '../record.types';
import { AbstractChunk, ChunkType } from './AbstractChunk';
import { ChunkID, UUID } from '../common.types';
import { arrayToObject } from './utils';

export class TemporaryTransactionChunk<T extends IRecord = IRecord> extends AbstractChunk<T> {
    public readonly type = ChunkType.TemporaryTransaction;
    public readonly records: Map<UUID, T> = new Map();

    constructor(id: ChunkID, parent: ChunkID, records: T[] = []) {
        super({
            id,
            type: ChunkType.TemporaryTransaction,
            parents: [parent],
            records: arrayToObject(records as any[]),
        });
    }
}
