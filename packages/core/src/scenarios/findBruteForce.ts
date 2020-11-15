import { ChunkID, UUID } from '../common.types';
import { AbstractChunk, ChunkType } from '../chunks/AbstractChunk';
import { mapToArray } from '../chunks/utils';
import { IRecord } from '../record.types';
import { NotFoundChunkError } from '../storage.types';
import { buildQuery, ConditionValidator, IQuery } from '../ConditionValidator';
import { getChunk } from './utils';
import { call } from './scenario.types';
import { FindScenario } from './find.types';

export function* findBruteForce<T extends IRecord = IRecord>(headChunkID: ChunkID, query: IQuery = {}): FindScenario<T> {
    const map = new Map<UUID, IRecord>();
    const builtQuery = buildQuery(query);
    let chunk: AbstractChunk;

    let chunkID = headChunkID;
    while (true) {
        chunk = yield call(getChunk, chunkID);
        if (!chunk)
            throw new NotFoundChunkError(chunkID);
        const records: any = mapToArray(chunk.records).filter(isNew(map, builtQuery));

        switch (chunk.type) {
            case ChunkType.Snapshot:
                return {
                    chunkID,
                    records,
                }; // TODO
                break;
            case ChunkType.TemporaryTransaction:
            case ChunkType.Incremental:
                yield {
                    chunkID,
                    records,
                };
                chunkID = chunk.parents[0];
                break;
            default:
                throw new Error(`Unsupported chunk type "${chunk.type}`);
        }
    }
}

function isNew<T extends IRecord>(map: Map<UUID, T>, filter: ConditionValidator) {
    return (record: T) => {
        if (map.has(record._id))
            return false;

        if (!filter(record))
            return false;

        map.set(record._id, record);
        return true;
    };
}
