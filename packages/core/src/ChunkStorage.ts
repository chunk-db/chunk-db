import { AbstractChunk, chunkFactory, ChunkType } from './chunks';
import { ChunkID, makeSpaceID, SpaceID } from './common.types';
import { SpaceNotFoundError } from './errors';
import { ISpace, Space } from './space';
import { IStorageDriver, NotFoundChunkError } from './storage.types';

export class ChunkStorage {
    private chunks = new Map<ChunkID, AbstractChunk | Promise<any>>();
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
        const chunk = this.chunks.get(id);
        if (!chunk)
            return null;
        if ('then' in chunk)
            return null;
        return chunk;
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

    removeTemporalChunk(id: ChunkID): boolean {
        const chunk = this.chunks.get(id);
        if (!chunk || 'then' in chunk)
            return true;

        if (chunk.type !== ChunkType.TemporaryTransaction)
            return false;

        this.chunks.delete(id);
        return true;
    }

    async loadChunk(id: ChunkID): Promise<AbstractChunk> {
        if (!id)
            throw new NotFoundChunkError(id);
        const existsChunk = this.chunks.get(id);
        if (existsChunk) {
            if ('then' in existsChunk)
                return existsChunk;
            else
                return existsChunk;
        }

        const promise = this.driver
                            .loadChunk(id)
                            .then(genericChunk => {
                                const chunk = chunkFactory(genericChunk);
                                this.chunks.set(id, chunk);
                                return chunk;
                            });
        this.chunks.set(id, promise);
        return promise;
    }

    saveSpace(space: ISpace): Promise<ISpace> {
        this.spaces.set(makeSpaceID(space.id), space);
        return this.driver.saveSpace(space);
    }

    async loadSpace(id: SpaceID): Promise<ISpace> {
        const space = await this.driver.loadSpace(id);
        if (!space)
            throw new SpaceNotFoundError(id);
        return space;
    }
}
