import { ChunkDB } from '../src/ChunkDB';
import { IChunkDBConfig } from '../src/db.types';
import { InMemoryChunkStorage } from '../src/inmemory-storage';

const storage = new InMemoryChunkStorage();

const config: IChunkDBConfig = {
    storage,
    collections: {},
};
describe('ChunkDB e2e tests', () => {
    let db: ChunkDB;

    beforeEach(() => {
        db = new ChunkDB(config);
    });

    it('base', () => {
        db.tag('v1');
    });
});
