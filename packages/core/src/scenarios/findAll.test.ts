import { ChunkDB } from '../ChunkDB';
import { demoStorage } from '../../__tests__/chunks.demo';
import { findAll } from './findAll';
import { IQuery } from '../Query';

describe('findAll', () => {
    let db: ChunkDB;
    beforeEach(async () => {
        db = new ChunkDB({
            storage: await demoStorage(),
            collections: {},
        });
    });

    test('base', async () => {
        // arrange

        // act
        const result = await db.run(findAll, 'a1');

        // assert
        expect(result).toEqual([
            { _id: 'a', user: 1, value: 'a1' },
            { _id: 'd', user: 2, value: 'd0' },
        ]);
    });

    test('query', async () => {
        // arrange

        // act
        const result = await db.run(findAll, 'a1', { user: 2 } as IQuery);

        // assert
        expect(result).toEqual([
            { _id: 'd', user: 2, value: 'd0' },
        ]);
    });

    test('query invalid', async () => {
        // arrange

        // act
        const result = await db.run(findAll, 'a1', { user: 10 } as IQuery);

        // assert
        expect(result).toEqual([]);
    });

    test('query on another head', async () => {
        // arrange

        // act
        const result = await db.run(findAll, 'initial', { user: 1 } as IQuery);

        // assert
        expect(result).toEqual([
            { _id: 'a', user: 1, value: 'a0' },
        ]);
    });

    test('cursor', async () => {
        // arrange


        // act
        const result = await db.run(findAll, 'initial', { user: 1 });

        // assert
        expect(result).toEqual([
            { _id: 'a', user: 1, value: 'a0' },
        ]);
    });
});
