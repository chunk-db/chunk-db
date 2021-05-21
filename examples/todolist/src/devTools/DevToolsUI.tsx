import { ChunkDB, SpaceID } from '@chunk-db/core';
import {
    ChunkDBProvider,
    useChunkDB,
    useFlatChain,
    useSpace,
} from '@chunk-db/react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import React from 'react';

import { ChunkList } from './ChunkList';
import { SpaceCard } from './SpaceCard';

interface IProps {
    db?: ChunkDB<any>
}

const spaceID = 'space' as SpaceID;

export const DevToolsUI = ({ db }: IProps) => {
    db = db || useChunkDB();
    return (
        <ChunkDBProvider value={db}>
            <UI />
        </ChunkDBProvider>
    );
};

const UI = () => {
    const db = useChunkDB();
    const chain = useFlatChain(spaceID, 'todos', Infinity);
    const space = useSpace(spaceID);

    const chunksCount = db?.storage['chunks'].size || 0;

    return (
        <Box display="flex" alignItems="stretch" flexDirection="column">
            <Box m={1}>
                <Typography component="h1" variant="h2">Tech data</Typography>
            </Box>
            <Box m={1}>
                <SpaceCard space={space} />
            </Box>
            <Box m={1}>
                <Alert severity="info"
                       variant="outlined">
                    Total chunks in storage: {chunksCount}
                </Alert>
            </Box>
            <Box m={1}>
                <ChunkList chunks={chain} />
            </Box>
        </Box>
    );
};
