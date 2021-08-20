import { Model } from '../Model';

import { Query } from './Query';
import { param } from './param';

const model = new Model('test', {
    uuid: 'id',
    indexes: {},
});

describe('Query', () => {
    describe('find', () => {
        it('empty query', () => {
            const query = new Query(model).find({});

            expect(query.parts[0]).toEqual({
                type: 'find',
                value: {},
            });
            expect(query.parts.length).toBe(1);
        });
        it('serializable query', () => {
            const query = new Query(model).find({ x: { $gt: 5 } });

            expect(query.parts[0]).toEqual({
                type: 'find',
                value: { x: { $gt: 5 } },
            });
            expect(query.parts.length).toBe(1);
        });
        it('serializable query with params', () => {
            const query = new Query(model).find({ x: { $gt: param`name` } });

            expect(query.parts[0]).toEqual({
                type: 'find',
                value: { x: { $gt: param`name` } },
            });
            expect(query.parts.length).toBe(1);
        });
        it('no serializable query', () => {
            expect(() => new Query(model).find({ x: () => null } as any)).toThrow(
                'Query.find allow only serializable argument'
            );
        });
    });
    describe('filter', () => {
        it('filter', () => {
            const filter = () => false;
            const query = new Query(model).find({}).filter(filter);

            expect(query.parts[1]).toEqual({
                type: 'filter',
                value: filter,
            });
            expect(query.parts.length).toBe(2);
        });
    });
    describe('sort', () => {
        it('staticSort', () => {
            const query = new Query(model).find({}).sort({ x: -1 });

            expect(query.parts[1]).toEqual({
                type: 'staticSort',
                value: { x: -1 },
            });
            expect(query.parts.length).toBe(2);
        });
        it('dynamicSort', () => {
            const sort = () => false;
            const query = new Query(model).find({}).sort(sort);

            expect(query.parts[1]).toEqual({
                type: 'dynamicSort',
                value: sort,
            });
            expect(query.parts.length).toBe(2);
        });
    });
});
