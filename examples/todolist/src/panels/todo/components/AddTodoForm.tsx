import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import React, { useCallback, useState } from 'react';

import { useInputState } from '../../../hooks/useInputState';
import { IList, ListID, makeListID } from '../../../store/store.types';

interface IProps {
    saveTodo: (text: string, listId: ListID) => void;
    lists: IList[];
}

export const AddTodoForm = ({ saveTodo, lists }: IProps) => {
    const [listId, setListId] = useState<ListID | null>(makeListID(''));
    const { value, reset, onChange } = useInputState();

    lists = lists || [];

    const saveTodoHandler = useCallback(
        event => {
            event.preventDefault();
            if (value.trim() && listId) saveTodo(value, listId);
            reset();
        },
        [saveTodo, listId]
    );

    const handleSelectList = useCallback(
        (_, { props: { value } }) => {
            setListId(value);
        },
        [setListId]
    );

    return (
        <form onSubmit={saveTodoHandler}>
            <Box alignItems="bottom">
                <TextField size="small" placeholder="Add todo" margin="normal" onChange={onChange} value={value} />
                <Select value={listId} onChange={handleSelectList} displayEmpty>
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {lists.map(item => (
                        <MenuItem key={item._id} value={item._id}>
                            {item.title}
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
