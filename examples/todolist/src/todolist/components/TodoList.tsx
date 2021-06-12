import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';

import { ITodo } from '../store/store.types';

interface IProps {
    todos: ITodo[];
    deleteTodo: (id: string) => void;
    loading: boolean;
}

export const TodoList = ({ todos, deleteTodo, loading }: IProps) => (
    <Box m={1}>
        <TableContainer component={Paper}>
            <Table size="small" aria-labelledby="tableTitle" aria-label="enhanced table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Todo</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {!loading &&
                        todos.map(todo => (
                            <TableRow key={todo._id}>
                                <TableCell padding="checkbox">
                                    <Checkbox checked={false} inputProps={{ 'aria-labelledby': 'labelId' }} />
                                </TableCell>
                                <TableCell>{todo.title}</TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        size="small"
                                        aria-label="Edit"
                                        onClick={() => {
                                            deleteTodo(todo._id);
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        aria-label="Delete"
                                        onClick={() => {
                                            deleteTodo(todo._id);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    {loading &&
                        [0, 1, 2, 3, 4].map(i => (
                            <TableRow key={i}>
                                <TableCell padding="checkbox">
                                    <Checkbox checked={true} inputProps={{ 'aria-labelledby': 'labelId' }} disabled />
                                </TableCell>
                                <TableCell>
                                    <Skeleton animation="wave" component="span" height={24} width="40%" />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" aria-label="Edit" disabled>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton size="small" aria-label="Delete" disabled>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Box>
);
