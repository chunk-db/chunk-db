import { demoStorage, IDemoRecord } from '../__tests__/chunks.demo';

import { ChunkDB } from './ChunkDB';
import { SpaceID } from './common.types';
import { InMemoryChunkStorage } from './in-memory-chunk-storage';
import { call, getStorage, ScenarioContext } from './scenarios/scenario.types';
import { Space } from './space';

describe('ChunkDB', () => {
    describe('run', () => {
        let db: ChunkDB<{ records: IDemoRecord }>;
        let storage: InMemoryChunkStorage;
        beforeEach(async () => {
            storage = await demoStorage();
            db = new ChunkDB({
                storage,
                collections: {
                    records: {
                        factory(data: any): IDemoRecord {return data;},
                    },
                },
            });
        });

        async function increment(this: ScenarioContext<{ records: IDemoRecord }>, value: number): Promise<any> {
            return value + 1;
        }

        test('should return any value', async () => {
            function* testFunc() {
                yield 'storage';
                return 'storage return';
            }

            const gen = db.run(testFunc());
            expect(await gen.next()).toEqual({
                done: false,
                value: 'storage',
            });
            expect(await gen.next()).toEqual({
                done: true,
                value: 'storage return',
            });
        });

        test('should return call', async () => {
            function* testFunc() {
                const x = yield call(increment, 1);
                yield x;
                return call(increment, 2);
            }

            const gen = db.run(testFunc());
            expect(await gen.next()).toEqual({
                done: false,
                value: 2,
            });
            expect(await gen.next()).toEqual({
                done: true,
                value: 3,
            });
        });

        test('should receive storage', async () => {
            function* testFunc() {
                const storage = yield call(getStorage);
                yield storage;
                return call(increment, 1);
            }

            const gen = db.run(testFunc());
            expect(await gen.next()).toEqual({
                done: false,
                value: db.storage,
            });
            expect(await gen.next()).toEqual({
                done: true,
                value: 2,
            });
        });
    });

    describe('saving and restoring data', () => {
        it('save record, restart, find record', async () => {
            // arrange
            const baseSpace = new Space<{ records: IDemoRecord }>({
                id: 'base-space' as SpaceID,
                name: 'initial',
                refs: {
                    records: 'initial',
                },
            });
            const space = new Space<{ records: IDemoRecord }>({
                id: 'test-space' as SpaceID,
                name: 'a1',
                refs: {
                    records: 'a1',
                },
            });

            const driver = await demoStorage();
            const db1: ChunkDB<{ records: IDemoRecord }> = new ChunkDB({
                cache: null,
                storage: driver,
                collections: {
                    records: {
                        factory(data: any): IDemoRecord {
                            return data;
                        },
                    },
                },
            });
            db1.spaces.create(baseSpace);
            await db1.spaces.save(baseSpace.id);
            db1.spaces.create(space);
            await db1.spaces.save(space.id);

            const record: IDemoRecord = {
                _id: '123',
                user: 3,
                value: 'some value',
            };

            // act 1: insert record
            const event1 = await db1.transaction(space.id, async tx => {
                const insertedRecord = await tx.upsert('records', { ...record });
                expect(insertedRecord).toEqual(record);
            });

            // assert
            const updatedSpace = db1.spaces.getLoaded(space.id)!;
            expect(updatedSpace.refs['records']).not.toBe(space.refs['records']);
            const chunk = db1.storage.getExists(updatedSpace.refs['records']);
            expect(chunk).toBeTruthy();
            expect(chunk!.parents).toHaveLength(1);
            expect(chunk!.parents[0]).toBe(space.refs['records']);

            // arrange
            const db2: ChunkDB<{ records: IDemoRecord }> = new ChunkDB({
                cache: null,
                storage: driver,
                collections: {
                    records: {
                        factory(data: any): IDemoRecord {
                            return data;
                        },
                    },
                },
            });

            // act 2: find record
            await db2.connect();
            await db2.spaces.load('test-space');
            const foundRecord = await db2.collection('records')
                                         .space('test-space' as SpaceID)
                                         .findOne({ _id: '123' });

            // assert
            expect(foundRecord).toEqual(record);
            // console.log(driver.spaces);
            // console.log(driver.chunks);
        });
    });

    describe('getChain', () => {
        let db: ChunkDB<{ records: IDemoRecord }>;
        let storage: InMemoryChunkStorage;
        beforeEach(async () => {
            storage = await demoStorage();
            db = new ChunkDB({
                storage,
                collections: {
                    records: {
                        factory(data: any): IDemoRecord {return data;},
                    },
                },
            });
        });

        test('get empty', async () => {
            // act
            const chain = await db.getFlatChain('a1', 0);

            // assert
            expect(chain).toHaveLength(0);
        });

        test('get last one', async () => {
            // act
            const chain = await db.getFlatChain('a1', 1);

            // assert
            expect(chain).toHaveLength(1);
            expect(chain[0].id).toEqual('a1');
        });

        test('get all chain (top)', async () => {
            // act
            const chain = await db.getFlatChain('a1', Infinity);

            // assert
            expect(chain).toHaveLength(2);
            expect(chain[0].id).toEqual('a1');
            expect(chain[1].id).toEqual('initial');
        });

        test('get all chain (in middle)', async () => {
            // act
            const chain = await db.getFlatChain('initial', Infinity);

            // assert
            expect(chain).toHaveLength(1);
            expect(chain[0].id).toEqual('initial');
        });
    });
});
