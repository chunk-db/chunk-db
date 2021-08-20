import { find } from './find';

describe('Operators', () => {
    describe('find', () => {
        const obj = {
            _id: 'id',
            foo: 'bar',
            nested: {
                foo: 'bar2',
                five: 5,
                bool: true,
                negative: false,
            },
        };

        describe('primitives', () => {
            it('string, positive', () => {
                const op = find({
                    foo: 'bar',
                });
                expect(op(obj, {})).toBe(obj);
            });
            it('string, another string', () => {
                const op = find({
                    foo: 'nested',
                });
                expect(op(obj, {})).toBeUndefined();
            });
            it('boolean, but string', () => {
                const op = find({
                    'nested.foo': true,
                });
                expect(op(obj, {})).toBeUndefined();
            });
            it('number, but object', () => {
                const op = find({
                    nested: 1,
                });
                expect(op(obj, {})).toBeUndefined();
            });
            it('accept nested boolean true', () => {
                const op = find({
                    'nested.bool': true,
                });
                expect(op(obj, {})).toBe(obj);
            });
            it('accept nested boolean false', () => {
                const op = find({
                    'nested.negative': true,
                });
                expect(op(obj, {})).toBeUndefined();
            });
        });

        describe('$eq', () => {
            it('accept string', () => {
                const op = find({
                    foo: { $eq: 'bar' },
                });
                expect(op(obj, {})).toBe(obj);
            });
            it('string not found', () => {
                const op = find({
                    x: { $eq: 'bar' },
                });
                expect(op(obj, {})).toBeUndefined();
            });
            it('accept nested boolean true', () => {
                const op = find({
                    'nested.bool': { $eq: true },
                });
                expect(op(obj, {})).toBe(obj);
            });
            // TODO Implements it for params
            // it('accept boolean true from params', () => {
            //     const op = find({
            //         'nested.bool': param`bool`,
            //     });
            //     expect(op(obj, { bool: true })).toBe(obj);
            // });
            // it('accept boolean false from params', () => {
            //     const op = find({
            //         'nested.bool': param`bool`,
            //     });
            //     expect(op(obj, { bool: false })).toBeUndefined();
            // });
        });
    });
});
