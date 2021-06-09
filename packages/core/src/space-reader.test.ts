import {
    demoStorage,
    IDemoRecord,
    TestRecord,
} from '../__tests__/chunks.demo';

import { ChunkDB } from './ChunkDB';
import { arrayToMap } from './chunks';
import { SpaceID } from './common.types';
import { Space } from './space';
import { SpaceReader } from './space-reader';

describe('SpaceReader', () => {
    let db: ChunkDB;
    let reader: SpaceReader<IDemoRecord>;
    const space = new Space({
        id: 'test-space' as SpaceID,
        name: 'test',
        ref: 'a1',
    });

    beforeEach(async () => {
        db = new ChunkDB({
            storage: await demoStorage(),
            collections: [TestRecord],
        });

        db.spaces.create(space);
        db.spaces.save(space.id);
    });

    it('findAll', async () => {
        // arrange
        reader = db.collection(TestRecord).space('test-space' as SpaceID);

        // act
        const result = await reader.findAll({});

        // assert
        const map = arrayToMap(result);
        expect(map.size).toBe(2);
        expect(map.get('a')).toEqual({ _id: 'a', user: 1, value: 'a1' });
        expect(map.get('d')).toEqual({ _id: 'd', user: 2, value: 'd0' });
    });
});
