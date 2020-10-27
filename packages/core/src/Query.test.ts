import { buildQuery } from './Query';

describe('Query', () => {
    const obj = {
        _id: 'id',
        foo: 'bar',
        nested: {
            foo: 'bar2',
            five: 5,
            bool: true,
        },
    };

    describe('primitives', () => {
        test('string, positive', () => {
            const query = buildQuery({
                foo: 'bar',
            });
            expect(query(obj)).toBeTruthy();
        });
        test('string, another string', () => {
            const query = buildQuery({
                foo: 'nested',
            });
            expect(query(obj)).toBeFalsy();
        });
        test('boolean, but string', () => {
            const query = buildQuery({
                'nested.foo': true,
            });
            expect(query(obj)).toBeFalsy();
        });
        test('number, but object', () => {
            const query = buildQuery({
                nested: 1,
            });
            expect(query(obj)).toBeFalsy();
        });
    });
});
