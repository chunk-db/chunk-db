import { v4 } from 'uuid';

import { ChunkStorage } from './ChunkStorage';
import { makeSubscription } from './common';
import { ChunkID, makeSpaceID, SpaceID, Subscription } from './common.types';
import { DelayedSpace } from './delayed-ref';
import { SpaceNotFoundError } from './errors';
import { ISpace, Space } from './space';

/**
 *
 */
export class Spaces {
    public readonly spaces: Map<SpaceID, Space> = new Map();
    private subscriptions: Array<() => void> = [];
    private spaceSubscriptions = new Map<SpaceID, Array<() => void>>();

    constructor(public readonly storage: ChunkStorage) {}

    create(meta: Partial<ISpace>): Space {
        const space = new Space({
            id: meta.id || makeSpaceID(v4()),
            name: meta.name || 'some name',
            description: meta.description,
            ref: meta.ref || '',
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

    getAllLoaded(): Space[] {
        return Array.from(this.spaces.values());
    }

    getDelayedSpaces(spaceIds: SpaceID[]): DelayedSpace {
        return new DelayedSpace(this, spaceIds);
    }

    getList(): Readonly<Space>[] {
        return Array.from(this.spaces.values());
    }

    refresh(): Promise<Space[]> {
        return this.storage.loadAllSpaces().then(spaces => {
            this.spaces = new Map(
                spaces.map(data => {
                    const space = new Space(data);
                    return [space.id, space];
                })
            );

            this.subscriptions.forEach(cb => cb());
            return Array.from(this.spaces.values()).map(space => {
                const subscriptions = this.spaceSubscriptions.get(space.id);
                if (subscriptions) subscriptions.forEach(cb => cb());
                return space;
            });
        });
    }

    load(id: SpaceID): Promise<Space> {
        return this.storage.loadSpace(id).then(data => {
            const space = new Space(data);
            this.spaces.set(space.id, space);
            const subscriptions = this.spaceSubscriptions.get(space.id);
            if (subscriptions) subscriptions.forEach(cb => cb());
            this.subscriptions.forEach(cb => cb());
            return space;
        });
    }

    save(id: SpaceID): Promise<Space> {
        const exists = this.spaces.get(id);
        if (!exists) throw new SpaceNotFoundError(id);

        const subscriptions = this.spaceSubscriptions.get(id);
        if (subscriptions) subscriptions.forEach(cb => cb());
        this.subscriptions.forEach(cb => cb());

        return this.storage.saveSpace(exists).then(() => exists);
    }

    delete(id: SpaceID): Promise<void> {
        const exists = this.spaces.get(id);
        if (!exists) throw new SpaceNotFoundError(id);

        return this.storage.deleteSpace(exists.id).then(() => {
            this.spaces.delete(exists.id);

            this.spaceSubscriptions.delete(id);
            this.subscriptions.forEach(cb => cb());
        });
    }

    async updateSpaceRef(id: SpaceID, ref: ChunkID): Promise<void> {
        const exists = this.spaces.get(id);
        if (!exists) throw new Error(`Space "${id}" not loaded`);

        this.spaces.set(id, {
            ...exists,
            ref,
        });
        await this.storage.saveSpace(this.spaces.get(id) as ISpace);
        const subscribers = this.spaceSubscriptions.get(id);
        if (subscribers) subscribers.forEach(cb => cb());
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
                this.spaceSubscriptions.set(
                    spaceID,
                    list.filter(item => item !== cb)
                );
            });
        }
    }
}
