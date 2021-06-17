import { Model } from './Model';
import { ChunkID, SpaceID } from './common.types';
import { IRecord } from './record.types';
import { Space } from './space';
import { Spaces } from './spaces';

export class DelayedSpace {
    constructor(private readonly spaces: Spaces, public readonly spaceIDs: SpaceID[]) {}

    getSpaces(): Promise<Space[]> {
        return Promise.all(
            this.spaceIDs.map(spaceID => {
                if (this.spaces.isLoaded(spaceID)) {
                    return Promise.resolve(this.spaces.getLoaded(spaceID)!);
                } else {
                    return this.spaces.load(spaceID);
                }
            })
        );
    }

    getRefs(model: Model<any>): DelayedRefs<any> {
        // todo types
        return () => this.getSpaces().then(spaces => spaces.map(space => space.ref));
    }
}

export interface DelayedRefs<T extends IRecord = IRecord> {
    (): Promise<ChunkID[]>;
}
