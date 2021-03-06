import { IDemoRecord, TestRecord } from '../__tests__/chunks.demo';

import { ChunkDB } from './ChunkDB';
import { IGenericChunk } from './chunks';
import { delay } from './common';
import { makeSpaceID } from './common.types';
import { ISpace, Space } from './space';
import { StorageTestDriver } from './storage-test';

describe('accessor', () => {
    jest.setTimeout(1000);

    let driver: StorageTestDriver;
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
    beforeEach(async () => {
        driver = new StorageTestDriver();
        db = new ChunkDB({
            cache: null,
            storage: driver,
            collections: [TestRecord],
        });
        db.spaces.create(baseSpace);
        db.spaces.create(space);
        db.spaces.save(baseSpace.id);
        db.spaces.save(space.id);
        driver.actions.length = 0;
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
            const eventPromise = db.transaction(space.id, async tx => {
                insertedRecord = await tx.upsert(TestRecord, recordToSave);
            });

            // assert
            await delay(1);

            // step 0: load space
            const action0 = driver.checkAction('loadSpace');
            expect(action0.id).toBe(space.id);
            await action0.resolve(space);

            await delay(1);

            // step 1: save empty chunk
            const action1 = driver.checkAction('saveChunk');
            const chunkID = action1.id;
            const chunk1: IGenericChunk = action1.value as any;
            expect(chunk1.data).toEqual({
                records: {
                    [recordToSave._id]: recordToSave,
                },
            });
            await action1.resolve(chunk1);

            await delay(1);

            // step 2: save empty chunk
            const action2 = driver.checkAction('saveSpace', space.id);
            const chunk2: ISpace = action2.value as any;
            expect(chunk2.ref).toEqual(chunkID);
            action2.resolve(chunk2);

            const newSpace = db.spaces.getLoaded(space.id)!;
            expect(space.ref).not.toEqual(newSpace.ref);

            const event = await eventPromise;
            expect(event).toEqual({
                deleted: [],
                inserted: [],
                // inserted: [insertedRecord!._id], TODO
                updated: [],
                upserted: [insertedRecord!._id],
            });
        });
        // test('update exists', () => { fail('Test is not implements'); });
        test('insert record in first chunk', async () => {
            const space = new Space({
                id: makeSpaceID('some-space'),
                name: 'initial',
                ref: '',
            });
            db.spaces.create(space);

            // arrange
            const recordToSave: IDemoRecord = {
                _id: '123',
                user: 3,
                value: 'some value',
            };
            let insertedRecord: IDemoRecord;

            // act
            const eventPromise = db.transaction(space.id, async tx => {
                insertedRecord = await tx.upsert(TestRecord, recordToSave);
            });

            // assert
            await delay(1);

            // step 0: load space
            const action0 = driver.checkAction('loadSpace');
            expect(action0.id).toBe(space.id);
            await action0.resolve(space);

            await delay(1);

            // step 1: save empty chunk
            const action1 = driver.checkAction('saveChunk');
            const chunkID = action1.id;
            const chunk1: IGenericChunk = action1.value as any;
            expect(chunk1.parents).toEqual([]);
            expect(chunk1.data).toEqual({
                records: {
                    [recordToSave._id]: recordToSave,
                },
            });
            await action1.resolve(chunk1);

            await delay(1);

            // step 2: save empty chunk
            const action2 = driver.checkAction('saveSpace', space.id);
            const chunk2: ISpace = action2.value as any;
            expect(chunk2.ref).toEqual(chunkID);
            action2.resolve(chunk2);

            const newSpace = db.spaces.getLoaded(space.id)!;
            expect(space.ref).not.toEqual(newSpace.ref);

            const event = await eventPromise;
            expect(event).toEqual({
                deleted: [],
                // inserted: [],
                inserted: [],
                updated: [],
                upserted: [insertedRecord!._id],
            });
        });
        // test('insert new', () => { fail('Test is not implements'); });
        // test('failed to update exists', () => { fail('Test is not implements'); });
    });
    describe('conflicts', () => {
        // test('2 transactions run at same time and change 1 record', () => { fail('Test is not implements'); });
    });
});
