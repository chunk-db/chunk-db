import { Model } from '../../Model';
import { Query } from '../Query';

import { buildStaticQuery } from './buildStaticQuery';

const model = new Model('test', {
    uuid: 'id',
    indexes: {},
});

describe('buildStaticQuery', () => {
    describe('query without params', () => {
        it('empty query', () => {
            const query = new Query(model);
            const staticQuery = buildStaticQuery(query);

            expect(staticQuery).toEqual({});
        });
        describe('find', () => {
            it('empty find', () => {
                const query = new Query(model).find({});
                const staticQuery = buildStaticQuery(query);

                expect(staticQuery).toEqual({});
            });
            it('one string field', () => {
                const query = new Query(model).find({ str: 'some string' });
                const staticQuery = buildStaticQuery(query);

                expect(staticQuery).toEqual({
                    str: { $eq: 'some string' },
                });
            });
            it('boolean and number fields', () => {
                const query = new Query(model).find({
                    num: 5,
                    bool: false,
                });
                const staticQuery = buildStaticQuery(query);

                expect(staticQuery).toEqual({
                    num: { $eq: 5 },
                    bool: { $eq: false },
                });
            });
            it('throw error then undefined', () => {
                expect(() =>
                    new Query(model).find({
                        num: undefined,
                    } as any)
                ).toThrow();
            });
            it('throw error then null', () => {
                expect(() =>
                    new Query(model).find({
                        num: null,
                    } as any)
                ).toThrow();
            });
            it('boolean and number fields', () => {
                const query = new Query(model).find({
                    num: 5,
                    bool: false,
                });
                const staticQuery = buildStaticQuery(query);

                expect(staticQuery).toEqual({
                    num: { $eq: 5 },
                    bool: { $eq: false },
                });
            });
            it('chaining find', () => {
                const query = new Query(model)
                    .find({
                        num: 5,
                    })
                    .find({
                        str: 'false',
                    });
                const staticQuery = buildStaticQuery(query);

                expect(staticQuery).toEqual({
                    num: { $eq: 5 },
                    str: { $eq: 'false' },
                });
            });
            it('chaining find with $in condition', () => {
                const query = new Query(model)
                    .find({
                        num: { $in: [4, 5] },
                    })
                    .find({
                        num: { $in: [4, 5, 6, 5] },
                    });
                const staticQuery = buildStaticQuery(query);

                expect(staticQuery).toEqual({
                    num: { $in: [4, 5] },
                });
            });
        });
        describe('findByPk', () => {
            it('empty id', () => {
                expect(() => new Query(model).findByPk('')).toThrow();
            });
            it('non-empty id', () => {
                const query = new Query(model).findByPk('some-id');
                const staticQuery = buildStaticQuery(query);

                expect(staticQuery).toEqual({
                    id: { $eq: 'some-id' },
                });
            });
            it('another uuid key', () => {
                const model2 = new Model('test', {
                    uuid: 'another_id',
                    indexes: {},
                });
                const query = new Query(model2).findByPk('id-x');
                const staticQuery = buildStaticQuery(query);

                expect(staticQuery).toEqual({
                    another_id: { $eq: 'id-x' },
                });
            });
            it('array of id (with duplicates)', () => {
                const query = new Query(model).findByPk(['id1', 'id2', 'id1']);
                const staticQuery = buildStaticQuery(query);

                expect(staticQuery).toEqual({
                    id: { $in: ['id1', 'id2'] },
                });
            });
            it('findById and another', () => {
                const query = new Query(model)
                    .find({
                        num: 5,
                    })
                    .findByPk(['id1', 'id2', 'id1']);
                const staticQuery = buildStaticQuery(query);

                expect(staticQuery).toEqual({
                    id: { $in: ['id1', 'id2'] },
                    num: { $eq: 5 },
                });
            });
            it('findById and find on one field', () => {
                // todo
                const query = new Query(model)
                    .find({
                        id: 'id2',
                    })
                    .findByPk(['id1', 'id2', 'id1']);
                const staticQuery = buildStaticQuery(query);

                expect(staticQuery).toEqual({
                    id: {
                        $eq: 'id2',
                        $in: ['id1', 'id2'],
                    },
                });
            });
        });
    });
});
