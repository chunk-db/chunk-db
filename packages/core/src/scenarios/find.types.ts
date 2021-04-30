import { ChunkID } from '../common.types';
import { IRecord } from '../record.types';

export interface IFindResult<T extends IRecord = IRecord> {
    chunkID: ChunkID;
    records: T[];
}

export type FindScenario<T extends IRecord = IRecord> = Generator<any, IFindResult<T>, any>;
