import { makePipeByParts } from './partProcessing';

describe('partProcessing', () => {
    describe('makePipeByParts', () => {
        it('allow in right order', () => {
            const testRecord = Object.freeze({
                id: 1,
                name: 'test',
            });

            // act
            const order: string[] = [];
            const filter = jest.fn(_ => {
                order.push('filter');
                return true;
            });
            const map = jest.fn(record => {
                order.push('map');
                return { ...record };
            });

            const pipe = makePipeByParts([
                {
                    type: 'filter',
                    value: filter,
                },
                {
                    type: 'map',
                    value: map,
                },
            ]);
            const result = pipe(testRecord, { id: 1 });

            // assert
            expect(result).not.toBe(testRecord);
            expect(result).toEqual(testRecord);

            expect(order).toEqual(['filter', 'map']);

            expect(filter.mock.calls.length).toBe(1);
            expect(map.mock.calls.length).toBe(1);
        });
        it('deny if return undefined', () => {
            const testRecord = Object.freeze({
                id: 1,
                name: 'test',
            });

            // act
            const filter = jest.fn(_ => false);
            const map = jest.fn(record => ({ ...record }));

            const pipe = makePipeByParts([
                {
                    type: 'filter',
                    value: filter,
                },
                {
                    type: 'map',
                    value: map,
                },
            ]);
            const result = pipe(testRecord, { id: 1 });

            // assert
            expect(result).toEqual(undefined);

            expect(filter.mock.calls.length).toBe(1);
            expect(map.mock.calls.length).toBe(0);
        });
        it('error if unknown part', () => {
            expect(() =>
                makePipeByParts([
                    {
                        type: 'unknown',
                    } as any,
                ])
            ).toThrow('Unknown part type "unknown"');
        });
    });
});
