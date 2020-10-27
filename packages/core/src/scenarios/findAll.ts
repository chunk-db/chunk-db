import { call, getChunk } from './scenario';
import { ChunkID, UUID } from '../common';
import { AbstractChunk, ChunkType } from '../chunks/AbstractChunk';
import { mapToArray } from '../chunks/utils';
import { IRecord } from '../record.types';
import { NotFoundChunkError } from '../storage.types';
import { buildQuery, IQuery, Query } from '../Query';

export function* findAll<T extends IRecord = IRecord>(headChunkID: ChunkID, query: IQuery = {}): Generator<any, T[], any> {
    const map = new Map<UUID, IRecord>();
    const builtQuery = buildQuery(query);
    let chunk: AbstractChunk;

    let chunkID = headChunkID;
    while (true) {
        chunk = yield call(getChunk, chunkID);
        if (!chunk)
            throw new NotFoundChunkError(chunkID);
        const records = mapToArray(chunk.records);

        switch (chunk.type) {
            case ChunkType.Snapshot:
                records.forEach(addNew(map, builtQuery));
                return mapToArray<T>(map as any); // TODO
                break;
            case ChunkType.Incremental:
                records.forEach(addNew(map, builtQuery));
                chunkID = chunk.parents[0];
                break;
            default:
                throw new Error(`Unsupported chunk type "${chunk.type}`);
        }
    }
}

function addNew<T extends IRecord>(map: Map<UUID, T>, filter: Query) {
    return (record: T) => {
        if (map.has(record._id))
            return;

        if (filter(record))
            map.set(record._id, record);
    };
}
