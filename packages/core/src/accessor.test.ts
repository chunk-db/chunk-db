import { IDemoRecord } from '../__tests__/chunks.demo';

import { ChunkDB } from './ChunkDB';
import { IGenericChunk } from './chunks/ChunkFactory';
import { SpaceID } from './common.types';
import { ISpace, Space } from './space';
import { StorageTestDriver } from './storage-test';

describe('accessor', () => {
    jest.setTimeout(1000);

    let driver: StorageTestDriver;
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
        driver = new StorageTestDriver();
        db = new ChunkDB({
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
        db.spaces.set(baseSpace.id, { ...baseSpace });
        db.spaces.set(space.id, { ...space });
    });
    afterEach(() => {
        driver.verify();
    });
    describe('upsert', () => {
        test('insert new', async () => {
            // arrange
            const recordToSave: IDemoRecord = {
                _id: '123',
                user: 3,
                value: 'some value',
            };
            let insertedRecord: IDemoRecord;

            // act
            const event = await db.transaction(space.id, async tx => {
                insertedRecord = await tx.upsert('records', recordToSave);
            });

            // assert
            // step 1: save empty chunk
            const action1 = driver.checkAction('saveChunk');
            const chunkID = action1.id;
            const chunk1: IGenericChunk = action1.value as any;
            expect(chunk1.records).toEqual({
                [recordToSave._id]: recordToSave,
            });
            await action1.resolve(chunk1);

            // step 2: save empty chunk
            const action2 = driver.checkAction('saveSpace', space.id);
            const chunk2: ISpace = action2.value as any;
            expect(chunk2.refs['records']).toEqual(chunkID);
            action2.resolve(chunk2);

            const newSpace = db.spaces.get(space.id)!;
            expect(space.refs).not.toBe(newSpace.refs);
            expect(space.refs).not.toEqual(newSpace.refs);

            expect(event).toEqual({
                deleted: [],
                inserted: [],
                // inserted: [insertedRecord!._id], TODO
                updated: [],
                upserted: [insertedRecord!._id],
            });
        });
        // test('update exists', () => { fail('Test is not implements'); });
    });
    describe('insert', () => {
        test('insert record in first chunk', async () => {
            const space = new Space<{ records: IDemoRecord }>({
                id: 'some-space' as SpaceID,
                name: 'initial',
                refs: {
                    records: '',
                },
            });
            db.spaces.set(space.id, space);

            // arrange
            const recordToSave: IDemoRecord = {
                _id: '123',
                user: 3,
                value: 'some value',
            };
            let insertedRecord: IDemoRecord;

            // act
            const event = await db.transaction(space.id, async tx => {
                insertedRecord = await tx.insert('records', recordToSave);
            });

            // assert
            // step 1: save empty chunk
            const action1 = driver.checkAction('saveChunk');
            const chunkID = action1.id;
            const chunk1: IGenericChunk = action1.value as any;
            expect(chunk1.parents).toEqual([]);
            expect(chunk1.records).toEqual({
                [recordToSave._id]: recordToSave,
            });
            await action1.resolve(chunk1);

            // step 2: save empty chunk
            const action2 = driver.checkAction('saveSpace', space.id);
            const chunk2: ISpace = action2.value as any;
            expect(chunk2.refs['records']).toEqual(chunkID);
            action2.resolve(chunk2);

            const newSpace = db.spaces.get(space.id)!;
            expect(space.refs).not.toBe(newSpace.refs);
            expect(space.refs).not.toEqual(newSpace.refs);

            expect(event).toEqual({
                deleted: [],
                // inserted: [],
                inserted: [insertedRecord!._id],
                updated: [],
                upserted: [insertedRecord!._id],
            });
        });
        // test('insert new', () => { fail('Test is not implements'); });
        // test('failed to update exists', () => { fail('Test is not implements'); });
    });
    describe('update', () => {
        // test('failed to insert new', () => { fail('Test is not implements'); });
        // test('update exists', () => { fail('Test is not implements'); });
    });
    describe('conflicts', () => {
        // test('2 transactions run at same time and change 1 record', () => { fail('Test is not implements'); });
    });
});
