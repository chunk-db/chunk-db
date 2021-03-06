import { ChunkDB } from './ChunkDB';
import { IQuery } from './ConditionValidator';
import { Model } from './Model';
import { DelayedRefs } from './delayed-ref';
import { Query } from './query';
import { IRecord } from './record.types';

/**
 * Доступ к данным конкретной коллекции и пространства
 */
export class SpaceReader<T extends IRecord = IRecord> {
    constructor(
        private readonly db: ChunkDB,
        public readonly model: Model<T>,
        public readonly delayedRefs: DelayedRefs<T>
    ) {}

    find(query: IQuery): Query<T> {
        return new Query<T>(this.db, this.delayedRefs, this.model, query);
    }

    async findOne(query: IQuery): Promise<T | null> {
        const records = await this.findAll(query);
        return records[0] || null;
    }

    findAll(query: IQuery): Promise<T[]> {
        return this.find(query).exec().all();
    }
}
