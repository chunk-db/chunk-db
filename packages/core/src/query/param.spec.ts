import { applyParams, getParam, isParam, param } from './param';

describe(`param`, () => {
    describe('define param', () => {
        it('valid name', () => {
            expect(() => param`id6`).not.toThrow();
        });
        it('first number is error', () => {
            expect(() => param`6id`).toThrow();
        });
        it('empty name', () => {
            expect(() => param``).toThrow();
        });
        it('invalid symbols', () => {
            expect(() => param`$-==`).toThrow();
        });
    });
    describe('isParam, getParamName', () => {
        it('valid param', () => {
            const p = param`id`;

            expect(isParam(p)).toBeTruthy();
            expect(getParam(p)).toBe('id');
        });
        it('invalid param', () => {
            const p = '00';

            expect(isParam(p)).toBeFalsy();
            expect(() => getParam(p)).toThrow('Value "00" is not parameter');
        });
        it('valid param (as a function)', () => {
            const p = param('id');

            expect(isParam(p)).toBeTruthy();
            expect(getParam(p)).toBe('id');
        });
        it('invalid param (as a function)', () => {
            const p = '00';

            expect(isParam(p)).toBeFalsy();
            expect(() => getParam(p)).toThrow('Value "00" is not parameter');
        });
    });
    describe('applyParams', () => {
        it('valid', () => {
            const obj = {
                id: param`id`,
                name: 'name',
                value: param`str`,
                valid: param`b`,
            };
            expect(
                applyParams(obj, {
                    id: 5,
                    str: 'some string',
                    b: true,
                })
            ).toEqual({
                id: 5,
                name: 'name',
                value: 'some string',
                valid: true,
            });
        });
    });
});
