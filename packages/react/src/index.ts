import { AbstractChunk, ChunkDB, DataSpace, Query, Space, SpaceID } from '@chunk-db/core';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type QueryResult<T> = [T, boolean]; // FIXME: [result: T, loading: boolean];

export function useForceReload() {
    const [, updateState] = useState<any>();
    return useCallback(() => updateState({}), []);
}

export const ChunkDBContext = createContext<ChunkDB>(null as any);

export const ChunkDBProvider = ChunkDBContext.Provider;

export function useChunkDB(): ChunkDB {
    return useContext(ChunkDBContext);
}

export function useSpace(spaceID: SpaceID): DataSpace | undefined {
    const db = useChunkDB();
    const [space, setSpace] = useState<DataSpace | undefined>(undefined);

    useEffect(() => {
        if (!db || !spaceID) return;
        setSpace(new DataSpace(db, spaceID));
        return db.spaces.subscribe(spaceID, () => setSpace(new DataSpace(db, spaceID)));
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

export function useQueryAll<T = any, PARAMS extends any[] = any[]>(
    spaceID: SpaceID,
    queryBuilder: (space: DataSpace, ...params: PARAMS) => Query | Promise<any>,
    defaultValue: any = null,
    ...params: PARAMS
): QueryResult<T[]> {
    const [result, setResult] = useState<QueryResult<any[]>>([defaultValue, true]);

    const db = useChunkDB();
    const space = useSpace(spaceID);

    useEffect(() => {
        if (!space || !db.ready) return;
        const query = queryBuilder(space, ...params);
        if (query instanceof Query)
            query
                .exec()
                .all()
                .then(list => setResult([list, false]));
        else query.then(res => setResult([res, false]));
    }, [space, space?.ref, ...params]);

    return result;
}
