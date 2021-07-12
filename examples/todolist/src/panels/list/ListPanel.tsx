import { Collapse, List, ListItem, ListItemText, ListSubheader } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { ExpandLess, ExpandMore, StarBorder } from '@material-ui/icons';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import React from 'react';

import { DevToolsUI } from '../devTools';
import { IList, ListID, makeListID } from '../../store/store.types';

import { AddSpaceForm } from './components/AddSpaceForm';
import { useQueryAll, useSpaces } from '@chunk-db/react';
import { ISpace } from '@chunk-db/core';
import { SpaceItem } from './components/SpaceItem';

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

    const spaces: ISpace[] = useSpaces();

    const lists: IList[][] = [
        [
            {
                _id: makeListID('asd'),
                title: 'list 1',
            },
            {
                _id: makeListID('hdf'),
                title: 'list 2',
            },
            {
                _id: makeListID('dsf'),
                title: 'list 3',
            },
        ],
        [
            {
                _id: makeListID('asd'),
                title: 'list 1',
            },
            {
                _id: makeListID('hdf'),
                title: 'list 2',
            },
            {
                _id: makeListID('dsf'),
                title: 'list 3',
            },
        ],
    ];

    return (
        <>
            <Box display="flex" alignItems="stretch" flexDirection="column" m={1}>
                <Typography component="h5" variant="h5">
                    Lists
                </Typography>

                <AddSpaceForm />
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
