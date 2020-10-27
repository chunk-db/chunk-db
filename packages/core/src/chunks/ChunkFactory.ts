import { AbstractChunk, ChunkType } from "./AbstractChunk";
import { IRecord } from "../record.types";
import { UUID } from "../common";
import { SnapshotChunk } from "./SnapshotChunk";
import { IncrementalChunk } from "./IncrementalChunk";

export interface IGenericChunk<T extends IRecord = IRecord> {
    id?: UUID;
    type: ChunkType;
    parents: UUID[];
    records: { [id: string]: T };
}

export function chunkFactory(data: unknown): AbstractChunk {
    if (!isGenericChunk(data))
        throw new Error("Invalid chunk");
    switch (data.type) {
        case ChunkType.Snapshot:
            return new SnapshotChunk(data);
        case ChunkType.Incremental:
            return new IncrementalChunk(data);
        default:
            throw new Error("Invalid or unsupported chunk data");
    }
}

export function isGenericChunk(data: any): data is IGenericChunk {
    if (typeof data !== "object" || !data)
        return false;

    const { parents, records } = data;

    if (!Array.isArray(parents))
        return false;

    if (typeof records !== "object")
        return false;

    return true;
}
