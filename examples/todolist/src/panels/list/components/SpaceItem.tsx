import { makeSpaceID, Space } from '@chunk-db/core';
import { useChunkDB, useQueryAll } from '@chunk-db/react';
import { Collapse, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { makeStyles } from '@material-ui/core/styles';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { SyntheticEvent, useCallback, useContext } from 'react';

import { IList, ListID, listScheme } from '../../../store/store.types';

import { SpaceListItem } from './SpaceListItem';
import { ModalContext } from '../../../common-modals/ModalContext';
import { shortId } from '../../../utils/uuid';

const useStyles = makeStyles(theme => ({
    space: {},
    actions: {
        paddingRight: theme.spacing(4),
    },
}));

interface IProps {
    space: Space;
    lists: IList[];
    selectedLists: ListID[];

    onDelete?: (space: Space) => void;
    onCreateList?: (space: Space) => void;

    onToggle(listIDs: ListID[], selected: boolean): void;
}

export const SpaceItem = ({ space, selectedLists, onDelete, onCreateList, onToggle }: IProps) => {
    const classes = useStyles();

    const [openList, setOpenList] = React.useState(true);

    const [lists] = useQueryAll(makeSpaceID(space.id), space => space.collection(listScheme).find({}) as any);

    const handleToggleOpenList = useCallback(() => {
        setOpenList(!openList);
    }, [setOpenList, openList]);

    const handleCreateList = useCallback(
        e => {
            e.stopPropagation();
            onCreateList && onCreateList(space);
        },
        [onCreateList, space]
    );

    const handleDelete = useCallback(
        (e: SyntheticEvent) => {
            e.stopPropagation();
            onDelete && onDelete(space);
        },
        [onDelete, space]
    );

    const handleToggleList = useCallback(
        (e: SyntheticEvent) => {
            e.stopPropagation();
            if (!lists) return;
            if (lists.every(list => selectedLists.includes(list._id))) {
                onToggle(
                    lists.map(list => list._id),
                    false
                );
            } else {
                onToggle(
                    lists.map(list => list._id),
                    true
                );
            }
        },
        [selectedLists, onToggle]
    );

    return (
        <>
            <ListItem button onClick={handleToggleOpenList} className={classes.space}>
                <ListItemIcon onClick={handleToggleList}>
                    <Checkbox
                        edge="start"
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': `space-item-${space.id}` }}
                    />
                </ListItemIcon>
                <ListItemText primary={space.name} secondary={shortId(space.ref)} />
                <ListItemSecondaryAction className={classes.actions}>
                    <IconButton edge="end" aria-label="add list" onClick={handleCreateList}>
                        <AddIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
                <ListItemSecondaryAction>{openList ? <ExpandLess /> : <ExpandMore />}</ListItemSecondaryAction>
            </ListItem>
            <Collapse in={openList} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {lists &&
                        lists.map(list => (
                            <SpaceListItem
                                key={list._id}
                                list={list}
                                space={space}
                                selected={selectedLists.includes(list._id)}
                                onToggle={(id, value) => onToggle([id], value)}
                            />
                        ))}
                </List>
            </Collapse>
        </>
    );
};
