import { demoStorage, TestRecord } from '../../__tests__/chunks.demo';
import { ChunkDB } from '../ChunkDB';
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

    test('scan chunks', async () => {
        // arrange

        // act
        const gen = db.run(findBruteForce([makeChunkID('a1')], TestRecord));

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
                records: new Map([
                    ['a', { _id: 'a', user: 1, value: 'a0' }],
                    ['d', { _id: 'd', user: 2, value: 'd0' }],
                ]),
            },
        });
    });

    test('query on another head', async () => {
        // arrange

        // act
        const gen = db.run(findBruteForce([makeChunkID('initial')], TestRecord));

        // assert
        expect(await gen.next()).toEqual({
            done: true,
            value: {
                chunkIDs: ['initial'],
                records: new Map([
                    ['a', { _id: 'a', user: 1, value: 'a0' }],
                    ['d', { _id: 'd', user: 2, value: 'd0' }],
                ]),
            },
        });
    });

    test('empty space', async () => {
        // act
        const gen = db.run(findBruteForce([makeChunkID('')], TestRecord));

        // assert
        expect(await gen.next()).toEqual({
            done: true,
            value: {
                chunkIDs: [],
            },
        });
    });
});
