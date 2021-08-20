import 'regenerator-runtime/runtime';
import { buildConditionQuery, ConditionValidator, IQuery } from '../ConditionValidator';
import { Model } from '../Model';
import { AbstractChunk, ChunkType } from '../chunks';
import { ChunkID, UUID } from '../common.types';
import { IRecord } from '../record.types';

import { FindScenario } from './find.types';
import { call } from './scenario.types';
import { getChunks } from './utils';

export function* findBruteForce<T extends IRecord = IRecord>(
    refs: ChunkID[],
    model: Model<T>,
    query: IQuery = {}
): FindScenario<T> {
    const allFound = new Map<UUID, T | null>();
    const builtQuery = buildConditionQuery(query);
    let chunks: AbstractChunk[];

    const chunkIDs = refs.filter(item => !!item);

    if (!chunkIDs.length)
        return {
            chunkIDs,
        };

    const isNew = isNewFactory(allFound, builtQuery);

    while (true) {
        chunks = yield call(getChunks, chunkIDs);
        const nextChunkIDs: ChunkID[] = [];

        const records = new Map<UUID, T>();
        chunks.forEach(chunk => {
            const data: ReadonlyMap<UUID, T> | undefined = chunk.data.get(model.name) as any;
            if (data) {
                data.forEach((record, key) => isNew(record) && records.set(key, record));
            }

            switch (chunk.type) {
                case ChunkType.Snapshot:
                    // nothing to do in this chain
                    break;
                case ChunkType.TemporaryTransaction:
                case ChunkType.Incremental:
                    nextChunkIDs.push(...chunk.parents);
                    break;
                default:
                    throw new Error(`Unsupported chunk type "${chunk.type}"`);
            }
        });

        if (nextChunkIDs.length) {
            yield {
                chunkIDs,
                records,
            };
            chunkIDs = nextChunkIDs;
        } else {
            return {
                chunkIDs,
                records,
            };
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
