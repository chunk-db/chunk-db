import { ICollectionTypes, SpaceID } from './common.types';
import { ChunkDB } from './ChunkDB';
import { ISpace, Refs, Space } from './space';
import { SpaceReader } from './space-reader';
import { Collection } from './collection';

/**
 * Представляет собой доступ к данным пространства и методам работы с ними
 */
export class DataSpace<RECORDS extends ICollectionTypes> implements ISpace {
    constructor(private readonly db: ChunkDB<RECORDS>,
                public readonly spaceId: SpaceID) {
    }

    public collection<NAME extends keyof RECORDS>(name: NAME): SpaceReader<RECORDS[NAME]> {
        if (!(name in this.db.collections))
            throw new Error(`Invalid collection "${name}"`);

        const collection: Collection<RECORDS, NAME, RECORDS[NAME]> = this.db.collections[name];
        return collection.space(this.spaceId);
    }

    get space(): Space | undefined {
        return this.db.spaces.getLoaded(this.spaceId);
    }

    get description(): string {
        return this.space?.description || '';
    };

    get id(): SpaceID {
        return this.spaceId;
    };

    get name(): string {
        return this.space?.name || '';
    };

    get refs(): Refs<any> {
        return this.space?.refs || {};
    };
}
