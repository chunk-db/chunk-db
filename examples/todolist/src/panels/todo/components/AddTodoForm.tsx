import { makeSpaceID } from '@chunk-db/core';
import { useQueryAll } from '@chunk-db/react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import React, { useCallback, useState } from 'react';

import { useInputState } from '../../../hooks/useInputState';
import { ListID, listScheme, makeListID } from '../../../store/store.types';

interface IProps {
    saveTodo: (text: string, listId: ListID) => void;
    lists: ListID[];
}

export const AddTodoForm = ({ saveTodo, lists }: IProps) => {
    const [list, setList] = useState<ListID | null>(makeListID(''));
    const { value, reset, onChange } = useInputState();

    lists = lists || [];

    const saveTodoHandler = event => {
        event.preventDefault();
        if (value.trim() && list) saveTodo(value, list);
        reset();
    };

    const handleSelectList = useCallback(
        (_, { props: { value } }) => {
            console.log(value);
            setList(value);
        },
        [setList]
    );

    return (
        <form onSubmit={saveTodoHandler}>
            <Box alignItems="bottom">
                <TextField size="small" placeholder="Add todo" margin="normal" onChange={onChange} value={value} />
                <Select value={list} onChange={handleSelectList} displayEmpty>
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {lists.map(item => (
                        <MenuItem key={item} value={item}>
                            {item}
                        </MenuItem>
                    ))}
                </Select>

                <IconButton aria-label="Delete" type="submit" disabled={!value.trim()}>
                    <AddIcon />
                </IconButton>
            </Box>
        </form>
    );
};
