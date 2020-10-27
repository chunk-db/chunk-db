import { demoStorage, IDemoRecord } from '../__tests__/chunks.demo';
import { Tag } from './Tag';
import { arrayToMap } from './chunks/utils';
import { ChunkDB } from './ChunkDB';

describe('Tag', () => {
    let db: ChunkDB;
    let tag: Tag<IDemoRecord>;

    beforeEach(async () => {
        db = new ChunkDB({
            storage: await demoStorage(),
            collections: {},
        });
    });

    it('findAll', async () => {
        // arrange
        tag = new Tag(db, 'a1');

        // act
        const result = await tag.findAll();

        // assert
        const map = arrayToMap(result);
        expect(map.size).toBe(2);
        expect(map.get('a')).toEqual({ _id: 'a', user: 1, value: 'a1' });
        expect(map.get('d')).toEqual({ _id: 'd', user: 2, value: 'd0' });
    });
});
