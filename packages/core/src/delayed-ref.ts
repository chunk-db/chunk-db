import { Model } from './Model';
import { ChunkID, SpaceID } from './common.types';
import { IRecord } from './record.types';
import { Space } from './space';
import { Spaces } from './spaces';

export class DelayedSpace {
    constructor(private readonly spaces: Spaces, public readonly spaceID: SpaceID) {}

    getSpace(): Promise<Space> {
        if (this.spaces.isLoaded(this.spaceID)) return Promise.resolve(this.spaces.getLoaded(this.spaceID)!);

        return this.spaces.load(this.spaceID);
    }

    getRef(model: Model<any>): DelayedRef<any> {
        // todo types
        return () => this.getSpace().then(space => space.ref);
    }
}

export interface DelayedRef<T extends IRecord = IRecord> {
    (): Promise<ChunkID>;
}
