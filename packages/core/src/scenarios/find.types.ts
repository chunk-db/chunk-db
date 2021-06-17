import { ChunkID, UUID } from '../common.types';
import { IRecord } from '../record.types';

export interface IFindResult<T extends IRecord = IRecord> {
    chunkIDs: ChunkID[];
    records?: ReadonlyMap<UUID, T | null>;
}

export type FindScenario<T extends IRecord = IRecord> = Generator<any, IFindResult<T>, any>;
