import { makeSpaceID } from '@chunk-db/core';
import { useQueryAll } from '@chunk-db/react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import React, { useState } from 'react';

import { useInputState } from '../../../hooks/useInputState';
import { ListID, listScheme } from '../../../store/store.types';

interface IProps {
    saveTodo: (text: string, listId: ListID) => void;
    lists: ListID[];
}

export const AddTodoForm = ({ saveTodo }: IProps) => {
    const [list, setList] = useState<ListID | null>(null);
    const { value, reset, onChange } = useInputState();

    let [lists] = useQueryAll(makeSpaceID('space'), space => space.collection(listScheme).find({}) as any);
    lists = lists || [];

    const saveTodoHandler = event => {
        event.preventDefault();
        if (value.trim() && list) saveTodo(value, list);
        reset();
    };

    return (
        <form onSubmit={saveTodoHandler}>
            <Box alignItems="bottom">
                <TextField size="small" placeholder="Add todo" margin="normal" onChange={onChange} value={value} />
                <Select value={list} onChange={console.log} displayEmpty>
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {lists.map(item => (
                        <MenuItem value={item._id}>{item.title}</MenuItem>
                    ))}
                </Select>

                <IconButton aria-label="Delete" type="submit" disabled={!value.trim()}>
                    <AddIcon />
                </IconButton>
            </Box>
        </form>
    );
};
