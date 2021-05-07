import { SpaceID } from '@chunk-db/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect, useReducer } from 'react';

import { useTodoState } from '../hooks/useTodoState';
import { useDB } from '../store/store';

import { TodoForm } from './TodoForm';
import { TodoList } from './TodoList';

export const TodoApp = () => {
    const [_, redraw] = useReducer(state => state + 1, 0);
    const { todos, addTodo, deleteTodo, setTodos } = useTodoState([]);

    const saveTodo = (todoText: string) => {
        const trimmedText = todoText.trim();

        if (trimmedText.length > 0) {
            addTodo({
                id: Math.random().toString(16).substring(2),
                title: trimmedText,
            });
        }
    };

    const db = useDB();
    console.log('useDB:', db);

    const commitHandle = useCallback(() => {
        db.transaction('space', async tx => {
            for (const todo of todos)
                await tx.insert('todos', todo);
        }).then(() => {
            console.log('tx complete');
        });
    }, [todos]);

    const load = () => {
        db.space('space')
          .collection('todos')
          .findAll({})
          .then(
              list => {
                  console.log('loaded', list);
                  setTodos(list);
              },
          );
    };

    useEffect(() => {
        db.subscribe(() => {
            console.log('update');
            redraw();
        });
    }, [db, setTodos]);

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
            <Button variant="contained"
                    onClick={load}
            >
                Update
            </Button>
        </div>
    );
};
