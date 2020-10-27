import { UUID } from "../common";
import { IRecord } from "../record.types";
import { IGenericChunk } from "./ChunkFactory";
import { objectToMap } from "./utils";

export enum ChunkType {
    Unknown = "",
    Snapshot = "snapshot",
    Incremental = "incremental",
    Update = "update",
    Merge = "merge",
}

/**
 * Чанк содержит информацию об одном одновлении в одной коллекции
 */
export abstract class AbstractChunk<T extends IRecord = IRecord> {
    public readonly id: UUID = "";
    public abstract type: ChunkType;
    public readonly records: ReadonlyMap<UUID, T>;
    public readonly parents: UUID[];

    protected constructor(data: IGenericChunk) {
        this.id = data.id!;
        this.parents = data.parents;
        this.records = objectToMap(data.records) as any;
    }

    public toGenericChunk(): IGenericChunk {
        const records: { [key: string]: T } = {};
        this.records.forEach((record, id) => records[id] = record);
        return {
            id: this.id,
            type: this.type,
            parents: this.parents.slice(),
            records
        };
    }
}
