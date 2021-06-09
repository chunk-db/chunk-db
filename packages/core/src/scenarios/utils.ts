import { AbstractChunk } from '../chunks';
import { ChunkID, UUID } from '../common.types';
import { DelayedRef } from '../delayed-ref';
import { IRecord } from '../record.types';
import { Refs, Space } from '../space';
import { NotFoundChunkError } from '../storage.types';

import { ScenarioContext } from './scenario.types';

export function resolveRelayedRef<T extends IRecord>(this: ScenarioContext, delayedRef: DelayedRef<T>): Promise<UUID> {
    return delayedRef();
}

export async function getChunk(this: ScenarioContext, chunkID: ChunkID): Promise<AbstractChunk> {
    const chunk = await this.storage.loadChunk(chunkID);
    if (!chunk)
        throw new NotFoundChunkError(chunkID);
    return chunk;
}

export async function updateSpaceRefs(this: ScenarioContext, spaceID: UUID, refs: Refs): Promise<void> {
    this.updateSpaceRefs(spaceID, refs);
}

export async function getSpace(this: ScenarioContext, spaceID: UUID): Promise<Space> {
    const space = this.spaces.getLoaded(spaceID);
    if (space)
        return space;
    throw new Error(`Space "${spaceID}" not defined`);
}
