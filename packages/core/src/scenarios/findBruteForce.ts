import 'regenerator-runtime/runtime';
import { buildQuery, ConditionValidator, IQuery } from '../ConditionValidator';
import { AbstractChunk, ChunkType } from '../chunks/AbstractChunk';
import { mapToArray } from '../chunks/utils';
import { ChunkID, UUID } from '../common.types';
import { IRecord } from '../record.types';
import { NotFoundChunkError } from '../storage.types';

import { FindScenario } from './find.types';
import { call } from './scenario.types';
import { getChunk, resolveRelayedRef } from './utils';
import { DelayedRef } from '../delayed-ref';

export function* findBruteForce<T extends IRecord = IRecord>(delayedRef: DelayedRef<T>, query: IQuery = {}): FindScenario<T> {
    const map = new Map<UUID, IRecord>();
    const builtQuery = buildQuery(query);
    let chunk: AbstractChunk;

    const headChunkID: ChunkID = yield call(resolveRelayedRef, delayedRef);
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
                };
            case ChunkType.TemporaryTransaction:
            case ChunkType.Incremental:
                yield {
                    chunkID,
                    records,
                };
                chunkID = chunk.parents[0];
                break;
            default:
                throw new Error(`Unsupported chunk type "${chunk.type}"`);
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
