import { filter } from './filter';

describe('Operators', () => {
    describe('filter', () => {
        const testRecord = Object.freeze({
            id: 1,
            name: 'test',
        });

        it('pass record', () => {
            // arrange
            const fn = jest.fn(_ => true);

            // act
            const op = filter<typeof testRecord>(fn);
            const result = op(testRecord, {});

            // assert
            expect(fn.mock.calls.length).toBe(1);
            expect(fn.mock.calls[0][0]).toBe(testRecord);
            expect(result).toBe(testRecord);
        });

        it('pass record (truthy result)', () => {
            // arrange
            const fn = jest.fn(record => record);

            // act
            const op = filter<typeof testRecord>(fn);
            const result = op(testRecord, {});

            // assert
            expect(fn.mock.calls.length).toBe(1);
            expect(fn.mock.calls[0][0]).toBe(testRecord);
            expect(result).toBe(testRecord);
        });

        it('deny record', () => {
            // arrange
            const fn = jest.fn(_ => false);

            // act
            const op = filter<typeof testRecord>(fn);
            const result = op(testRecord, {});

            // assert
            expect(fn.mock.calls.length).toBe(1);
            expect(fn.mock.calls[0][0]).toBe(testRecord);
            expect(result).toBe(void 0);
        });

        it('deny record (falsy result)', () => {
            // arrange
            const fn = jest.fn(_ => 0 as any);

            // act
            const op = filter<typeof testRecord>(fn);
            const result = op(testRecord, {});

            // assert
            expect(fn.mock.calls.length).toBe(1);
            expect(fn.mock.calls[0][0]).toBe(testRecord);
            expect(result).toBe(void 0);
        });

        it('pass record by params', () => {
            // arrange
            const fn = jest.fn((record, { id }) => record.id === id);

            // act
            const op = filter<typeof testRecord>(fn);
            const result = op(testRecord, { id: 1 });

            // assert
            expect(fn.mock.calls.length).toBe(1);
            expect(fn.mock.calls[0][0]).toBe(testRecord);
            expect(fn.mock.calls[0][1]).toEqual({ id: 1 });
            expect(result).toBe(testRecord);
        });

        it('deny record by params', () => {
            // arrange
            const fn = jest.fn((record, { id }) => record.id === id);

            // act
            const op = filter<typeof testRecord>(fn);
            const result = op(testRecord, { id: 2 });

            // assert
            expect(fn.mock.calls.length).toBe(1);
            expect(fn.mock.calls[0][0]).toBe(testRecord);
            expect(fn.mock.calls[0][1]).toEqual({ id: 2 });
            expect(result).toBe(void 0);
        });
    });
});
