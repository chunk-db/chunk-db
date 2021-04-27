import { ChunkDB, Space, SpaceID } from '@chunk-db/core';
import { InMemoryChunkStorage } from '@chunk-db/core';
import { IDemoRecord } from '@chunk-db/core/__tests__/chunks.demo';

import type { IDBScheme } from './store.types';

export const storage = new InMemoryChunkStorage();

const space = new Space<{ todos: IDemoRecord }>({
    id: 'space' as SpaceID,
    name: 'a1',
    refs: {
         todos: null,
    },
});

storage.createSpace(space);

export const db = new ChunkDB<IDBScheme>({
    storage,
    collections: {
        todos: {},
    },
    spaces: ['space'],
});
