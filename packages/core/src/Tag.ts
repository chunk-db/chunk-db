import { IRecord } from './record.types';
import { ChunkDB } from './ChunkDB';
import { findAll } from './scenarios/findAll';

export class Tag<T extends IRecord = IRecord> {
    constructor(private readonly db: ChunkDB,
                public readonly name: string) {
    }

    findAll(): Promise<T[]> {
        return this.db.run(findAll, 'a1') as any;
    }
}
