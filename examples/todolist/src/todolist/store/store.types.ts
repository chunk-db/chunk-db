import { Model } from '@chunk-db/core';

export interface ITodo {
    _id: string;
    title: string;
}

export const todoScheme = new Model('todos', {
    uuid: '_id',
    sid: null,
    indexes: {},
    factory: data => data as ITodo,
});
