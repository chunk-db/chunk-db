import { ChunkDB, SpaceID } from '@chunk-db/core';
import { AbstractChunk } from '@chunk-db/core/dist/chunks';
import React, { useEffect, useState } from 'react';

interface IProps {
    db: ChunkDB<any>
}

const spaceID = 'space' as SpaceID;

export const DevToolsUI = ({db}: IProps) => {
    const [index, setIndex] = useState(0);
    const [chain, setChain] = useState<AbstractChunk[]>([]);

    const update = () => setIndex(index + 1);

    const space = db.spaces.getLoaded(spaceID);
    console.log(space);

    useEffect(() => {
        if (!space)
            return;
        db.getFlatChain(space.refs['todos'], Infinity).then(list => setChain(list));
    }, [space, index]);

    console.log('db', db);
    if (!db)
        return (
            <div>not ready</div>
        );
    const chunksCount = db.storage['chunks'].size;

    return (
        <div>
            <h2>Dev tools</h2>
            <p>space id: {space?.id}</p>
            <p>ref (todos): {space?.refs.todos}</p>
            <p>chunks in storage: {chunksCount}</p>
            <ol>
                {chain.map(chunk => (
                    <li key={chunk.id}>{chunk.id} ({chunk.type})</li>
                ))}
            </ol>
            <button onClick={update}>Update</button>
        </div>
    );
};
