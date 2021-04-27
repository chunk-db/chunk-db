import { useState } from 'react';

import { ITodo } from '../_store/store.types';

export const useTodoState = (initialValue) => {
    const [todos, setTodos] = useState<ITodo[]>(initialValue);

    return {
        todos,
        addTodo: (todo: ITodo) => {
            setTodos([...todos, todo]);
        },
        deleteTodo: (id: string) => {
            const newTodos = todos.filter(todo => todo.id !== id);

            setTodos(newTodos);
        },
    };
};
