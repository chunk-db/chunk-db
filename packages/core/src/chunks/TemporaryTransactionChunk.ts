import { Model } from '../Model';
import { ChunkID, UUID } from '../common.types';
import { IRecord } from '../record.types';

import { AbstractChunk, ChunkType } from './AbstractChunk';
import { arrayToMap } from './utils';

export class TemporaryTransactionChunk<T extends IRecord = IRecord> extends AbstractChunk<T> {
    public readonly type = ChunkType.TemporaryTransaction;
    /**
     * @inheritDoc
     */
    public readonly data: Map<string, Map<UUID, T>> = new Map();

    constructor(id: ChunkID, parent: ChunkID) {
        super({
            id,
            type: ChunkType.TemporaryTransaction,
            parents: parent ? [parent] : [],
            data: {},
        });
    }

    public hasRecords<T extends IRecord>(scheme: Model<T>, uuid: UUID): boolean {
        const collection = this.data.get(scheme.name) || new Map<UUID, T>();
        return !!collection && collection.has(uuid);
    }

    public setRecord<T extends IRecord>(scheme: Model<T>, uuid: UUID, record: T | null): void {
        const collection = this.data.get(scheme.name) || new Map<UUID, T>();
        collection.set(uuid, record as any); // TODO
        this.data.set(scheme.name, collection as any); // TODO
    }

    public setRecords<T extends IRecord>(scheme: Model<T>, records: T[]): void {
        this.data.set(scheme.name, arrayToMap<any>(records)); // TODO
    }
}
