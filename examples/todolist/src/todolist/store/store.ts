import {
    ChunkDB,
    InMemoryChunkStorage,
    Space,
} from '@chunk-db/core';
import { IDemoRecord } from '@chunk-db/core/__tests__/chunks.demo';

import { IndexedDBDriver } from '@chunk-db/idb';

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
});

db.connect().then((db: ChunkDB<any>) => {
    console.log('connected');
    db.spaces.load(space.id)
      .catch(() => {
          db.spaces.create(space);
          return db.spaces.save(space.id);
      })
      .then(data => space = data)
      .then(() => console.log('init spaces', db.spaces));
});
