import { ICollectionTypes, SpaceID } from './common.types';
import { UUID } from './common.types';

export type Refs<RECORDS extends ICollectionTypes = any> = {
    [NAME in keyof RECORDS]: UUID;
}

export interface ISpace<RECORDS extends ICollectionTypes = any> {
    id: SpaceID;
    name: string;
    description?: string;
    refs: Refs<RECORDS>;
}

export class Space<RECORDS extends ICollectionTypes = any> {
    public readonly id: SpaceID;
    public name: string;
    public description: string;
    public refs: Refs<RECORDS>;

    constructor(config: ISpace<RECORDS>) {
        this.id = config.id;
        this.name = config.name;
        this.description = config.description || '';
        this.refs = config.refs;
    }
}

