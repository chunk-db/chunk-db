import { IRecord } from './record.types';

type IndexType = 'auto';

type IIndexConfiguration<T extends IRecord> = {
    [key in keyof Partial<T>]: IndexType;
};

interface IModel<T extends IRecord> {
    uuid: keyof T;
    sid?: keyof T;
    factory: (data: any) => T;
    indexes: IIndexConfiguration<T>;
    defaults?: {
        [key in keyof T]?: T[key];
    };
}

export type TypeOfModel<T> = T extends Model<infer R> ? R : never;

export class Model<T extends IRecord> {
    public readonly name: string;
    public readonly uuid: keyof T;
    public readonly sid: null | keyof T;
    public readonly factory: (data: any) => T;
    public readonly indexes: IIndexConfiguration<T>;
    public readonly defaults: {
        [key in keyof T]?: T[key];
    };

    constructor(name: string, scheme: IModel<T>) {
        this.name = name;
        this.uuid = scheme.uuid;
        this.sid = scheme.sid || null;
        this.indexes = scheme.indexes;
        this.defaults = scheme.defaults || {};
        this.factory = scheme.factory;
    }
}
