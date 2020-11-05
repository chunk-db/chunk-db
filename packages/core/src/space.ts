import { ICollectionTypes } from './db.types';
import { UUID } from './common';

export interface ISpace<RECORDS extends ICollectionTypes = any> {
    id: UUID;
    name: string;
    description?: string;
    refs: {
        [NAME in keyof RECORDS]: UUID;
    };
}

export class Space<RECORDS extends ICollectionTypes = any> {
    public readonly id: UUID;
    public name: string;
    public description: string;
    public refs: { [NAME in keyof RECORDS]: UUID };

    constructor(config: ISpace<RECORDS>) {
        this.id = config.id;
        this.name = config.name;
        this.description = config.description || '';
        this.refs = config.refs;
    }
}

