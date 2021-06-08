import { CollectionScheme } from '@chunk-db/core';

export interface ITodo {
    _id: string;
    title: string;
}

export const todoScheme = new CollectionScheme('todos', {
    uuid: '_id',
    sid: null,
    indexes: {},
    factory: data => data as ITodo,
});
