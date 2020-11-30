import { IGenericChunk } from './chunks/ChunkFactory';
import { ChunkID, SpaceID } from './common.types';
import { DBError } from './errors';
import { ISpace, Refs } from './space';
import { IStorageCacheDriver, NotFoundChunkError } from './storage.types';

export class InMemoryChunkStorage implements IStorageCacheDriver {
    chunks = new Map<ChunkID, IGenericChunk>();
    spaces = new Map<SpaceID, ISpace>();

    // chunks
    async loadChunk(id: ChunkID): Promise<IGenericChunk> {
        if (this.chunks.has(id))
            return this.chunks.get(id)!;
        else
            throw new NotFoundChunkError(id);
    }

    async saveChunk(chunk: IGenericChunk): Promise<IGenericChunk> {
        this.chunks.set(chunk.id!, chunk);
        return chunk;
    }

    async markDraftChunkAsUnused(id: ChunkID): Promise<void> {
        this.chunks.delete(id);
    }

    setChunks(chunks: IGenericChunk[]): void {
        chunks.forEach(chunk => this.chunks.set(chunk.id!, chunk));
    }

    async clearChunks(): Promise<void> {
        this.chunks.clear();
    }

    reset(chunks: IGenericChunk[]): void {
        this.chunks.clear();
        this.setChunks(chunks);
    }

    async removeChunk(id: ChunkID): Promise<void> {
        this.chunks.delete(id);
    }

    // spaces
    async createSpace<T extends ISpace>(space: T): Promise<T> {
        if (this.spaces.has(space.id!))
            throw new DBError(`Can not create space "${space.id}": already exists`);
        this.spaces.set(space.id, space);
        return space;
    }

    async loadSpace(id: SpaceID): Promise<ISpace | undefined> {
        return this.spaces.get(id);
    }

    async saveSpace(space: ISpace): Promise<ISpace> {
        this.spaces.set(space.id, space);
        return space;
    }

    async updateSpace(id: SpaceID, refs: Refs): Promise<ISpace> {
        const space = this.spaces.get(id);
        if (!space)
            throw new DBError(`Can not update space "${id}": not exists`);
        this.spaces.set(id, {
            ...space,
            refs,
        });
        return space;
    }

    async clearSpaces(): Promise<void> {
        this.spaces.clear();
    }

    async getAllSpaces(): Promise<ISpace[]> {
        return [...this.spaces.values()];
    }
}