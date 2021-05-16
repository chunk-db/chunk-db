import { ChunkDB, SpaceID } from '@chunk-db/core';
import {
    useChunkDB,
    useFlatChain,
    useForceReload,
    useSpace,
} from '@chunk-db/react';
import React from 'react';

interface IProps {
    db?: ChunkDB<any>
}

const spaceID = 'space' as SpaceID;

export const DevToolsUI = ({ db }: IProps) => {
    db = db || useChunkDB();
    const forceReload = useForceReload();
    const chain = useFlatChain(spaceID, 'todos', Infinity);
    const space = useSpace(spaceID);

    if (!db)
        return (
            <div>not ready</div>
        );
    const chunksCount = db.storage['chunks'].size;

    return (
        <div>
            <h2>Dev tools</h2>
            <p>space id: {space?.id}</p>
            <p>ref (todos): {space?.refs?.todos}</p>
            <p>chunks in storage: {chunksCount}</p>
            <ol>
                {chain.map(chunk => (
                    <li key={chunk.id}>{chunk.id} ({chunk.type})
                        [{chunk.records.size}]</li>
                ))}
            </ol>
            <button onClick={forceReload}>Update</button>
        </div>
    );
};
