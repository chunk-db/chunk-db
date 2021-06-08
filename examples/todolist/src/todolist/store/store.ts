import {
    ChunkDB,
    InMemoryChunkStorage,
    Space,
} from '@chunk-db/core';

import { IndexedDBDriver } from '@chunk-db/idb';
import { todoScheme } from './store.types';

const storage = process.browser
    ? new IndexedDBDriver('chunk-db-todolist-example')
    : new InMemoryChunkStorage();

let space = new Space({
    id: 'space',
    name: 'a1',
    refs: {
        todos: null,
    },
});

export const db = new ChunkDB({ // TODO
    storage,
    collections: [todoScheme],
});

db.connect().then((db: ChunkDB) => {
    console.log('connected');
    db.spaces.load(space.id)
      .catch(() => {
          db.spaces.create(space);
          return db.spaces.save(space.id);
      })
      .then(data => space = data)
      .then(() => console.log('init spaces', db.spaces));
});
