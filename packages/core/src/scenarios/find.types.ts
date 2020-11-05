import { IRecord } from '../record.types';
import { ChunkID } from '../common';

export interface IFindResult<T extends IRecord = IRecord> {
    chunkID: ChunkID;
    records: T[];
}

export type FindScenario<T extends IRecord = IRecord> = Generator<any, IFindResult<T>, any>;
