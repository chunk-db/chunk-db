import { AbstractChunk, ChunkDB, DataSpace, ICollectionTypes, Query, UUID } from '@chunk-db/core';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

export function useForceReload() {
    const [, updateState] = useState<any>();
    return useCallback(() => updateState({}), []);
}

export const ChunkDBContext = createContext<ChunkDB<any>>(null as any);

export const ChunkDBProvider = ChunkDBContext.Provider;

export function useChunkDB<RECORDS extends ICollectionTypes = any>(): ChunkDB<RECORDS> {
    return useContext(ChunkDBContext);
}

export function useSpace<RECORDS extends ICollectionTypes = any>(spaceID: UUID): DataSpace<RECORDS> {
    const db = useChunkDB();
    const [space, setSpace] = useState<DataSpace<RECORDS>>(db && new DataSpace(db, spaceID));
    useEffect(() => {
        console.log('useSpace effect', db, spaceID);
        if (!db)
            return;
        return db.spaces.subscribe(spaceID, () => setSpace(new DataSpace(db, spaceID)));
    }, [db, spaceID]);

    return space;
}

export function useFlatChain(spaceID: UUID, collection: string, maxDepth?: number): Array<AbstractChunk> {
    const [chain, setChain] = useState<Array<AbstractChunk>>([]);
    const db = useChunkDB();
    const space = useSpace(spaceID);
    useEffect(() => {
        if (!db.ready) return;
        db.getFlatChain(space.refs[collection], maxDepth)
          .then(list => setChain(list));
    }, [db, space, collection, maxDepth]);

    return chain;
}

export function useQueryAll<PARAMS extends any[]>(spaceID: UUID, queryBuilder: (space: DataSpace<any>, ...params: PARAMS) => Query | Promise<any>, ...params: PARAMS): any[] {
    const [list, setList] = useState<any[]>([]);

    const db = useChunkDB();
    const space = useSpace(spaceID);

    useEffect(() => {
        if (!db.ready) return;
        const query = queryBuilder(space, ...params);
        if (query instanceof Query)
            query.exec().all().then(setList);
        else
            query.then(setList);
    }, [space, ...params]);

    return list;
}
