import { ChunkDB } from './ChunkDB';
import { IQuery } from './ConditionValidator';
import { CollectionConfig } from './common.types';
import { Query } from './query';
import { IRecord } from './record.types';
import { Refs } from './space';

/**
 * Доступ к данным конкретной коллекции и пространства
 */
export class SpaceReader<T extends IRecord = IRecord> {
    constructor(private readonly db: ChunkDB<any>,
                public readonly refs: Refs,
                public readonly config: CollectionConfig<T>) {
        if (!refs)
            throw new Error(`Refs can not be null`);
    }

    find(query: IQuery): Query<T> {
        const chunkID = this.refs[this.config.name];
        if (!chunkID)
            throw new Error(`Invalid ref "${this.refs[this.config.name]}" for ${this.config.name}`);

        return new Query<T>(this.db, chunkID, query);
    }

    async findOne(query: IQuery): Promise<T | null> {
        const records = await this.findAll(query);
        return records[0] || null;
    }

    findAll(query: IQuery): Promise<T[]> {
        return this.find(query).exec().all();
    }
}
