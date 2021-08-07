import { ChunkDB } from './ChunkDB';
import { Model } from './Model';
import { Collection } from './collection';
import { ChunkID, makeChunkID, SpaceID } from './common.types';
import { ISpace, Space } from './space';
import { SpaceReader } from './space-reader';

/**
 * Представляет собой доступ к данным пространства и методам работы с ними
 */
export class DataSpace implements ISpace {
    constructor(private readonly db: ChunkDB, public readonly spaceId: SpaceID) {}

    public collection<T extends Model>(scheme: T): SpaceReader<T> {
        if (!(scheme instanceof Model)) {
            throw new Error(`Scheme must be instance of Model`);
        }
        if (!(scheme.name in this.db.collections)) throw new Error(`Unregistered collection "${scheme.name}"`);

        const collection: Collection<T> = this.db.collections[scheme.name] as any;
        return collection.space(this.spaceId);
    }

    get space(): Space | undefined {
        return this.db.spaces.getLoaded(this.spaceId);
    }

    get description(): string {
        return this.space?.description || '';
    }

    get id(): SpaceID {
        return this.spaceId;
    }

    get name(): string {
        return this.space?.name || '';
    }

    get ref(): ChunkID {
        return this.space?.ref || makeChunkID('');
    }
}
