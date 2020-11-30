import { demoStorage, IDemoRecord } from '../__tests__/chunks.demo';

import { ChunkDB } from './ChunkDB';
import { call, getStorage, ScenarioContext } from './scenarios/scenario.types';
import { InMemoryChunkStorage } from './in-memory-chunk-storage';
import { StorageTestDriver } from './storage-test';
import { Space } from './space';
import { SpaceID } from './common.types';

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

            let driver = await demoStorage();
            let db1: ChunkDB<{ records: IDemoRecord }> = new ChunkDB({
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
            db1.spaces.set(baseSpace.id, { ...baseSpace });
            db1.spaces.set(space.id, { ...space });

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

            // arrange
            let db2: ChunkDB<{ records: IDemoRecord }> = new ChunkDB({
                cache: null,
                storage: driver,
                collections: {
                    records: {
                        factory(data: any): IDemoRecord {
                            return data;
                        },
                    },
                },
                spaces: [
                    'test-space',
                ],
            });

            console.log(driver.spaces.keys());

            // act 2: find record
            await db2.ready$;
            const foundRecord = await db2.collection('records')
                                         .space('test-space' as SpaceID)
                                         .findOne({ _id: '123' });

            // assert
            expect(foundRecord).toEqual(record);
            console.log(driver.spaces);
            console.log(driver.chunks);
        });
    });
});
