import { ChunkDB } from './ChunkDB';
import { demoStorage } from '../__tests__/chunks.demo';
import { ChunkID } from './common';
import { call, getChunk } from './scenarios/scenario';
import { AbstractChunk, ChunkType } from './chunks/AbstractChunk';

describe('ChunkDB', () => {
    let db: ChunkDB;
    describe('run', () => {
        beforeEach(async () => {
            db = new ChunkDB({
                storage: await demoStorage(),
                collections: {}
            });
        });

        function* testScenario(chunkID: ChunkID) {
            console.log(chunkID);
            const chunk: AbstractChunk = yield call(getChunk, chunkID);
            console.log(chunk);
            return {
                id: chunk.id,
                type: chunk.type
            };
        }

        test('base', async () => {
            // arrange

            // act
            const result = await db.run(testScenario, 'a1');

            // assert
            expect(result).toEqual({
                id: 'a1',
                type: ChunkType.Incremental
            });
        });
    });
});
