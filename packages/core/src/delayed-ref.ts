import { Spaces } from './spaces';
import {
    ChunkID,
    CollectionConfig,
    ICollectionTypes,
    SpaceID,
    UUID,
} from './common.types';
import { IRecord } from './record.types';
import { Refs, Space } from './space';

export class DelayedSpace<RECORDS extends ICollectionTypes> {
    constructor(private readonly spaces: Spaces,
                public readonly spaceID: SpaceID,
    ) {
    }

    getSpace(): Promise<Space<RECORDS>> {
        if (this.spaces.isLoaded(this.spaceID))
            return Promise.resolve(this.spaces.getLoaded(this.spaceID)!);

        return this.spaces.load(this.spaceID);
    }

    getRefs(): Promise<Refs> {
        return this.getSpace().then(space => space.refs);
    }

    getRef(config: CollectionConfig<any>): DelayedRef<any> { // todo types
        return () => this.getSpace().then(space => space.refs[config.name]);
    }
}

export interface DelayedRef<T extends IRecord = IRecord> {
    (): Promise<ChunkID>;
}
