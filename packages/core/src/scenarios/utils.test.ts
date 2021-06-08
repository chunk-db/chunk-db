import { demoStorage, TestRecord } from '../../__tests__/chunks.demo';
import { ChunkDB } from '../ChunkDB';
import { AbstractChunk } from '../chunks';
import { ChunkID } from '../common.types';
import { NotFoundChunkError } from '../storage.types';

import { call } from './scenario.types';
import { getChunk } from './utils';

describe('scenarios/utils', () => {
    let db: ChunkDB;

    beforeEach(async () => {
        db = new ChunkDB({
            storage: await demoStorage(),
            collections: [TestRecord],
        });
    });

    describe('getChunk', () => {
        function* testScenario(chunkID: ChunkID) {
            const chunk: AbstractChunk = yield call(getChunk, chunkID);
            return {
                id: chunk.id,
                type: chunk.type,
            };
        }

        test('should return chunk', async () => {
            // act
            const gen = db.run(testScenario('a1'));

            // assert
            expect(await gen.next()).toEqual({
                done: true,
                value: {
                    id: 'a1',
                    type: 'incremental',
                },
            });
        });

        test('should throw exception because chunk not exists', async () => {
            // act
            const gen = db.run(testScenario('unknown'));
            expect(gen.next())
                .rejects
                .toEqual(new NotFoundChunkError('unknown'));
        });
    });
});
