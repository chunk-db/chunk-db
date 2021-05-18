import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
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
                    <SaveIcon />
                </IconButton>
            </Box>
        </form>
    );
};
