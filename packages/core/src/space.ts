import { SpaceID } from './common.types';
import { UUID } from './common.types';

export type Refs = {
    [key: string]: UUID;
}

export interface ISpace {
    id: SpaceID;
    name: string;
    description?: string;
    refs: Refs;
}

export class Space {
    public readonly id: SpaceID;
    public name: string;
    public description: string;
    public refs: Refs;

    constructor(config: ISpace) {
        this.id = config.id;
        this.name = config.name;
        this.description = config.description || '';
        this.refs = config.refs;
    }
}

