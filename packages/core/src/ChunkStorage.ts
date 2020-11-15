import { IStorageDriver } from './storage.types';
import { AbstractChunk } from './chunks/AbstractChunk';
import { chunkFactory } from './chunks/ChunkFactory';
import { ChunkID, SpaceID, UUID } from './common.types';
import { ISpace, Refs, Space } from './space';

export class ChunkStorage {
    private chunks = new Map<ChunkID, AbstractChunk>();
    private spaces = new Map<SpaceID, ISpace>();

    constructor(private readonly driver: IStorageDriver) {}

    getExists(id: ChunkID): AbstractChunk | null {
        return this.chunks.get(id) || null;
    }

    async saveChunk(chunk: AbstractChunk): Promise<AbstractChunk> {
        this.chunks.set(chunk.id, chunk);
        await this.driver.saveChunk(chunk.toGenericChunk());
        return chunk;
    }

    async loadChunk(id: ChunkID): Promise<AbstractChunk> {
        if (this.chunks.has(id))
            return this.chunks.get(id)!;

        const genericChunk = await this.driver.loadChunk(id);
        const chunk = chunkFactory(genericChunk);
        this.chunks.set(chunk.id, chunk);
        return chunk;
    }

    saveSpace(space: ISpace): Promise<ISpace> {
        this.spaces.set(space.id, space);
        return this.driver.saveSpace(space);
    }
}
