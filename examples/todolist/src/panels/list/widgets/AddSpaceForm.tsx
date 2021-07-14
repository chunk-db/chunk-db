import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';

import { useInputState } from '../../../hooks/useInputState';
import { useAddSpace } from '../hooks/useAddSpace';

export const AddSpaceForm = () => {
    const { value: name, reset: resetName, onChange: onChangeName } = useInputState();
    const { value: description, reset: resetDesc, onChange: onChangeDesc } = useInputState();

    const addSpace = useAddSpace();

    const addSpaceHandler = event => {
        event.preventDefault();
        resetName();
        resetDesc();

        addSpace({ name, description });
    };

    return (
        <form onSubmit={addSpaceHandler}>
            <Box display="flex" flexDirection="row" alignItems="flex-end">
                <TextField size="small" label="Space name" margin="normal" onChange={onChangeName} value={name} />
                <TextField
                    size="small"
                    label="Description"
                    margin="normal"
                    onChange={onChangeDesc}
                    value={description}
                />

                <IconButton aria-label="Delete" type="submit" disabled={!name.trim()}>
                    <AddIcon />
                </IconButton>
            </Box>
        </form>
    );
};
