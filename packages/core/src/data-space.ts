import { ChunkDB } from './ChunkDB';
import { Collection } from './collection';
import { SpaceID } from './common.types';
import { ISpace, Refs, Space } from './space';
import { SpaceReader } from './space-reader';
import { IRecord } from './record.types';
import { Model } from './Model';

/**
 * Представляет собой доступ к данным пространства и методам работы с ними
 */
export class DataSpace implements ISpace {
    constructor(private readonly db: ChunkDB,
                public readonly spaceId: SpaceID) {
    }

    public collection<T extends IRecord>(scheme: Model<T>): SpaceReader<T> {
        if (!(scheme.name in this.db.collections))
            throw new Error(`Invalid collection "${name}"`);

        const collection: Collection<T> = this.db.collections[scheme.name] as any;
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

    get refs(): Refs {
        return this.space?.refs || {};
    };
}
