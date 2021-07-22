import { makeSpaceID } from '@chunk-db/core';
import { useChunkDB } from '@chunk-db/react';
import { useCallback } from 'react';

import { ITodo, ListID, makeTodoID, todoScheme } from '../store/store.types';

export function useAddTodo() {
    const db = useChunkDB();

    return useCallback(
        (title: string, listId: ListID) => {
            title = title.trim();
            if (!title) return;
            const todo: ITodo = {
                _id: makeTodoID(Math.random().toString(16).substring(2)),
                title,
                listId,
            };
            db.transaction(makeSpaceID('space'), tx => {
                return tx.upsert(todoScheme, todo);
            }).then(() => console.log('transaction complete'));
        },
        [db]
    );
}

export function useDeleteTodo() {
    const db = useChunkDB();

    return useCallback(
        (id: string) => {
            if (!id) return;
            db.transaction(makeSpaceID('space'), tx => {
                return tx.remove(todoScheme, id);
            }).then(() => console.log('transaction complete'));
        },
        [db]
    );
}
