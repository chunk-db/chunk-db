import 'regenerator-runtime/runtime';
import { buildQuery, ConditionValidator, IQuery } from '../ConditionValidator';
import { Model } from '../Model';
import { AbstractChunk, ChunkType } from '../chunks';
import { ChunkID, UUID } from '../common.types';
import { DelayedRef } from '../delayed-ref';
import { IRecord } from '../record.types';
import { NotFoundChunkError } from '../storage.types';

import { FindScenario } from './find.types';
import { call } from './scenario.types';
import { getChunk, resolveRelayedRef } from './utils';

export function* findBruteForce<T extends IRecord = IRecord>(
    delayedRef: DelayedRef<any>,
    model: Model<T>,
    query: IQuery = {}
): FindScenario<T> {
    const allFound = new Map<UUID, T | null>();
    const builtQuery = buildQuery(query);
    let chunk: AbstractChunk;

    const headChunkID: ChunkID = yield call(resolveRelayedRef, delayedRef);
    let chunkID = headChunkID;

    if (!headChunkID)
        return {
            chunkID,
        };

    const isNew = isNewFactory(allFound, builtQuery);

    while (true) {
        chunk = yield call(getChunk, chunkID);
        if (!chunk) throw new NotFoundChunkError(chunkID);

        const data: ReadonlyMap<UUID, T> | undefined = chunk.data.get(model.name) as any;
        const records = new Map<UUID, T>();
        if (data) {
            data.forEach((record, key) => isNew(record) && records.set(key, record));
        }

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

function isNewFactory<T extends IRecord>(map: Map<UUID, T | null>, filter: ConditionValidator) {
    // todo
    return (record: any) => {
        if (!record) return true;

        if (map.has(record._id)) return false;

        if (!filter(record)) return false;

        map.set(record._id, record);
        return true;
    };
}
