import { ScenarioContext } from './scenario.types';
import { ChunkID, UUID } from '../common.types';
import { AbstractChunk } from '../chunks/AbstractChunk';
import { NotFoundChunkError } from '../storage.types';
import { Refs, Space } from '../space';

export async function getChunk(this: ScenarioContext<any>, chunkID: ChunkID): Promise<AbstractChunk> {
    const chunk = await this.storage.loadChunk(chunkID);
    if (!chunk)
        throw new NotFoundChunkError(chunkID);
    return chunk;
}

export async function updateSpaceRefs(this: ScenarioContext<any>, spaceID: UUID, refs: Refs<any>): Promise<void> {
    this.updateSpaceRefs(spaceID, refs);
}

export async function getSpace(this: ScenarioContext<any>, spaceID: UUID): Promise<Space> {
    return this.spaces.get(spaceID)!;
}