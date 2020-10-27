import { Tag } from './Tag';
import { IRecord } from './record.types';

interface ReadOnlyCollection<T extends IRecord = IRecord> {
    name: string;

    findAll(): ReadonlyMap<string, T>
}

export class Branch extends Tag {
    collection<T extends IRecord = IRecord>(name: string): ReadOnlyCollection<T> {
        return {
            name,
            findAll: () => new Map(),
        };
    };
}
