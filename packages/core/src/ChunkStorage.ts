import { AbstractChunk, ChunkType } from './chunks/AbstractChunk';
import { chunkFactory } from './chunks/ChunkFactory';
import { ChunkID, SpaceID, UUID } from './common.types';
import { DBError, SpaceNotFoundError } from './errors';
import { ISpace } from './space';
import { IStorageDriver, NotFoundChunkError } from './storage.types';

export class ChunkStorage {
    private chunks = new Map<ChunkID, AbstractChunk>();
    private spaces = new Map<SpaceID, ISpace>();

    constructor(private readonly driver: IStorageDriver) {}

    connect(): Promise<ChunkStorage> {
        if (this.driver.connect) {
            return this.driver.connect().then(() => this);
        } else {
            return Promise.resolve(this);
        }
    }

    getExists(id: ChunkID): AbstractChunk | null {
        return this.chunks.get(id) || null;
    }

    async saveChunk(chunk: AbstractChunk): Promise<AbstractChunk> {
        this.chunks.set(chunk.id, chunk);
        await this.driver.saveChunk(chunk.toGenericChunk());
        return chunk;
    }

    saveTemporalChunk(chunk: AbstractChunk): AbstractChunk {
        this.chunks.set(chunk.id, chunk);
        return chunk;
    }

    removeTemporalChunk(id: UUID): boolean {
        const chunk = this.chunks.get(id);
        if (!chunk)
            return true;

        if (chunk.type !== ChunkType.TemporaryTransaction)
            return false;

        this.chunks.delete(id);
        return true;
    }

    async loadChunk(id: ChunkID): Promise<AbstractChunk> {
        if (!id)
            throw new NotFoundChunkError(id);
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

    async loadSpace(id: SpaceID): Promise<ISpace> {
        const space = await this.driver.loadSpace(id);
        if (!space)
            throw new SpaceNotFoundError(id);
        return space;
    }
}
