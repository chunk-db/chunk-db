import { makeSpaceID } from '@chunk-db/core';
import { useQueryAll } from '@chunk-db/react';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import React from 'react';

import { TodoForm } from '../components/TodoForm';
import { TodoList } from '../components/TodoList';
import { useAddTodo, useDeleteTodo } from '../hooks/useTodoOperations';
import { ListID, todoScheme } from '../store/store.types';

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
        <Box display="flex" alignItems="stretch" flexDirection="column" m={1}>
            <Box m={1}>
                <Typography component="h5" variant="h5">
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
