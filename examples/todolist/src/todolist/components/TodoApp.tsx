import { useChunkDB, useQueryAll, useSpace } from '@chunk-db/react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import React, { useCallback } from 'react';

import { useTodoState } from '../hooks/useTodoState';

import { TodoForm } from './TodoForm';
import { TodoList } from './TodoList';

export const TodoApp = () => {
    const { todos, addTodo, deleteTodo } = useTodoState([]);

    const saveTodo = (todoText: string) => {
        const trimmedText = todoText.trim();

        if (trimmedText.length > 0) {
            addTodo({
                _id: Math.random().toString(16).substring(2),
                title: trimmedText,
            });
        }
    };

    const db = useChunkDB();

    const commitHandle = useCallback(() => {
        db.transaction('space', async tx => {
            for (const todo of todos)
                await tx.insert('todos', todo);
        }).then(() => {
            console.log('transaction complete');
        });
    }, [todos]);

    const space = useSpace('space');

    const todoList = useQueryAll(
        'space',
        space => space.collection('todos').find({}),
    );

    const symbols = useQueryAll(
        'space',
        space => space.collection('todos').find({}).exec()
                      .reduce((len, todo) => len + todo.title.length, 0),
    );

    return (
        <div className="App">
            <Typography component="h1" variant="h2">
                Todos
            </Typography>

            <TodoForm saveTodo={saveTodo} />

            <TodoList todos={todos}
                      deleteTodo={deleteTodo} />
            <hr />
            <TodoList todos={todoList}
                      deleteTodo={deleteTodo} />

            <Button variant="contained"
                    color="primary"
                    onClick={commitHandle}
            >
                Primary
            </Button>
            <p>Total symbols: {symbols}</p>
            <pre>{JSON.stringify({
                id: space.id,
                name: space.name,
                refs: space.refs,
            }, null, 2)}</pre>
        </div>
    );
};
