/* eslint-disable import/order */
import { demoStorage, IDemoRecord } from '../__tests__/chunks.demo';
import { ChunkDB } from './ChunkDB';
import { InMemoryChunkStorage } from './inmemory-storage';
import { call, getStorage, ScenarioContext } from './scenarios/scenario.types';

describe('ChunkDB', () => {
    describe('run', () => {
        let db: ChunkDB<{ records: IDemoRecord }>;
        let storage: InMemoryChunkStorage;
        beforeEach(async () => {
            storage = await demoStorage();
            db = new ChunkDB({
                storage,
                collections: {
                    records: {
                        factory(data: any): IDemoRecord {return data;},
                    },
                },
            });
        });

        async function increment(this: ScenarioContext, value: number): Promise<any> {
            return value + 1;
        }

        test('should return any value', async () => {
            function* testFunc() {
                yield 'storage';
                return 'storage return';
            }

            const gen = db.run(testFunc());
            expect(await gen.next()).toEqual({
                done: false,
                value: 'storage',
            });
            expect(await gen.next()).toEqual({
                done: true,
                value: 'storage return',
            });
        });

        test('should return call', async () => {
            function* testFunc() {
                const x = yield call(increment, 1);
                yield x;
                return call(increment, 2);
            }

            const gen = db.run(testFunc());
            expect(await gen.next()).toEqual({
                done: false,
                value: 2,
            });
            expect(await gen.next()).toEqual({
                done: true,
                value: 3,
            });
        });

        test('should receive storage', async () => {
            function* testFunc() {
                const storage = yield call(getStorage);
                yield storage;
                return call(increment, 1);
            }

            const gen = db.run(testFunc());
            expect(await gen.next()).toEqual({
                done: false,
                value: db.storage,
            });
            expect(await gen.next()).toEqual({
                done: true,
                value: 2,
            });
        });
    });
});
