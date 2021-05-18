import { ChunkDB, SpaceID } from '@chunk-db/core';
import {
    useChunkDB,
    useFlatChain,
    useSpace,
} from '@chunk-db/react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import React from 'react';

import { ChunkList } from './ChunkList';
import { SpaceCard } from './SpaceCard';

interface IProps {
    db?: ChunkDB<any>
}

const useStyles = makeStyles({
    root: {
        marginTop: 12,
        marginBottom: 12,
    },
});

const spaceID = 'space' as SpaceID;

export const DevToolsUI = ({ db }: IProps) => {
    db = db || useChunkDB();
    const chain = useFlatChain(spaceID, 'todos', Infinity);
    const space = useSpace(spaceID);
    const classes = useStyles();

    if (!db)
        return (
            <div>not ready</div>
        );
    const chunksCount = db.storage['chunks'].size;

    return (
        <div>
            <Typography component="h1" variant="h2">Dev tools</Typography>
            <Box className={classes.root}>
                <SpaceCard space={space} />
            </Box>
            <Box className={classes.root}>
                <Alert severity="info"
                       variant="outlined">
                    Total chunks in storage: {chunksCount}
                </Alert>
            </Box>
            <Box className={classes.root}>
                <ChunkList chunks={chain} />
            </Box>
        </div>
    );
};
