import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';

import { ITodo } from '../store/store.types';

interface IProps {
    todos: ITodo[];
    deleteTodo: (id: string) => void;
}

export const TodoList = ({ todos, deleteTodo }: IProps) => (
    <List>
        {todos.map((todo) => (
            <ListItem key={todo._id} dense button>
                <Checkbox tabIndex={-1} disableRipple />
                <ListItemText primary={todo.title} />
                <ListItemSecondaryAction>
                    <IconButton
                        aria-label="Delete"
                        onClick={() => {
                            deleteTodo(todo._id);
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        ))}
    </List>
);
