import { demoStorage, IDemoRecord } from '../../__tests__/chunks.demo';
import { ChunkDB } from '../ChunkDB';
import { IQuery } from '../ConditionValidator';

import { findBruteForce } from './findBruteForce';


describe('findBruteForce', () => {
    let db: ChunkDB<{ records: IDemoRecord }>;
    beforeEach(async () => {
        db = new ChunkDB({
            storage: await demoStorage(),
            collections: {
                records: {
                    factory(data: any): IDemoRecord {return data;},
                },
            },
        });
    });

    test('base', async () => {
        // arrange

        // act
        const gen = db.run(findBruteForce(() => Promise.resolve('a1')));

        // assert
        expect(await gen.next()).toEqual({
            done: false,
            value: {
                chunkID: 'a1',
                records: [
                    { _id: 'a', user: 1, value: 'a1' },
                ],
            },
        });
        expect(await gen.next()).toEqual({
            done: true,
            value: {
                chunkID: 'initial',
                records: [
                    { _id: 'd', user: 2, value: 'd0' },
                ],
            },
        });
    });

    test('query', async () => {
        // arrange

        // act
        const gen = db.run(findBruteForce(() => Promise.resolve('a1'), { user: 2 } as IQuery));

        // assert
        expect(await gen.next()).toEqual({
            done: false,
            value: {
                chunkID: 'a1',
                records: [],
            },
        });
        expect(await gen.next()).toEqual({
            done: true,
            value: {
                chunkID: 'initial',
                records: [
                    { _id: 'd', user: 2, value: 'd0' },
                ],
            },
        });
    });

    test('query invalid', async () => {
        // arrange

        // act
        const gen = db.run(findBruteForce(() => Promise.resolve('a1'), { user: 10 } as IQuery));

        // assert
        expect(await gen.next()).toEqual({
            done: false,
            value: {
                chunkID: 'a1',
                records: [],
            },
        });
        expect(await gen.next()).toEqual({
            done: true,
            value: {
                chunkID: 'initial',
                records: [],
            },
        });
    });

    test('query on another head', async () => {
        // arrange

        // act
        const gen = db.run(findBruteForce(() => Promise.resolve('initial'), { user: 1 } as IQuery));

        // assert
        expect(await gen.next()).toEqual({
            done: true,
            value: {
                chunkID: 'initial',
                records: [
                    { _id: 'a', user: 1, value: 'a0' },
                ],
            },
        });
    });
});
