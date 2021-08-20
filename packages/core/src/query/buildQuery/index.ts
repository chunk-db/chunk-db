import { Query } from '../Query';
import { makePipeByParts } from '../partProcessing';

import { BuildQueryContext, BuildQueryOptions, BuiltQuery, Optimization } from './buildQuery.types';
import { buildStaticQuery } from './buildStaticQuery';
import { optimizeQuery } from './optimizeQuery';

export function buildQuery<T>(ctx: BuildQueryContext, query: Query<T>, options: BuildQueryOptions = {}): BuiltQuery<T> {
    const staticQuery = buildStaticQuery(query);

    options = Object.assign(
        {
            optimization: 'auto',
        },
        options
    );
    if (options.optimization === false) options.optimization = Optimization.None;

    const optimizedQuery = optimizeQuery(ctx, query, options.optimization as Optimization);

    const limit = Infinity;
    const offset = 0;

    const pipe = makePipeByParts(optimizedQuery.parts);
    // make pipe by parts

    return {
        staticQuery,
        params: {},
        pipe,
        postProcessing: undefined,
        limit,
        offset,
    };
}
