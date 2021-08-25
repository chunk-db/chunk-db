import { useContext, useEffect, useState } from 'react';
import { ChunkDBContext } from './index';

export function useChunkDB(): ChunkDB {
    return useContext(ChunkDBContext);
}

export function useFlatChain(spaceID: SpaceID, collection: string, maxDepth?: number): Array<AbstractChunk> {
    const [chain, setChain] = useState<Array<AbstractChunk>>([]);
    const db = useChunkDB();
    const space = useSpace(spaceID);
    useEffect(() => {
        if (!space || !db.ready) return;
        db.getFlatChain(space.ref, maxDepth).then(list => setChain(list));
    }, [db, space, collection, maxDepth]);

    return chain;
}
