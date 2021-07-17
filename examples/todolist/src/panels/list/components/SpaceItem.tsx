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
import React, { useContext } from 'react';

import { IList, listScheme } from '../../../store/store.types';

import { SpaceListItem } from './ListItem';
import { ModalContext } from '../../../common-modals/ModalContext';

const useStyles = makeStyles(theme => ({
    space: {},
    actions: {
        paddingRight: theme.spacing(4),
    },
}));

interface IProps {
    space: Space;
    lists: IList[];
    onDelete?: (space: Space) => void;
}

export const SpaceItem = ({ space, onDelete }: IProps) => {
    const classes = useStyles();

    const [openList, setOpenList] = React.useState(false);

    const [lists] = useQueryAll(makeSpaceID(space.id), space => space.collection(listScheme).find({}) as any);

    const toggleList = () => {
        setOpenList(!openList);
    };

    const handleDelete = e => {
        e.stopPropagation();
        onDelete && onDelete(space);
    };

    return (
        <>
            <ListItem button onClick={toggleList} className={classes.space}>
                <ListItemIcon>
                    <Checkbox
                        edge="start"
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': `space-item-${space.id}` }}
                    />
                </ListItemIcon>
                <ListItemText primary={space.name} secondary={space.ref} />
                <ListItemSecondaryAction className={classes.actions}>
                    <IconButton edge="end" aria-label="add list">
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
                    {lists && lists.map(list => <SpaceListItem list={list} space={space} />)}
                </List>
            </Collapse>
        </>
    );
};
