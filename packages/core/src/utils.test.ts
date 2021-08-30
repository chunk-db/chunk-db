import { getFieldByPath, isSerializable } from './utils';

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

        it('direct', () => {
            const getter = getFieldByPath(['foo']);
            expect(getter(obj)).toEqual('bar');
        });

        it('undefined field', () => {
            const getter = getFieldByPath(['bad']);
            expect(getter(obj)).toEqual(undefined);
        });

        it('nested (as array)', () => {
            const getter = getFieldByPath(['nested', 'sub', 'foo3']);
            expect(getter(obj)).toEqual('bar3');
        });

        it('nested (as string)', () => {
            const getter = getFieldByPath('nested.sub');
            expect(getter(obj)).toEqual({ foo3: 'bar3' });
        });

        it('undefined nested', () => {
            const getter = getFieldByPath(['foo', 'bad']);
            expect(getter(obj)).toEqual(undefined);
        });
    });
    describe('isSerializable', () => {
        it('empty object', () => {
            expect(isSerializable({})).toBeTruthy();
        });
        it('sub object', () => {
            expect(isSerializable({ x: { y: 1 } })).toBeTruthy();
        });
        it('sub object with function', () => {
            expect(isSerializable({ x: { y: () => null } })).toBeFalsy();
        });
        it('boolean', () => {
            expect(isSerializable(true)).toBeTruthy();
        });
        it('number', () => {
            expect(isSerializable(5)).toBeTruthy();
        });
        it('NaN', () => {
            expect(isSerializable(NaN)).toBeFalsy();
        });
        it('Infinity', () => {
            expect(isSerializable(Infinity)).toBeFalsy();
        });
        it('string', () => {
            expect(isSerializable('123')).toBeTruthy();
        });
        it('boolean topMustBeObject=true', () => {
            expect(isSerializable(false, true)).toBeFalsy();
        });
        it('number topMustBeObject=true', () => {
            expect(isSerializable(5, true)).toBeFalsy();
        });
        it('string topMustBeObject=true', () => {
            expect(isSerializable('123', true)).toBeFalsy();
        });
        it('null', () => {
            expect(isSerializable(null)).toBeFalsy();
        });
        it('undefined', () => {
            expect(isSerializable(undefined)).toBeFalsy();
        });
        it('function', () => {
            expect(isSerializable(() => null)).toBeFalsy();
        });
        it('symbol', () => {
            expect(isSerializable(Symbol())).toBeFalsy();
        });
    });
});
