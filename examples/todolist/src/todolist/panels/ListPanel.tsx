import Box from '@material-ui/core/Box';
import React from 'react';

import { DevToolsUI } from '../../devTools';
import { ListID } from '../store/store.types';

interface IProps {
    lists: ListID[];
    onLists?: (lists: ListID[]) => void;
}

export const ListPanel = (_: IProps) => {
    return (
        <Box display="flex" alignItems="stretch" flexDirection="column" m={1}>
            <DevToolsUI />
        </Box>
    );
};
