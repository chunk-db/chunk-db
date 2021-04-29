import { ChunkDB, SpaceID } from '@chunk-db/core';
import { AbstractChunk } from '@chunk-db/core/dist/chunks/AbstractChunk';
import { createContext, useContext, useEffect, useState } from 'react';

export const ChunkDBContext = createContext<ChunkDB<any>>(null);

export const ChunkDBProvider = ChunkDBContext.Provider;

export function useSpaceHead(spaceID: SpaceID, collection: string): AbstractChunk {
    const db = useContext(ChunkDBContext);

    const [_, setIndex] = useState<number>(0);

    useEffect(() => {
        db.subscribe(spaceID, () => setIndex(Math.random()));
    }, []);

    const space = db.spaces.get(spaceID);
    if (!space)
        return null;
    const chunkID = space.refs[collection];
    const chunk = db.storage.getExists(chunkID);
    if (!chunk)
        db.storage.loadChunk(chunkID).then(() => setIndex(Math.random()));
    return chunk;
}

export function useChunkChain(spaceID: SpaceID, collection: string, length = 5): AbstractChunk[] {
    const db = useContext(ChunkDBContext);

    const [_, setIndex] = useState<number>(0);

    const chain: AbstractChunk[] = [];

    const space = db.spaces.get(spaceID);
    if (!space)
        return null;
    let chunkID = space.refs[collection];

    for (; chain.length < length;) {
        const chunk = db.storage.getExists(chunkID);
        if (!chunk)
            break;
        chunkID = chunk.parents[0];
        chain.push(chunk);
    }

    return chain;
}
