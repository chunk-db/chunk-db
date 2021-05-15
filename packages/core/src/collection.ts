import { ChunkDB } from './ChunkDB';
import {
    CollectionConfig,
    ICollectionTypes, SpaceID,
} from './common.types';
import { IRecord } from './record.types';
import { SpaceReader } from './space-reader';

/**
 * Представляет собой доступ к настройкам и данным коллекции
 */
export class Collection<RECORDS extends ICollectionTypes, NAME extends keyof RECORDS, T extends IRecord = RECORDS[NAME]> {
    constructor(private readonly db: ChunkDB<RECORDS>,
                public readonly name: NAME,
                public readonly config: CollectionConfig<T>) {
    }

    public space(space: SpaceID): SpaceReader<T> {
        const delayedSpace = this.db.spaces.getDelayedSpace(space);
        const delayedRef = delayedSpace.getRef(this.config);
        return new SpaceReader<T>(this.db, delayedRef);
    }
}
