import TextField from '@material-ui/core/TextField';
import React from 'react';

import { useInputState } from '../_hooks/useInputState';

interface IProps {
    saveTodo: (value: string) => void;
}

export const TodoForm = ({ saveTodo }: IProps) => {
    const { value, reset, onChange } = useInputState();

    return (
        <form
            onSubmit={event => {
                event.preventDefault();
                saveTodo(value);
                reset();
            }}
        >
            <TextField
                variant="outlined"
                placeholder="Add todo"
                margin="normal"
                onChange={onChange}
                value={value}
            />
        </form>
    );
};
