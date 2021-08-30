import { buildConditionQuery } from './ConditionValidator';

describe('ConditionValidator', () => {
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
            const query = buildConditionQuery({
                foo: 'bar',
            });
            expect(query(obj)).toBeTruthy();
        });
        test('string, another string', () => {
            const query = buildConditionQuery({
                foo: 'nested',
            });
            expect(query(obj)).toBeFalsy();
        });
        test('boolean, but string', () => {
            const query = buildConditionQuery({
                'nested.foo': true,
            });
            expect(query(obj)).toBeFalsy();
        });
        test('number, but object', () => {
            const query = buildConditionQuery({
                nested: 1,
            });
            expect(query(obj)).toBeFalsy();
        });
    });
});
