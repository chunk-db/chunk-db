import { demoStorage, TestRecord } from '../../__tests__/chunks.demo';
import { ChunkDB } from '../ChunkDB';
import { IQuery } from '../ConditionValidator';
import { makeChunkID } from '../common.types';

import { findBruteForce } from './findBruteForce';

describe('findBruteForce', () => {
    let db: ChunkDB;
    beforeEach(async () => {
        db = new ChunkDB({
            storage: await demoStorage(),
            collections: [TestRecord],
        });
    });

    test('base', async () => {
        // arrange

        // act
        const gen = db.run(findBruteForce(() => Promise.resolve([makeChunkID('a1')]), TestRecord));

        // assert
        expect(await gen.next()).toEqual({
            done: false,
            value: {
                chunkIDs: ['a1'],
                records: new Map([['a', { _id: 'a', user: 1, value: 'a1' }]]),
            },
        });
        expect(await gen.next()).toEqual({
            done: true,
            value: {
                chunkIDs: ['initial'],
                records: new Map([['d', { _id: 'd', user: 2, value: 'd0' }]]),
            },
        });
    });

    test('query', async () => {
        // arrange

        // act
        const gen = db.run(
            findBruteForce(() => Promise.resolve([makeChunkID('a1')]), TestRecord, { user: 2 } as IQuery)
        );

        // assert
        expect(await gen.next()).toEqual({
            done: false,
            value: {
                chunkIDs: ['a1'],
                records: new Map(),
            },
        });
        expect(await gen.next()).toEqual({
            done: true,
            value: {
                chunkIDs: ['initial'],
                records: new Map([['d', { _id: 'd', user: 2, value: 'd0' }]]),
            },
        });
    });

    test('query invalid', async () => {
        // arrange

        // act
        const gen = db.run(
            findBruteForce(() => Promise.resolve([makeChunkID('a1')]), TestRecord, { user: 10 } as IQuery)
        );

        // assert
        expect(await gen.next()).toEqual({
            done: false,
            value: {
                chunkIDs: ['a1'],
                records: new Map(),
            },
        });
        expect(await gen.next()).toEqual({
            done: true,
            value: {
                chunkIDs: ['initial'],
                records: new Map(),
            },
        });
    });

    test('query on another head', async () => {
        // arrange

        // act
        const gen = db.run(
            findBruteForce(() => Promise.resolve([makeChunkID('initial')]), TestRecord, { user: 1 } as IQuery)
        );

        // assert
        expect(await gen.next()).toEqual({
            done: true,
            value: {
                chunkIDs: ['initial'],
                records: new Map([['a', { _id: 'a', user: 1, value: 'a0' }]]),
            },
        });
    });
});
