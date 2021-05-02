import { ICollectionTypes, SpaceID } from './common.types';
import { ChunkDB } from './ChunkDB';
import { Space } from './space';
import { SpaceReader } from './space-reader';
import { Collection } from './collection';

/**
 * Представляет собой доступ к настройкам и данным коллекции
 */
export class DataSpace<RECORDS extends ICollectionTypes> {
    constructor(private readonly db: ChunkDB<RECORDS>,
                public readonly space: Space) {
    }

    public collection<NAME extends keyof RECORDS>(name: NAME): SpaceReader<RECORDS[NAME]> {
        if (!(name in this.db.collections))
            throw new Error(`Invalid collection "${name}"`);

        const collection: Collection<RECORDS, NAME, RECORDS[NAME]> = this.db.collections[name];
        return collection.space(this.space.id);
    }
}
