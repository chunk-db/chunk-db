import { ChunkID } from './common';
import { IRecord } from './record.types';
import { IChunkStorageDriver } from './storage.types';

export type CollectionType<T> = T extends ICollectionConfig<infer R> ? R : never;

export interface ICollectionTypes {
    [key: string]: IRecord;
}

export interface IChunkDBConfig<T extends { [key: string]: IRecord }> {
    storage: IChunkStorageDriver;

    collections: { [key in keyof T]: ICollectionConfig<T[key]> };
}

interface Type<T> {
    new(data: any): T;
}

export enum Priority {
    Low = 1,
    Normal,
    High,
}

interface IBaseCollectionConfig<T extends IRecord = IRecord> {
    indexedFields?: (keyof T)[];
    priority?: Priority;
}

interface IFactoryCollectionConfig<T extends IRecord = IRecord> extends IBaseCollectionConfig<T> {
    factory?: (data: any) => T;
}

interface IClassCollectionConfig<T extends IRecord = IRecord> extends IBaseCollectionConfig<T> {
    constructor?: Type<T>;
}

export type ICollectionConfig<T extends IRecord = IRecord> =
    IFactoryCollectionConfig<T> | IClassCollectionConfig<T>;

export class CollectionConfig<T extends IRecord = IRecord> {
    indexedFields: (keyof T)[] = [];
    priority: Priority = Priority.Normal;
    factory: (data: any) => T;

    constructor(public readonly name: string, config: ICollectionConfig<T>) {
        this.indexedFields = config.indexedFields || this.indexedFields;
        this.priority = config.priority || this.priority;
        if ('factory' in config)
            this.factory = config.factory!;
        else if ('constructor' in config)
            this.factory = data => new (config.constructor as Type<T>)(data);
        else throw new Error('Invalid collection config');
    }
}

export interface IRefCollection {
    branches: { [name: string]: ChunkID },
    tags: { [name: string]: ChunkID },
}
