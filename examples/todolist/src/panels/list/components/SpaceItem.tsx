import { Collapse, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import { ExpandLess, ExpandMore, StarBorder } from '@material-ui/icons';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ISpace, Space } from '@chunk-db/core';
import { IList } from '../../../store/store.types';

import List from '@material-ui/core/List';
import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import { SpaceListItem } from './ListItem';

const useStyles = makeStyles(theme => ({
    space: {},
    actions: {
        paddingRight: theme.spacing(4),
    },
}));

interface IProps {
    space: ISpace;
    lists: IList[];
}

export const SpaceItem = ({ space, lists }: IProps) => {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <>
            <ListItem button onClick={handleClick} className={classes.space}>
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
                    <IconButton edge="end" aria-label="comments">
                        <AddIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="comments">
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
                <ListItemSecondaryAction>{open ? <ExpandLess /> : <ExpandMore />}</ListItemSecondaryAction>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {lists.map(list => (
                        <SpaceListItem list={list} space={space} />
                    ))}
                </List>
            </Collapse>
        </>
    );
};
