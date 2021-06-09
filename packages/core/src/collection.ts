import { ChunkDB } from './ChunkDB';
import { Model } from './Model';
import { SpaceID } from './common.types';
import { IRecord } from './record.types';
import { SpaceReader } from './space-reader';

/**
 * Представляет собой доступ к настройкам и данным коллекции
 */
export class Collection<T extends IRecord> {
    constructor(private readonly db: ChunkDB,
                public readonly model: Model<T>) {
    }

    public space(space: SpaceID): SpaceReader<T> {
        const delayedSpace = this.db.spaces.getDelayedSpace(space);
        const delayedRef = delayedSpace.getRef(this.model);
        return new SpaceReader(this.db, this.model, delayedRef);
    }
}
