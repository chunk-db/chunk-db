import { Spaces } from './spaces';
import {
    ChunkID,
    SpaceID,
} from './common.types';
import { IRecord } from './record.types';
import { Refs, Space } from './space';
import { Model } from './Model';

export class DelayedSpace {
    constructor(private readonly spaces: Spaces,
                public readonly spaceID: SpaceID,
    ) {
    }

    getSpace(): Promise<Space> {
        if (this.spaces.isLoaded(this.spaceID))
            return Promise.resolve(this.spaces.getLoaded(this.spaceID)!);

        return this.spaces.load(this.spaceID);
    }

    getRefs(): Promise<Refs> {
        return this.getSpace().then(space => space.refs);
    }

    getRef(config: Model<any>): DelayedRef<any> { // todo types
        return () => this.getSpace().then(space => space.refs[config.name]);
    }
}

export interface DelayedRef<T extends IRecord = IRecord> {
    (): Promise<ChunkID>;
}
