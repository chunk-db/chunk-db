import { ChunkDB } from '@chunk-db/core';
import { createContext, useContext, useEffect, useState } from 'react';

export const ChunkDBContext = createContext<ChunkDB>(null as any);

export const ChunkDBProvider = ChunkDBContext.Provider;

export function useChunkDB(): ChunkDB {
    return useContext(ChunkDBContext);
}

function calcHash(db: ChunkDB): string {
    return db.spaces.getList().reduce((acc, space) => acc + space.ref, '');
}

export function useCurrentHash(): string {
    const db = useChunkDB();
    const [hash, setHash] = useState(calcHash(db));
    console.log('hash', hash);
    useEffect(
        () =>
            db.spaces.subscribe(() => {
                console.log('update hash');
                setHash(calcHash(db));
            }),
        [db]
    );
    return hash;
}
