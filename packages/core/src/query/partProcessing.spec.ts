import { FilterQuery } from './Query.types';
import { partToPipeOperator } from './partProcessing';

describe('partProcessing', () => {
    describe('partToPipeOperator', () => {
        describe('filter', () => {
            const testRecord = Object.freeze({
                id: 1,
                name: 'test',
            });

            it('base', () => {
                // arrange
                const fn: FilterQuery<any> = jest.fn(() => true);

                // act
                const op = partToPipeOperator({
                    type: 'filter',
                    value: fn,
                });
                const result = op(testRecord);

                // assert
                console.log(fn.mock.calls[0]);
                expect(fn.mock.calls.length).toBe(1);
                expect(fn.mock.calls[0][0]).toBe(testRecord);
                expect(result).toBe(testRecord);
            });
        });
    });
});
