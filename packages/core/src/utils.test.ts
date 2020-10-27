import { getFieldByPath } from './utils';

describe('utils', () => {
    describe('getFieldByPath', () => {
        const obj = {
            foo: 'bar',
            nested: {
                foo: 'bar2',
                sub: {
                    foo3: 'bar3',
                },
            },
        };

        test('direct', () => {
            const getter = getFieldByPath(['foo']);
            expect(getter(obj)).toEqual('bar');
        });

        test('undefined field', () => {
            const getter = getFieldByPath(['bad']);
            expect(getter(obj)).toEqual(undefined);
        });

        test('nested (as array)', () => {
            const getter = getFieldByPath(['nested', 'sub', 'foo3']);
            expect(getter(obj)).toEqual('bar3');
        });

        test('nested (as string)', () => {
            const getter = getFieldByPath('nested.sub');
            expect(getter(obj)).toEqual({ foo3: 'bar3' });
        });

        test('undefined nested', () => {
            const getter = getFieldByPath(['foo', 'bad']);
            expect(getter(obj)).toEqual(undefined);
        });
    });
});
