import { IRecord } from "../record.types";
import { AbstractChunk, ChunkType } from "./AbstractChunk";

export class UpdateChunk<T extends IRecord = IRecord> extends AbstractChunk<T> {
    public readonly type = ChunkType.Update;
}
