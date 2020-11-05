import { IChunkStorageDriver, NotFoundChunkError } from './storage.types';
import { IGenericChunk } from './chunks/ChunkFactory';
import { ChunkID } from './common';

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

    setChunks(chunks: IGenericChunk[]): void {
        chunks.forEach(chunk => this.set(chunk));
    }

    clear(): void {
        this.chunks.clear();
    }

    reset(chunks: IGenericChunk[]): void {
        this.clear();
        this.setChunks(chunks);
    }
}
