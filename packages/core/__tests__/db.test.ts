import { ChunkDB } from '../src/ChunkDB';
import { InMemoryChunkStorage } from '../src/inmemory-storage';
import { allDemoChunks, IDemoRecord } from './chunks.demo';
import { Cursor } from '../src/cursor';
import { Space } from '../src/space';

describe('ChunkDB e2e tests', () => {
    describe('fetch data', () => {
        let storage: InMemoryChunkStorage;
        let db: ChunkDB<{ records: IDemoRecord }>;
        const baseSpace = new Space<{ records: IDemoRecord }>({
            id: 'base-space',
            name: 'initial',
            refs: {
                records: 'initial',
            },
        });
        const space = new Space<{ records: IDemoRecord }>({
            id: 'test-space',
            name: 'a1',
            refs: {
                records: 'a1',
            },
        });

        beforeEach(async () => {
            storage = new InMemoryChunkStorage();
            storage.reset(allDemoChunks);
            db = new ChunkDB({
                storage,
                collections: {
                    records: {
                        factory(data: any): IDemoRecord {
                            return data;
                        },
                    },
                },
            });
            db.spaces.set(baseSpace.id, baseSpace);
            db.spaces.set(space.id, space);
        });
        describe('find', () => {
            describe('all', () => {
                test('all', async () => {
                    // arrange

                    // act
                    const cursor = db
                        .collection('records')
                        .space('test-space')
                        .find({})
                        .exec();

                    // assert
                    expect(cursor).toBeInstanceOf(Cursor);

                    const result = await cursor.all();

                    expect(result).toEqual([
                        { _id: 'a', user: 1, value: 'a1' },
                        { _id: 'd', user: 2, value: 'd0' },
                    ]);
                });
            });
            describe('one', () => {
                test('one', async () => {
                    // arrange

                    // act
                    const result = await db
                        .collection('records')
                        .space('test-space')
                        .find({ user: 2 })
                        .exec()
                        .one();

                    // assert
                    expect(result).toEqual(
                        { _id: 'd', user: 2, value: 'd0' },
                    );
                });
                test('query on another head', async () => {
                    // arrange

                    // act
                    const result = await db
                        .collection('records')
                        .space('base-space')
                        .find({ user: 1 })
                        .exec()
                        .one();

                    // assert
                    expect(result).toEqual(
                        { _id: 'a', user: 1, value: 'a0' },
                    );
                });
                test('no results', async () => {
                    // arrange

                    // act
                    const result = await db
                        .collection('records')
                        .space('test-space')
                        .find({ user: 10 })
                        .exec()
                        .all();

                    // assert
                    expect(result).toEqual([]);
                });
            });
        });
        describe('reduce', () => {
            test('base', async () => {
                // arrange

                // act
                const cursor = db
                    .collection('records')
                    .space('test-space')
                    .find({})
                    .exec<IDemoRecord>();

                // assert
                expect(cursor).toBeInstanceOf(Cursor);

                const result = await cursor.reduce((acc, record) => ({
                    users: acc.users.add(record.user),
                    values: acc.values.concat(record.value),
                }), { users: new Set<number>(), values: <string[]>[] });

                expect(result).toEqual({
                    users: new Set([1, 2]),
                    values: ['a1', 'd0'],
                });
            });
        });
    });
});
