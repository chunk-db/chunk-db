import { ChunkDB } from './ChunkDB';
import { SpaceID } from './common.types';
import { SpaceReader } from './space-reader';
import { Model } from './Model';
import { IRecord } from './record.types';

/**
 * Представляет собой доступ к настройкам и данным коллекции
 */
export class Collection<T extends IRecord> {
    constructor(private readonly db: ChunkDB,
                public readonly scheme: Model<T>) {
    }

    public space(space: SpaceID): SpaceReader<T> {
        const delayedSpace = this.db.spaces.getDelayedSpace(space);
        const delayedRef = delayedSpace.getRef(this.scheme);
        return new SpaceReader(this.db, delayedRef);
    }
}
