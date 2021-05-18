import { useQueryAll } from '@chunk-db/react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import React from 'react';

import { useAddTodo, useDeleteTodo } from '../hooks/useTodoOperations';

import { TodoForm } from './TodoForm';
import { TodoList } from './TodoList';

export const TodoApp = () => {
    const addTodo = useAddTodo();
    const deleteTodo = useDeleteTodo();

    const todos = useQueryAll(
        'space',
        space => space.collection('todos').find({}),
    );

    const symbols = useQueryAll(
        'space',
        space => space
            .collection('todos').find({}).exec()
            .reduce((len, todo) => len + todo.title.length, 0),
    );

    return (
        <div className="App">
            <Box m={2}>
                <Typography component="h1" variant="h2">Todos</Typography>
            </Box>

            <TodoForm saveTodo={addTodo} />

            <Alert severity="info"
                   variant="outlined">
                Total symbols in titles: {symbols}
            </Alert>

            <TodoList todos={todos}
                      deleteTodo={deleteTodo} />
        </div>
    );
};
