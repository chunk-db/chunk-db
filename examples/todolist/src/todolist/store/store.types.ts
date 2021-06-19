import { Model } from '@chunk-db/core';

export type TodoID = { _brand: 'TodoID' } & string;
export type ListID = { _brand: 'ListID' } & string;

export interface ITodo {
    _id: TodoID;
    title: string;
    listId: ListID;
}

export const todoScheme = new Model<ITodo>('todos', {
    uuid: '_id',
    indexes: {},
});

export interface IList {
    _id: ListID;
    title: string;
}

export const listScheme = new Model<IList>('lists', {
    uuid: '_id',
    indexes: {},
});
