import { ChunkDB } from './ChunkDB';
import { Model } from './Model';

/**
 * Представляет собой доступ к настройкам и данным коллекции
 */
export class Collection<T extends Model> {
    constructor(private readonly db: ChunkDB, public readonly model: T) {}
}
