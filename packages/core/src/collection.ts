import { ChunkDB } from './ChunkDB';
import { Model } from './Model';

/**
 * Представляет собой доступ к настройкам и данным коллекции
 */
export class Collection<T extends Model> {
    constructor(private readonly db: ChunkDB, public readonly model: T) {}

    find(query: Query): Cursor<T> {
        return new Cursor<T>();
    }

    async findOne(query: Query): Promise<T | null> {
        return null;
        // const records = await this.findAll(query);
        // return records[0] || null;
    }

    async findAll(query: Query): Promise<T[]> {
        return [];
        // return this.find(query).exec().all();
    }
}
