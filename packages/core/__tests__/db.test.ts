import { ChunkDB, ChunkType, Cursor, delay, InMemoryChunkStorage, makeSpaceID, Model, Space, UUID } from '../src';

import { allDemoChunks, IDemoRecord, TestRecord } from './chunks.demo';
import { Query } from '@chunk-db/core';

describe('ChunkDB e2e tests', () => {
    let storage: InMemoryChunkStorage;
    let db: ChunkDB;
    const baseSpace = new Space({
        id: makeSpaceID('base-space'),
        name: 'initial',
        ref: 'initial',
    });
    const space = new Space({
        id: makeSpaceID('test-space'),
        name: 'a1',
        ref: 'a1',
    });
    const spaceX = new Space({
        id: makeSpaceID('space-x'),
        name: 'x1',
        ref: 'x1',
    });
    beforeEach(async () => {
        storage = new InMemoryChunkStorage();
        storage.reset(allDemoChunks);
        storage.saveSpace(baseSpace);
        storage.saveSpace(space);
        storage.saveSpace(spaceX);
        db = new ChunkDB({
            storage,
            collections: [TestRecord],
        });
    });

    describe('fetch data', () => {
        describe('find (by collection)', () => {
            describe('all', () => {
                test('all', async () => {
                    // act
                    const cursor = db.query(new Query(TestRecord).find({}));
                    // .space(makeSpaceID('test-space'))

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
                    const result = await db.query(new Query(TestRecord).find({ user: 2 })).one();
                    // .space(makeSpaceID('test-space'))

                    // assert
                    expect(result).toEqual({ _id: 'd', user: 2, value: 'd0' });
                });
                test('query on another head', async () => {
                    // arrange

                    // act
                    const result = await db.query(new Query(TestRecord).find({ user: 1 }).one());
                    // .space(makeSpaceID('base-space'))

                    // assert
                    expect(result).toEqual({ _id: 'a', user: 1, value: 'a0' });
                });
                test('no results', async () => {
                    // arrange

                    // act
                    const result = await db
                        .collection(TestRecord)
                        .space(makeSpaceID('test-space'))
                        .find({ user: 10 })
                        .exec()
                        .all();

                    // assert
                    expect(result).toEqual([]);
                });
            });
        });
        describe('reduce', () => {
            // test('base', async () => {
            //     // arrange
            //
            //     // act
            //     const cursor = db.collection(TestRecord).space(makeSpaceID('test-space')).find({}).exec<IDemoRecord>();
            //
            //     // assert
            //     expect(cursor).toBeInstanceOf(Cursor);
            //
            //     const result = await cursor.reduce(
            //         (acc, record) => ({
            //             users: acc.users.add(record.user),
            //             values: acc.values.concat(record.value),
            //         }),
            //         { users: new Set<number>(), values: <string[]>[] }
            //     );
            //
            //     expect(result).toEqual({
            //         users: new Set([1, 2]),
            //         values: ['a1', 'd0'],
            //     });
            // });
        });
        describe('errors', () => {
            test('find in null space', async () => {
                expect(() => db.space(makeSpaceID('')).collection(TestRecord).find({}).exec()).toThrowError(
                    `Invalid space ""`
                );
            });
            test('find in unregistered collection', async () => {
                const UnregisteredModel = new Model<any>('unknown', {
                    uuid: '_id',
                    factory: data => data,
                    indexes: {},
                });

                expect(() =>
                    db.space(makeSpaceID('test-space')).collection(UnregisteredModel).find({}).exec()
                ).toThrowError(`Unregistered collection "unknown"`);
            });
            test('find in invalid collection', async () => {
                expect(() =>
                    db
                        .space(makeSpaceID('test-space'))
                        .collection('unknown' as any)
                        .find({})
                        .exec()
                ).toThrowError(`Scheme must be instance of Model`);
            });
        });
    });
    describe('fetch from multi sid', () => {
        test('some records from multi sid', async () => {
            // arrange
            const space1 = makeSpaceID('test-space');
            const space2 = makeSpaceID('space-x');

            // act
            const cursor = db.collection(TestRecord).space([space1, space2]).find({}).exec();

            // assert
            expect(cursor).toBeInstanceOf(Cursor);

            const result = await cursor.all();

            expect(result).toEqual([
                { _id: 'a', user: 1, value: 'a1' },
                { _id: 'x', user: 101, value: 'x1' },
                { _id: 'd', user: 2, value: 'd0' },
            ]);
        });
    });
    describe('change data', () => {
        describe('add records', () => {
            it('read and write one record (sync)', async () => {
                // arrange
                const refBefore = space.ref;
                let id: UUID = '';

                // act
                const event = await db.transaction(space.id, async tx => {
                    const record = await tx.collection(TestRecord).findOne({ user: 1 });
                    expect(record).toEqual({
                        _id: 'a',
                        user: 1,
                        value: 'a1',
                    });

                    const insertedRecord = await tx.upsert(TestRecord, {
                        _id: 'c',
                        user: 3,
                        value: 'some value',
                    });

                    id = insertedRecord._id;
                });

                const records = await db.collection(TestRecord).space(space.id).findAll({ user: 3 });
                const newSpace = db.spaces.getLoaded(space.id)!;
                expect(space.ref).not.toEqual(newSpace.ref);
                expect(newSpace.ref).not.toBe(refBefore);
                expect(db.storage.getExists(newSpace.ref)).toBeTruthy();

                // assert
                expect(records.length).toBe(1);
                expect(records[0].value).toBe('some value');
                expect(event).toEqual({
                    deleted: [],
                    inserted: [],
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
                    const record = await tx.upsert(TestRecord, {
                        _id: 'c',
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
                    expect(recordsFromTx).toEqual([
                        {
                            _id: record._id,
                            user: 8,
                            value: 'value',
                        },
                    ]);

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
                    inserted: [],
                    updated: [],
                    upserted: [id],
                });
            });

            // isolation in parallels transactions

            // conflict in transactions
        });
        describe('remove records', () => {
            it('remove record by UUID', async () => {
                // arrange
                const refBefore = space.ref;

                // act
                const event = await db.transaction(space.id, async tx => {
                    await tx.remove(TestRecord, 'd');
                });

                const records = await db.collection(TestRecord).space(space.id).findAll({});
                const newSpace = db.spaces.getLoaded(space.id)!;
                expect(space.ref).not.toEqual(newSpace.ref);
                expect(newSpace.ref).not.toBe(refBefore);
                expect(db.storage.getExists(newSpace.ref)).toBeTruthy();

                // assert
                expect(records.length).toBe(1);
                expect(records[0].value).toBe('a1');
                expect(event).toEqual({
                    deleted: ['d'],
                    inserted: [],
                    updated: [],
                    upserted: [],
                });
            });
        });
    });
    describe('chunks', () => {
        test('first chunk must be Snapshot', async () => {
            // act
            const spaceId = db.spaces.create({ name: 'test' }).id;
            db.spaces.save(spaceId);
            await db.transaction(spaceId, async tx => {
                await tx.upsert(TestRecord, {
                    _id: '123',
                    value: '102',
                    user: 101,
                });
            });

            // assert
            const space = db.spaces.getLoaded(spaceId)!;
            const chunk = db.storage.getExists(space.ref);
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
            const chunk = db.storage.getExists(updatedSpace.ref);
            expect(chunk!.type).toEqual(ChunkType.Incremental);
        });
    });
});
