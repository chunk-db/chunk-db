import { IChunkStorageDriver } from "./storage.types";
import { ChunkID } from "./common";
import { AbstractChunk } from "./chunks/AbstractChunk";
import { chunkFactory } from "./chunks/ChunkFactory";

export class ChunkStorage {
    private chunks = new Map<ChunkID, AbstractChunk>();

    constructor(private readonly driver: IChunkStorageDriver) {}

    getExists(id: ChunkID): AbstractChunk | null {
        return this.chunks.get(id) || null;
    }

    async add(chunk: AbstractChunk): Promise<AbstractChunk> {
        this.chunks.set(chunk.id, chunk);
        await this.driver.set(chunk.toGenericChunk());
        return chunk;
    }

    async load(id: ChunkID): Promise<AbstractChunk> {
        if (this.chunks.has(id))
            return this.chunks.get(id)!;

        const genericChunk = await this.driver.get(id);
        const chunk = chunkFactory(genericChunk);
        this.chunks.set(chunk.id, chunk);
        return chunk;
    }
}
