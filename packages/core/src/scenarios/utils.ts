import { ScenarioContext } from './scenario.types';
import { ChunkID } from '../common';
import { AbstractChunk } from '../chunks/AbstractChunk';
import { NotFoundChunkError } from '../storage.types';

export async function getChunk(this: ScenarioContext, chunkID: ChunkID): Promise<AbstractChunk> {
    const chunk = await this.storage.load(chunkID);
    if (!chunk)
        throw new NotFoundChunkError(chunkID);
    return chunk;
}
