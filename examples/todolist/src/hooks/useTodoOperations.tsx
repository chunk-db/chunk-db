import { makeSpaceID } from '@chunk-db/core';
import { useChunkDB } from '@chunk-db/react';
import { useCallback } from 'react';

import { ITodo, makeListID, makeTodoID, todoScheme } from '../store/store.types';

export function useAddTodo() {
    const db = useChunkDB();

    return useCallback(
        (title: string) => {
            const trimmedText = title.trim();
            if (!trimmedText) return;
            const todo: ITodo = {
                _id: makeTodoID(Math.random().toString(16).substring(2)),
                title: trimmedText,
                listId: makeListID(''),
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