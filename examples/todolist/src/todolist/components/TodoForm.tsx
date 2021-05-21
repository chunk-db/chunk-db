import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';

import { useInputState } from '../hooks/useInputState';

interface IProps {
    saveTodo: (value: string) => void;
}

export const TodoForm = ({ saveTodo }: IProps) => {
    const { value, reset, onChange } = useInputState();

    const saveTodoHandler = (event) => {
        event.preventDefault();
        if (value.trim())
            saveTodo(value);
        reset();
    };

    return (
        <form
            onSubmit={saveTodoHandler}
        >
            <Box alignItems="bottom">
                <TextField
                    size="small"
                    placeholder="Add todo"
                    margin="normal"
                    onChange={onChange}
                    value={value}
                />

                <IconButton
                    aria-label="Delete"
                    type="submit"
                    disabled={!value.trim()}
                >
                    <AddIcon />
                </IconButton>
            </Box>
        </form>
    );
};
