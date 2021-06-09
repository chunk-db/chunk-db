import { ChunkID, makeSpaceID, SpaceID, UUID } from './common.types';

export type Refs = {
    [key: string]: ChunkID;
}

export interface ISpace {
    id: string;
    name: string;
    description?: string;
    refs: { [key: string]: UUID; };
}

export class Space {
    public readonly id: SpaceID;
    public name: string;
    public description: string;
    public refs: Refs;

    constructor(config: ISpace) {
        this.id = makeSpaceID(config.id);
        this.name = config.name;
        this.description = config.description || '';
        this.refs = (config.refs || {})as any;
    }
}

