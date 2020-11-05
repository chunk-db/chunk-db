import { ChunkDB } from './ChunkDB';
import { IQuery } from './ConditionValidator';
import { Query } from './query';
import { IRecord } from './record.types';
import { Space } from './space';
import { CollectionConfig } from './db.types';

/**
 * Доступ к данным конкретной коллекции и пространства
 */
export class SpaceReader<T extends IRecord = IRecord> {
    constructor(private readonly db: ChunkDB<any>,
                public readonly space: Space,
                public readonly config: CollectionConfig<T>) {
        if (!space)
            throw new Error(`Invalid space "${this.space.id}`);
    }

    find(query: IQuery): Query<T> {
        const chunkID = this.space.refs[this.config.name];
        if (!chunkID)
            throw new Error(`Space "${this.space.id}" have invalid ref "${this.space.refs[this.config.name]}" for ${this.config.name}`);

        return new Query<T>(this.db, chunkID, query);
    }

    findOne(): Promise<T[]> {
        return [] as any;
    }

    findAll(query: IQuery): Promise<T[]> {
        return this.find(query).exec().all();
    }
}
