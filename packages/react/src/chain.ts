import { AbstractChunk, SpaceID } from '@chunk-db/core';
import { useEffect, useState } from 'react';

import { useChunkDB } from './context';
import { useSpace } from './space';

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
