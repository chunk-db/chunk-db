import { ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ISpace, Space } from '@chunk-db/core';
import { IList } from '../../../store/store.types';
import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(theme => ({
    list: {
        paddingLeft: theme.spacing(5),
    },
}));

interface IProps {
    list: IList;
    space: ISpace;
}

export const SpaceListItem = ({ space, list }: IProps) => {
    const classes = useStyles();

    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };
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
