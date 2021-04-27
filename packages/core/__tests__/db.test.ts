import { ChunkDB } from '../src/ChunkDB';
import { delay } from '../src/common';
import { SpaceID, UUID } from '../src/common.types';
import { Cursor } from '../src/cursor';
import { InMemoryChunkStorage } from '../src/in-memory-chunk-storage';
import { Space } from '../src/space';

import { allDemoChunks, IDemoRecord } from './chunks.demo';

describe('ChunkDB e2e tests', () => {
    let storage: InMemoryChunkStorage;
    let db: ChunkDB<{ records: IDemoRecord }>;
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
        db.spaces.set(baseSpace.id, { ...baseSpace });
        db.spaces.set(space.id, { ...space });
    });

    describe('fetch data', () => {
        describe('find', () => {
            describe('all', () => {
                test('all', async () => {
                    // arrange

                    // act
                    const cursor = db
                        .collection('records')
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
                        .collection('records')
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
                        .collection('records')
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
                        .collection('records')
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
                    .collection('records')
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
    });
    describe('change data', () => {
        describe('add records', () => {
            it('read and write one record (sync)', async () => {
                // arrange
                const refBefore = space.refs['records'];
                let id: UUID = '';

                // act
                const event = await db.transaction(space.id, async tx => {
                    const record = await tx.collection('records').findOne({ user: 1 });
                    expect(record).toEqual({
                        _id: 'a',
                        user: 1,
                        value: 'a1',
                    });

                    const insertedRecord = await tx.insert('records', {
                        user: 3,
                        value: 'some value',
                    });

                    id = insertedRecord._id;
                });

                const records = await db.collection('records').space(space.id).findAll({ user: 3 });
                const newSpace = db.spaces.get(space.id)!;
                expect(space.refs).not.toBe(newSpace.refs);
                expect(space.refs).not.toEqual(newSpace.refs);
                expect(newSpace.refs['records']).not.toBe(refBefore);
                expect(db.storage.getExists(newSpace.refs['records'])).toBeTruthy();

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
                    const record = await tx.insert('records', {
                        user: 8,
                        value: 'value',
                    });
                    id = record._id;

                    await delay(10);

                    // emulate query out from transaction in the middle of transaction
                    const recordsFromOut = await db.collection('records').space(space.id).findAll({ user: 8 });
                    expect(recordsFromOut.length).toBe(0);

                    // query in the transaction
                    const recordsFromTx = await tx.collection('records').findAll({ user: 8 });
                    expect(recordsFromTx).toEqual([{
                        _id: record._id,
                        user: 8,
                        value: 'value',
                    }]);

                    await delay(10);

                    // continue transaction
                    await tx.upsert('records', {
                        ...record,
                        value: 'new value',
                    });
                });
                const records = await db.collection('records').space(space.id).findAll({ user: 8 });

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
});
