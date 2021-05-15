import { Spaces } from './spaces';
import {
    ChunkID,
    CollectionConfig,
    ICollectionTypes,
    SpaceID,
    UUID,
} from './common.types';
import { IRecord } from './record.types';
import { Space } from './space';

export class DelayedSpace<RECORDS extends ICollectionTypes> {
    constructor(private readonly spaces: Spaces,
                public readonly spaceID: SpaceID,
    ) {
    }

    getRefs(): Promise<Space<RECORDS>> {
        return this.spaces.load(this.spaceID);
    }

    getRef(config: CollectionConfig<any>): DelayedRef<any> { // todo types
        return () => this.spaces.load(this.spaceID)
                         .then(space => space.refs[config.name]);
    }
}

export interface DelayedRef<T extends IRecord = IRecord> {
    (): Promise<ChunkID>;
}
