import { Space } from '@chunk-db/core';
import { useChunkDB, useSpaces } from '@chunk-db/react';
import { Button, List } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

import { IList, ListID } from '../../store/store.types';

import { SpaceItem } from './components/SpaceItem';
import { AddSpaceForm } from './widgets/AddSpaceForm';

interface IProps {
    lists: ListID[];
    onLists?: (lists: ListID[]) => void;
}

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));

export const ListPanel = (_: IProps) => {
    const classes = useStyles();

    const db = useChunkDB();
    const spaces: Space[] = useSpaces();

    const lists: IList[][] = [];

    const refresh = () => db.spaces.refresh();

    return (
        <>
            <Box display="flex" alignItems="stretch" flexDirection="column" m={1}>
                <Typography component="h5" variant="h5">
                    Lists
                </Typography>

                <AddSpaceForm />
            </Box>
            <Box display="flex" alignItems="stretch" flexDirection="column" m={1}>
                <Button onClick={refresh}>Refresh</Button>
            </Box>
            <Box display="flex" alignItems="stretch" flexDirection="column" m={1}>
                <List component="nav" aria-labelledby={`spaces-header`} className={classes.root}>
                    {spaces.map((space, index) => (
                        <SpaceItem key={space.id} space={space} lists={lists[index]} />
                    ))}
                </List>
            </Box>
        </>
    );
};
