import { ISpace } from '@chunk-db/core';
import { ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import React, { useCallback } from 'react';

import { IList, ListID } from '../../../store/store.types';

const useStyles = makeStyles(theme => ({
    list: {
        paddingLeft: theme.spacing(5),
    },
}));

interface IProps {
    list: IList;
    space: ISpace;
    selected: boolean;

    onToggle(listId: ListID, selected: boolean): void;
}

export const SpaceListItem = ({ selected, onToggle, list }: IProps) => {
    const classes = useStyles();

    const handleToggle = useCallback(e => onToggle && onToggle(list._id, !selected), [onToggle, selected]);

    return (
        <ListItem button dense className={classes.list}>
            <ListItemIcon onChange={handleToggle}>
                <Checkbox
                    checked={selected}
                    edge="start"
                    disableRipple
                    inputProps={{ 'aria-labelledby': `list-item-${list._id}` }}
                />
            </ListItemIcon>
            <ListItemText id={`list-item-${list._id}`} primary={list.title} />
            <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="comments">
                    <VisibilityIcon color="disabled" />
                </IconButton>
                <IconButton edge="end" aria-label="comments">
                    <DeleteIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};
