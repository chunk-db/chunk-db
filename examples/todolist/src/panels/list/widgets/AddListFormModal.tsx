import { Space } from '@chunk-db/core';
import { useChunkDB } from '@chunk-db/react';
import { Button, DialogActions, DialogContent, DialogContentText, Theme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { v4 } from 'uuid';

import { AdaptiveDialog } from '../../../components/AdaptiveDialog';
import { useInputState } from '../../../hooks/useInputState';
import { listScheme, makeListID } from '../../../store/store.types';

interface IProps {
    open: boolean;
    space: Space;
    onClose?: () => void;
}

const useStyles = makeStyles((_: Theme) => ({
    root: {},
}));

export const AddListFormModal = ({ open, onClose, space }: IProps) => {
    const classes = useStyles();
    const db = useChunkDB();

    const { value: name, reset: resetName, onChange: onChangeName } = useInputState();

    const handleClose = useCallback(() => {
        onClose && onClose();
    }, [onClose]);

    const addListHandler = useCallback(
        title => {
            resetName();

            db.transaction(space.id, async tx => {
                await tx.upsert(listScheme, {
                    _id: makeListID(v4()),
                    title: title,
                });
            });
            handleClose();
        },
        [db, space, handleClose]
    );

    const handleSaveList = event => {
        event.preventDefault();
        addListHandler(name);
    };

    return (
        <AdaptiveDialog open={open} title="Add new list" onClose={handleClose}>
            <DialogContent>
                <DialogContentText>Add list to space "{space?.name}"</DialogContentText>
                <form onSubmit={addListHandler}>
                    <Box className={classes.root} display="flex" flexDirection="column" alignItems="flex-end" m={0}>
                        <TextField
                            size="small"
                            label="Space name"
                            margin="normal"
                            onChange={onChangeName}
                            value={name}
                        />
                    </Box>
                </form>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button color="primary" onClick={handleSaveList} type="submit" disabled={!name.trim()} autoFocus>
                    Create
                </Button>
            </DialogActions>
        </AdaptiveDialog>
    );
};
