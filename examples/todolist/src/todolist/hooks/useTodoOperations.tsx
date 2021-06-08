import { useCallback } from 'react';
import { useChunkDB } from '@chunk-db/react';
import { ITodo, todoScheme } from '../store/store.types';

export function useAddTodo() {
    const db = useChunkDB();

    return useCallback((title: string) => {
        const trimmedText = title.trim();
        if (!trimmedText)
            return;
        const todo: ITodo = {
            _id: Math.random().toString(16).substring(2),
            title: trimmedText,
        };
        db.transaction('space', tx => tx.insert(todoScheme, todo))
          .then(() => console.log('transaction complete'));
    }, [db]);
}

export function useDeleteTodo() {
    const db = useChunkDB();

    return useCallback((id: string) => {
        if (!id)
            return;
        alert('delete todo ' + id);
        // db.transaction('space', tx => tx.remove('todos', id))
        //   .then(() => console.log('transaction complete'));
    }, [db]);
}
