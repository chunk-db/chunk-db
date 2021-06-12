import { UUID } from '../common.types';
import { IRecord } from '../record.types';

import { IGenericChunk } from './ChunkFactory';

export function chunkDataToMap(data: {
    [collection: string]: { [key: string]: IRecord };
}): Map<string, Map<UUID, IRecord>> {
    const result = new Map<string, Map<UUID, IRecord>>();
    Object.keys(data).forEach(collection => result.set(collection, objectToMap(data[collection])));
    return result;
}

export function objectToMap<T extends IRecord = IRecord>(data: { [key: string]: T }): Map<UUID, T> {
    return new Map(Object.keys(data).map(key => [key, data[key]] as [string, T]));
}

export function objectToArray<T extends IRecord = IRecord>(data: { [key: string]: T }): T[] {
    return Object.keys(data).map(key => data[key]);
}

export function arrayToMap<T extends IRecord = IRecord>(data: T[]): Map<UUID, T> {
    return new Map(data.map((item: any) => [item._id, item] as [string, T])); // TODO
}

export function mapToArray<T extends IRecord = IRecord>(map?: ReadonlyMap<UUID, T>): T[] {
    if (!map) return [];
    return Array.from(map.values());
}

export function arrayToObject<T extends IRecord = IRecord>(data: T[]): { [key: string]: T } {
    const obj: any = {};
    data.forEach((record: any) => (obj[record._id] = record)); // TODO
    return obj;
}

export function isGenericChunk(target: any): target is IGenericChunk {
    if (typeof target !== 'object' || !target) return false;

    const { parents, data } = target;

    if (!Array.isArray(parents)) return false;

    if (typeof data !== 'object') return false;

    return true;
}

export function calculateSizes(data: ReadonlyMap<string, ReadonlyMap<UUID, any>>): {
    size: number;
    sizes: { [collection: string]: number };
} {
    let size = 0;
    const sizes: { [collection: string]: number } = {};
    data.forEach((records, collection) => {
        sizes[collection] = records.size;
        size += records.size;
    });
    return { size, sizes };
}
