import { Query } from './Query';
import { BuildQueryContext, BuildQueryOptions, BuiltQuery, Optimization } from './buildQuery.types';
import { optimizeQuery } from './optimizeQuery';

export function buildQuery<T>(ctx: BuildQueryContext, query: Query<T>, options: BuildQueryOptions = {}): BuiltQuery<T> {
    options = Object.assign(
        {
            optimization: 'auto',
        },
        options
    );
    if (options.optimization === false) options.optimization = Optimization.None;

    const optimizedQuery = optimizeQuery(ctx, query, options.optimization as Optimization);

    let limit = Infinity
    let offset = 0;

const postProcessing = makePipeByParts()
    // make pipe by parts

    return {
        staticQuery: {},
        params: {},
        postProcessing: undefined,
        limit,
        offset,
    };
}
