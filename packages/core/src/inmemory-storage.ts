import { IChunkStorageDriver, NotFoundChunkError } from "./storage.types";
import { IGenericChunk } from "./chunks/ChunkFactory";
import { ChunkID } from "./common";

export class InMemoryChunkStorage implements IChunkStorageDriver {
    chunks = new Map<ChunkID, IGenericChunk>();

    async get(id: ChunkID): Promise<IGenericChunk> {
        if (this.chunks.has(id))
            return this.chunks.get(id)!;
        else
            throw new NotFoundChunkError(id);
    }

    async set(chunk: IGenericChunk): Promise<IGenericChunk> {
        this.chunks.set(chunk.id!, chunk);
        return chunk;
    }

    async remove(id: ChunkID): Promise<void> {
        this.chunks.delete(id);
    }
}
