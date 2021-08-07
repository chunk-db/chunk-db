import { ChunkDB } from './ChunkDB';
import { IQuery } from './ConditionValidator';
import { Model } from './Model';
import { DelayedRefs } from './delayed-ref';
import { Query } from './query';

/**
 * Доступ к данным конкретной коллекции и пространства
 */
export class SpaceReader<T extends Model = Model> {
    constructor(private readonly db: ChunkDB, public readonly model: T, public readonly delayedRefs: DelayedRefs<T>) {}

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
