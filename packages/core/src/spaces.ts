import { v4 } from 'uuid';

import { ChunkStorage } from './ChunkStorage';
import { makeSubscription } from './common';
import {
    makeSpaceID,
    SpaceID,
    Subscription,
} from './common.types';
import { DelayedSpace } from './delayed-ref';
import { SpaceNotFoundError } from './errors';
import { ISpace, Refs, Space } from './space';

/**
 *
 */
export class Spaces {
    private spaces: Map<SpaceID, Space> = new Map();
    private subscriptions: Array<() => void> = [];
    private spaceSubscriptions = new Map<SpaceID, Array<() => void>>();

    constructor(public readonly storage: ChunkStorage) {}

    create(meta: Partial<ISpace>): Space {
        const space = new Space({
            id: meta.id || makeSpaceID(v4()),
            name: meta.name || 'some name',
            description: meta.description,
            refs: meta.refs || {},
        });
        this.spaces.set(space.id, space);
        return space;
    }

    isLoaded(id: SpaceID): boolean {
        return this.spaces.has(id);
    }

    getLoaded(id: SpaceID): Space | undefined {
        return this.spaces.get(id);
    }

    getDelayedSpace(spaceId: SpaceID): DelayedSpace {
        return new DelayedSpace(this, spaceId);
    }

    getList(): Readonly<ISpace>[] {
        return Array.from(this.spaces.values());
    }

    load(id: SpaceID): Promise<Space> {
        return this.storage.loadSpace(id)
                   .then(data => {
                       const space = new Space(data);
                       this.spaces.set(space.id, space);
                       const subscriptions = this.spaceSubscriptions.get(space.id);
                       if (subscriptions)
                           subscriptions.forEach(cb => cb());
                       return space;
                   });
    }

    save(id: SpaceID): Promise<Space> {
        const exists = this.spaces.get(id);
        if (!exists)
            throw new SpaceNotFoundError(id);

        return this.storage.saveSpace(exists)
                   .then(() => exists);
    }

    remove(id: SpaceID): Promise<void> {
        throw new Error('not implemented');
    }

    async updateSpaceRefs(id: SpaceID, refs: Refs): Promise<void> {
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
     * Subscribe for any changes any spaces
     *
     * @param cb Callback
     */
    public subscribe(cb: () => void): Subscription;
    /**
     * Subscribe for any changes of chose space
     *
     * @param spaceID SpaceID
     * @param cb Callback
     */
    public subscribe(spaceID: SpaceID, cb: () => void): Subscription;
    public subscribe(spaceID: SpaceID | (() => void), cb?: () => void): Subscription {
        if (typeof spaceID === 'function') {
            const cb = spaceID;
            this.subscriptions.push(cb);
            return makeSubscription(() => {
                this.subscriptions = this.subscriptions.filter(item => item !== cb);
            });
        } else {
            const list: Array<() => void> = this.spaceSubscriptions.get(spaceID) || [];

            list.push(cb!);

            this.spaceSubscriptions.set(spaceID, list);
            return makeSubscription(() => {
                const list: Array<() => void> = this.spaceSubscriptions.get(spaceID) || [];
                this.spaceSubscriptions.set(spaceID, list.filter(item => item !== cb));
            });
        }
    }
}
