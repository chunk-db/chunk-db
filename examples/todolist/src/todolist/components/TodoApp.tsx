import { useQueryAll } from '@chunk-db/react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import React from 'react';

import { useAddTodo, useDeleteTodo } from '../hooks/useTodoOperations';
import { todoScheme } from '../store/store.types';

import { TodoForm } from './TodoForm';
import { TodoList } from './TodoList';
import { makeSpaceID } from '@chunk-db/core';

export const TodoApp = () => {
    const addTodo = useAddTodo();
    const deleteTodo = useDeleteTodo();

    const [todos, loading] = useQueryAll(makeSpaceID('space'), space => space.collection(todoScheme).find({}) as any);

    const [symbols, calculating] = useQueryAll(makeSpaceID('space'), space =>
        space
            .collection(todoScheme)
            .find({})
            .exec()
            .reduce((len, todo) => len + todo.title.length, 0)
    );

    return (
        <Box display="flex" alignItems="stretch" flexDirection="column" m={1}>
            <Box m={1}>
                <Typography component="h1" variant="h2">
                    Todos
                </Typography>

                <TodoForm saveTodo={addTodo} />

                <Alert severity="info" variant="outlined">
                    Total symbols in titles:&nbsp;
                    {calculating ? <CircularProgress size={12} /> : symbols}
                </Alert>
            </Box>

            <TodoList todos={todos} deleteTodo={deleteTodo} loading={loading} />
        </Box>
    );
};
