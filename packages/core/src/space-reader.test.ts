import { demoStorage, IDemoRecord } from '../__tests__/chunks.demo';
import { ChunkDB } from './ChunkDB';
import { arrayToMap } from './chunks/utils';
import { Space } from './space';
import { SpaceReader } from './space-reader';

describe('SpaceReader', () => {
    let db: ChunkDB<{ records: IDemoRecord }>;
    let reader: SpaceReader<IDemoRecord>;
    const space = new Space<{ records: IDemoRecord }>({
        id: 'test-space',
        name: 'test',
        refs: {
            records: 'a1',
        },
    });

    beforeEach(async () => {
        db = new ChunkDB({
            storage: await demoStorage(),
            collections: {
                records: {
                    factory(data: any): IDemoRecord {return data;},
                },
            },
        });

        db.spaces.set(space.id, space);
    });

    it('findAll', async () => {
        // arrange
        reader = db.collection('records').space('test-space');

        // act
        const result = await reader.findAll({});

        // assert
        const map = arrayToMap(result);
        expect(map.size).toBe(2);
        expect(map.get('a')).toEqual({ _id: 'a', user: 1, value: 'a1' });
        expect(map.get('d')).toEqual({ _id: 'd', user: 2, value: 'd0' });
    });
});
