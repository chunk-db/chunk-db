import { SpaceID } from '@chunk-db/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import React, { useCallback } from 'react';

import { useTodoState } from '../_hooks/useTodoState';
import { db } from '../_store/store';

import { TodoForm } from './TodoForm';
import { TodoList } from './TodoList';

export const TodoApp = () => {
    const { todos, addTodo, deleteTodo } = useTodoState([]);

    const saveTodo = (todoText: string) => {
        const trimmedText = todoText.trim();

        if (trimmedText.length > 0) {
            addTodo({
                id: Math.random().toString(16).substring(2),
                title: trimmedText,
            });
        }
    };

    const commitHandle = useCallback(() => {
        db.transaction('space' as SpaceID, async tx => {
            for (const todo of todos)
                await tx.insert('todos', todo);
        }).then(() => {
            console.log('tx complete');
        });
    }, [todos]);

    return (
        <div className="App">
            <Typography component="h1" variant="h2">
                Todos
            </Typography>

            <TodoForm saveTodo={saveTodo} />

            <TodoList todos={todos}
                      deleteTodo={deleteTodo} />

            <Button variant="contained"
                    color="primary"
                    onClick={commitHandle}
            >
                Primary
            </Button>
        </div>
    );
};
