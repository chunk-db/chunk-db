import { AbstractChunk } from '@chunk-db/core';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import CopyIcon from '@material-ui/icons/FilterNone';
import React from 'react';

import { copyToClipboard } from '../../utils';
import { shortId } from '../../utils/uuid';

interface IProps {
    chunks: AbstractChunk[];
}

export function ChunkList({ chunks }: IProps) {
    const rows = chunks.map(chunk => ({
        id: chunk.id,
        shortId: shortId(chunk.id),
        type: chunk.type,
        size: chunk.size,
    }));

    return (
        <TableContainer component={Paper}>
            <Table size="small" stickyHeader aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>UUID</TableCell>
                        <TableCell align="right">Type</TableCell>
                        <TableCell align="right">Size</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.id}>
                            <TableCell component="th" scope="row">
                                <Box display="flex" flexDirection="row" justifyContent="space-between">
                                    <Tooltip title={row.id} aria-label="Chunk ID">
                                        <span>{row.shortId}</span>
                                    </Tooltip>
                                    <IconButton
                                        aria-label="Edit"
                                        size="small"
                                        edge="end"
                                        onClick={() => copyToClipboard(row.id)}
                                    >
                                        <CopyIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </TableCell>
                            <TableCell align="right">{row.type}</TableCell>
                            <TableCell align="right">{row.size}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
