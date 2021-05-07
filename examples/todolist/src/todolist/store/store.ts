import {
    ChunkDB, ICollectionTypes,
    InMemoryChunkStorage,
    IStorageCacheDriver, IStorageDriver,
    Space,
    SpaceID,
} from '@chunk-db/core';
import { IDemoRecord } from '@chunk-db/core/__tests__/chunks.demo';

import { IndexedDBDriver } from '@chunk-db/idb';
import { useState } from 'react';

const storage = process.browser
    ? new IndexedDBDriver('chunk-db-todolist-example')
    : new InMemoryChunkStorage();

let space = new Space<{ todos: IDemoRecord }>({
    id: 'space',
    name: 'a1',
    refs: {
        todos: null,
    },
});

export const db = new ChunkDB<any>({ // TODO
    storage,
    collections: {
        todos: {},
    },
    // spaces: ['space'],
});

let ready = false;
const promise = db.connect().then((db: ChunkDB<any>) => {
    console.log('connected');
    db.spaces.load(space.id)
      .catch(() => db.spaces.create(space))
      .then(data => space = data)
      .then(() => console.log('init spaces', db.spaces))
      .then(() => ready = true);
});

export function useDB<T extends ICollectionTypes = any>(): ChunkDB<T> {
    const [_, setReadyDB] = useState(false);

    if (db && ready)
        return db;

    console.log('init db');
    promise.then(() => setReadyDB(true));

    return db;
}
