import {
    ChunkDB,
    ChunkType,
    Cursor,
    delay,
    InMemoryChunkStorage, makeSpaceID,
    Space,
    SpaceID,
    UUID,
} from '../src';

import { allDemoChunks, IDemoRecord, TestRecord } from './chunks.demo';

describe('ChunkDB e2e tests', () => {
    let storage: InMemoryChunkStorage;
    let db: ChunkDB;
    const baseSpace = new Space({
        id: 'base-space' as SpaceID,
        name: 'initial',
        refs: {
            records: 'initial',
        },
    });
    const space = new Space({
        id: 'test-space' as SpaceID,
        name: 'a1',
        refs: {
            records: 'a1',
        },
    });
    beforeEach(async () => {
        storage = new InMemoryChunkStorage();
        storage.reset(allDemoChunks);
        storage.saveSpace(baseSpace);
        storage.saveSpace(space);
        db = new ChunkDB({
            storage,
            collections: [
                TestRecord,
            ],
        });
    });

    describe('fetch data', () => {
        describe('find (by collection)', () => {
            describe('all', () => {
                test('all', async () => {
                    // arrange

                    // act
                    const cursor = db
                        .collection(TestRecord)
                        .space('test-space' as SpaceID)
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
                        .collection(TestRecord)
                        .space('test-space' as SpaceID)
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
                        .collection(TestRecord)
                        .space('base-space' as SpaceID)
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
                        .collection(TestRecord)
                        .space('test-space' as SpaceID)
                        .find({ user: 10 })
                        .exec()
                        .all();

                    // assert
                    expect(result).toEqual([]);
                });
            });
        });
        describe('find (by space)', () => {
            describe('all', () => {
                test('all', async () => {
                    // arrange

                    // act
                    const cursor = db
                        .space('test-space' as SpaceID)
                        .collection(TestRecord)
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
                        .space('test-space' as SpaceID)
                        .collection(TestRecord)
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
                        .collection(TestRecord)
                        .space('base-space' as SpaceID)
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
                        .collection(TestRecord)
                        .space('test-space' as SpaceID)
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
                    .collection(TestRecord)
                    .space('test-space' as SpaceID)
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
        describe('errors', () => {
            test('find in null space', async () => {
                // arrange

                // act
                const cursor = db
                    .space(makeSpaceID(''))
                    .collection(TestRecord)
                    .find({})
                    .exec();

                // assert
                expect(cursor).toBeInstanceOf(Cursor);

                const result = await cursor.all();

                expect(result).toEqual([]);
            });
            test('find in unknown collection', async () => {
                // arrange

                // act
                const cursor = db
                    .space(makeSpaceID('test-space'))
                    .collection('unknown' as any)
                    .find({})
                    .exec();

                // assert
                expect(cursor).toBeInstanceOf(Cursor);

                const result = await cursor.all();

                expect(result).toEqual([]);
            });
        });
    });
    describe('change data', () => {
        describe('add records', () => {
            it('read and write one record (sync)', async () => {
                // arrange
                const refBefore = space.refs[TestRecord.name];
                let id: UUID = '';

                // act
                const event = await db.transaction(space.id, async tx => {
                    const record = await tx.collection(TestRecord).findOne({ user: 1 });
                    expect(record).toEqual({
                        _id: 'a',
                        user: 1,
                        value: 'a1',
                    });

                    const insertedRecord = await tx.insert(TestRecord, {
                        user: 3,
                        value: 'some value',
                    });

                    id = insertedRecord._id;
                });

                const records = await db.collection(TestRecord).space(space.id).findAll({ user: 3 });
                const newSpace = db.spaces.getLoaded(space.id)!;
                expect(space.refs).not.toBe(newSpace.refs);
                expect(space.refs).not.toEqual(newSpace.refs);
                expect(newSpace.refs[TestRecord.name]).not.toBe(refBefore);
                expect(db.storage.getExists(newSpace.refs[TestRecord.name])).toBeTruthy();

                // assert
                expect(records.length).toBe(1);
                expect(records[0].value).toBe('some value');
                expect(event).toEqual({
                    deleted: [],
                    inserted: [id],
                    updated: [],
                    upserted: [id],
                });
            });

            // isolation in transaction
            it('isolation', async () => {
                // arrange
                let id: UUID = '';

                // act
                const event = await db.transaction(space.id, async tx => {
                    // insert record
                    const record = await tx.insert(TestRecord, {
                        user: 8,
                        value: 'value',
                    });
                    id = record._id;

                    await delay(10);

                    // emulate query out from transaction in the middle of transaction
                    const recordsFromOut = await db.space(space.id).collection(TestRecord).findAll({ user: 8 });
                    expect(recordsFromOut.length).toBe(0);

                    // query in the transaction
                    const recordsFromTx = await tx.collection(TestRecord).findAll({ user: 8 });
                    expect(recordsFromTx).toEqual([{
                        _id: record._id,
                        user: 8,
                        value: 'value',
                    }]);

                    await delay(10);

                    // continue transaction
                    await tx.upsert(TestRecord, {
                        ...record,
                        value: 'new value',
                    });
                });
                const records = await db.collection(TestRecord).space(space.id).findAll({ user: 8 });

                // assert
                expect(records.length).toBe(1);
                expect(records[0].value).toBe('new value');
                expect(event).toEqual({
                    deleted: [],
                    inserted: [id],
                    updated: [],
                    upserted: [id],
                });
            });

            // isolation in parallels transactions

            // conflict in transactions
        });
    });
    describe('chunks', () => {
        test('first chunk must be Snapshot', async () => {
            // act
            const spaceId = db.spaces.create({ name: 'test' }).id;
            db.spaces.save(spaceId);
            await db.transaction(spaceId, async tx => {
                await tx.insert(TestRecord, {
                    _id: '123',
                    value: '102',
                    user: 101,
                });
            });

            // assert
            const space = db.spaces.getLoaded(spaceId)!;
            const chunk = db.storage.getExists(space.refs.records);
            expect(chunk?.type).toEqual(ChunkType.Snapshot);
        });
        test('small changes must made Incremental chunk', async () => {
            // act
            await db.transaction(space.id, async tx => {
                await tx.upsert(TestRecord, {
                    _id: 'a',
                    user: 1,
                    value: 'a2',
                });
            });

            // assert
            const updatedSpace = db.spaces.getLoaded(space.id)!;
            const chunk = db.storage.getExists(updatedSpace.refs.records);
            expect(chunk!.type).toEqual(ChunkType.Incremental);
        });
    });
});
