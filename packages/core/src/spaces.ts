import { ChunkStorage } from './ChunkStorage';
import { ISpace, Refs, Space } from './space';
import { ICollectionTypes, SpaceID, Subscription } from './common.types';
import { makeSubscription } from './common';
import { v4 } from 'uuid';
import { SpaceNotFoundError } from './errors';

/**
 *
 */
export class Spaces<RECORDS extends ICollectionTypes = any> {
    private spaces: Map<SpaceID, Space<RECORDS>> = new Map();
    private spaceSubscriptions = new Map<SpaceID, Array<() => void>>();

    constructor(public readonly storage: ChunkStorage) {}

    create(meta: Partial<ISpace>): Space<RECORDS> {
        const space = new Space<RECORDS>({
            id: meta.id || v4(),
            name: meta.name || 'some name',
            description: meta.description,
            refs: meta.refs || {},
        });
        this.spaces.set(space.id, space);
        return space;
    }

    isLoaded(id: string): boolean {
        return this.spaces.has(id);
    }

    getLoaded(id: string): Space<RECORDS> {
        const space = this.spaces.get(id);
        if (!space)
            throw new SpaceNotFoundError(id);
        return space;
    }

    load(id: string): Promise<Space<RECORDS>> {
        return this.storage.loadSpace(id)
                   .then(data => {
                       const space = new Space(data);
                       this.spaces.set(space.id, space);
                       return space;
                   });
    }

    save(id: string): Promise<Space<RECORDS>> {
        const exists = this.spaces.get(id);
        if (!exists)
            throw new SpaceNotFoundError(id);

        return this.storage.saveSpace(exists)
                   .then(() => exists);
    }

    remove(id: string): Promise<void> {
        throw new Error('not implemented');
    }

    async updateSpaceRefs(id: SpaceID, refs: Refs<RECORDS>): Promise<void> {
        const exists = this.spaces.get(id);
        if (!exists)
            throw new Error(`Space "id" not loaded`);

        this.spaces.set(id, {
            ...exists,
            refs,
        });
        await this.storage.saveSpace(this.spaces.get(id) as ISpace);
        const subscribers = this.spaceSubscriptions.get(id);
        if (subscribers)
            subscribers.forEach(cb => cb());
    }

    /**
     * Subscribe for any changes on space
     *
     * @param cb Callback
     */
    public subscribe(spaceID: SpaceID, cb: () => void): Subscription {
        const list: Array<() => void> = this.spaceSubscriptions.get(spaceID) || [];

        list.push(cb!);

        this.spaceSubscriptions.set(spaceID, list);
        return makeSubscription(() => this.spaceSubscriptions.set(spaceID, list.filter(item => item !== cb)));
    }
}
