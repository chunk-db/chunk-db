import { delay } from './common';
import { SpaceID } from './common.types';
import { StorageTestDriver } from './storage-test';

describe('StorageTestDriver', () => {
    describe('checking', () => {
        it('resolve', async () => {
            // arrange
            const driver = new StorageTestDriver();
            let status = 'pending';
            let result: any;

            // act
            driver.loadSpace('test-id' as SpaceID).then(
                value => {
                    status = 'resolved';
                    result = value;
                },
                value => {
                    status = 'rejected';
                    result = value;
                }
            );

            // assert
            const action = driver.checkAction('loadSpace', 'test-id');
            expect(action.type).toEqual('loadSpace');
            expect(action.id).toEqual('test-id');
            expect(action.value).toEqual(undefined);
            expect(status).toBe('pending');

            // act
            action.resolve('result');

            // assert
            await delay();
            expect(status).toBe('resolved');
            expect(result).toBe('result');
            expect(driver.actions.length).toBe(0);
        });
        it('reject', async () => {
            // arrange
            const driver = new StorageTestDriver();
            let status = 'pending';
            let result: any;

            // act
            driver.loadSpace('test-id' as SpaceID).then(
                value => {
                    status = 'resolve';
                    result = value;
                },
                value => {
                    status = 'reject';
                    result = value;
                }
            );

            // assert
            const action = driver.checkAction('loadSpace', 'test-id');
            expect(action.type).toEqual('loadSpace');
            expect(action.id).toEqual('test-id');
            expect(action.value).toEqual(undefined);
            expect(status).toBe('pending');

            // act
            action.reject('error');

            // assert
            await delay();
            expect(status).toBe('reject');
            expect(result).toBe('error');
        });
        describe('checkAction', () => {
            it('only one action', () => {
                // arrange
                const driver = new StorageTestDriver();
                let status = 'pending';

                // act
                driver.loadSpace('test-id 2' as SpaceID);
                driver.loadChunk('test-id' as SpaceID);
                driver.loadSpace('test-id' as SpaceID).then(
                    () => (status = 'resolve'),
                    () => (status = 'reject')
                );

                // assert
                const action = driver.checkAction('loadSpace', 'test-id');
                expect(action.type).toEqual('loadSpace');
                expect(action.id).toEqual('test-id');
                expect(action.value).toEqual(undefined);
                expect(status).toBe('pending');

                expect(driver.actions.length).toEqual(2);
            });
            it('not one action', () => {
                // arrange
                const driver = new StorageTestDriver();

                // act
                driver.loadSpace('test-id 2' as SpaceID);
                driver.loadSpace('test-id' as SpaceID);
                driver.loadSpace('test-id' as SpaceID);

                // assert
                expect(() => driver.checkAction('loadSpace', 'test-id')).toThrow();
            });
        });
        describe('checkActions', () => {
            it('no actions', () => {
                // arrange
                const driver = new StorageTestDriver();

                // act
                driver.loadSpace('test-id 2' as SpaceID);
                driver.loadSpace('test-id' as SpaceID);
                driver.loadSpace('test-id' as SpaceID);

                // assert
                expect(() => driver.checkActions('saveChunk', 'test-id')).toThrow();
            });
            it('more actions', () => {
                // arrange
                const driver = new StorageTestDriver();

                // act
                driver.loadSpace('test-id 2' as SpaceID);
                driver.loadChunk('test-id' as SpaceID);
                driver.loadSpace('test-id' as SpaceID);

                // assert
                const actions = driver.checkActions('loadSpace');
                expect(actions.length).toBe(2);
                const [action1, action2] = actions;
                expect(action1.type).toEqual('loadSpace');
                expect(action1.id).toEqual('test-id 2');
                expect(action1.value).toEqual(undefined);
                expect(action2.type).toEqual('loadSpace');
                expect(action2.id).toEqual('test-id');
                expect(action2.value).toEqual(undefined);

                expect(driver.actions.length).toEqual(1);
            });
        });
    });
});
