import { makeSpaceID } from '@chunk-db/core';
import { useQueryAll } from '@chunk-db/react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import React from 'react';

import { useAddTodo, useDeleteTodo } from '../../hooks/useTodoOperations';
import { ListID, todoScheme } from '../../store/store.types';

import { AddTodoForm } from './components/AddTodoForm';
import { TodoList } from './components/TodoList';

interface IProps {
    lists: ListID[];
}

export const TodoPanel = ({ lists }: IProps) => {
    const addTodo = useAddTodo();
    const deleteTodo = useDeleteTodo();

    const [todos, loading] = useQueryAll(
        makeSpaceID('space'),
        space =>
            space.collection(todoScheme).find({
                listId: { $in: lists },
            }) as any
    );

    const [symbols, calculating] = useQueryAll(makeSpaceID('space'), space =>
        space
            .collection(todoScheme)
            .find({
                listId: { $in: lists },
            })
            .exec()
            .reduce((len, todo) => len + todo.title.length, 0)
    );

    return (
        <>
            <Box display="flex" alignItems="stretch" flexDirection="column" m={1}>
                <Typography component="h5" variant="h5">
                    Todos
                </Typography>
            </Box>
            <Box display="flex" alignItems="stretch" flexDirection="column" m={1}>
                <AddTodoForm saveTodo={addTodo} lists={lists} />
            </Box>
            <Box display="flex" alignItems="stretch" flexDirection="column" m={1}>
                <Alert severity="info" variant="outlined">
                    Total symbols in titles:&nbsp;
                    {calculating ? <CircularProgress size={12} /> : symbols}
                </Alert>
            </Box>
            <Box display="flex" alignItems="stretch" flexDirection="column" m={1}>
                <TodoList todos={todos} deleteTodo={deleteTodo} loading={loading} />
            </Box>
        </>
    );
};
