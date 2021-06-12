import { Model } from './Model';
import { Accessor } from './accessor';
import { IRecord } from './record.types';
import { IStorageCacheDriver, IStorageDriver } from './storage.types';

export type ID = string;
export type UUID = string;
export type ChunkID = { _brand: 'ChunkID' } & string;
export type SpaceID = { _brand: 'SpaceID' } & string;
export type Primitive = string | number | boolean;

export type CollectionType<T> = T extends ICollectionConfig<infer R> ? R : never;

export function makeChunkID(uuid: UUID): ChunkID {
    return uuid as any;
}

export function makeSpaceID(uuid: UUID): SpaceID {
    return uuid as any;
}

export interface ICollectionTypes {
    [key: string]: IRecord;
}

export interface IChunkDBConfig {
    storage: IStorageDriver;
    collections: Model<any>[];
    cache?: IStorageCacheDriver | null;
}

interface Type<T> {
    new (data: any): T;
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

export type ICollectionConfig<T extends IRecord = IRecord> = IFactoryCollectionConfig<T> | IClassCollectionConfig<T>;

export class CollectionConfig<T extends IRecord = IRecord> {
    indexedFields: (keyof T)[] = [];
    priority: Priority = Priority.Normal;
    factory: (data: any) => T;

    constructor(public readonly name: string, config: ICollectionConfig<T>) {
        this.indexedFields = config.indexedFields || this.indexedFields;
        this.priority = config.priority || this.priority;
        if ('factory' in config) this.factory = config.factory!;
        else if ('constructor' in config) this.factory = data => new (config.constructor as Type<T>)(data);
        else throw new Error('Invalid collection config');
    }
}

export interface IRefCollection {
    branches: { [name: string]: ChunkID };
    tags: { [name: string]: ChunkID };
}

export type Transaction = (accessor: Accessor) => Promise<any>;

export interface ITransactionConfig {
    restartOnFail: boolean; // TODO not working
}

/**
 * Object for control subscription
 */
export interface Subscription {
    /**
     * Unsubscribe this subscription
     */
    (): void;

    /**
     * Unsubscribe this subscription
     */
    unsubscribe(): void;
}
