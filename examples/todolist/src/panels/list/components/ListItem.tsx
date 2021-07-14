import { ISpace } from '@chunk-db/core';
import { ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import React from 'react';

import { IList } from '../../../store/store.types';

const useStyles = makeStyles(theme => ({
    list: {
        paddingLeft: theme.spacing(5),
    },
}));

interface IProps {
    list: IList;
    space: ISpace;
}

export const SpaceListItem = ({ list }: IProps) => {
    const classes = useStyles();

    return (
        <ListItem button dense className={classes.list}>
            <ListItemIcon>
                <Checkbox
                    edge="start"
                    tabIndex={-1}
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
