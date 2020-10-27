import { IRecord } from "./record.types";
import { IChunkStorageDriver } from "./storage.types";
import { ChunkID } from "./common";

export interface IChunkDBConfig {
    storage: IChunkStorageDriver;

    collections: { [key: string]: ICollectionConfig }
}

export interface ICollectionConfig<T extends IRecord = IRecord> {
    indexedFields: (keyof T)[];
}

export interface IRefCollection {
    branches: { [name: string]: ChunkID },
    tags: { [name: string]: ChunkID },
}
