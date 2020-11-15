import { IRecord } from '../record.types';
import { UUID } from '../common.types';

export function objectToMap<T extends IRecord = IRecord>(data: { [key: string]: T }): ReadonlyMap<UUID, T> {
    return new Map(Object.keys(data).map(key => [key, data[key]] as [string, T]));
}

export function objectToArray<T extends IRecord = IRecord>(data: { [key: string]: T }): T[] {
    return Object.keys(data).map(key => data[key]);
}

export function arrayToMap<T extends IRecord = IRecord>(data: T[]): ReadonlyMap<UUID, T> {
    return new Map(data.map((item: IRecord) => [item._id, item] as [string, T]));
}

export function mapToArray<T extends IRecord = IRecord>(map: ReadonlyMap<UUID, T>): T[] {
    return Array.from(map.values());
}

export function arrayToObject<T extends IRecord = IRecord>(data: T[]): { [key: string]: T } {
    const obj: any = {};
    data.forEach(record => obj[record._id] = record);
    return obj;
}
