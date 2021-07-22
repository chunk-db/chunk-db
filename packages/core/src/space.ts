import { ChunkID, makeChunkID, makeSpaceID, SpaceID } from './common.types';

export type Refs = {
    [key: string]: ChunkID;
};

export interface ISpace {
    id: string;
    name: string;
    description?: string;
    ref: string;
}

export class Space {
    public readonly id: SpaceID;
    public name: string;
    public description: string;
    public ref: ChunkID;

    constructor(config: ISpace) {
        this.id = makeSpaceID(config.id);
        this.name = config.name;
        this.description = config.description || '';
        this.ref = makeChunkID(config.ref);
    }
}
