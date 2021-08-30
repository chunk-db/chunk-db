import { Space, SpaceID } from '@chunk-db/core';
import { useEffect, useState } from 'react';

import { useChunkDB } from './context';

export function useSpace(spaceID: SpaceID): Space | null {
    const db = useChunkDB();
    const [space, setSpace] = useState<Space | null>(null);

    useEffect(() => {
        if (!db || !spaceID) return;
        setSpace(db.spaces.getLoaded(spaceID));
        return db.spaces.subscribe(spaceID, () => setSpace(db.spaces.getLoaded(spaceID)));
    }, [db, spaceID]);

    return space;
}

export function useSpaces(): Space[] {
    const db = useChunkDB();
    const [spaces, setSpaces] = useState<Space[]>([]);

    useEffect(() => {
        if (!db) return;
        setSpaces(db.spaces.getList());

        return db.spaces.subscribe(() => setSpaces(db.spaces.getList()));
    }, [db]);

    return spaces;
}
