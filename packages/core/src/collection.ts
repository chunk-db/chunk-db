import { IRecord } from './record.types';
import { ChunkDB } from './ChunkDB';
import {
    CollectionConfig,
    ICollectionTypes,
} from './db.types';
import { SpaceReader } from './space-reader';
import { UUID } from './common';

/**
 * Представляет собой доступ к настройкам и данным коллекции
 */
export class Collection<RECORDS extends ICollectionTypes, NAME extends keyof RECORDS, T extends IRecord = RECORDS[NAME]> {
    constructor(private readonly db: ChunkDB<RECORDS>,
                public readonly name: NAME,
                public readonly config: CollectionConfig<T>) {
    }

    public space(space: UUID): SpaceReader<T> {
        return new SpaceReader<T>(this.db, this.db.spaces.get(space)!, this.config);
    }
}
