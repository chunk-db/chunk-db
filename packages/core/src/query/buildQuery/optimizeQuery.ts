import { Query } from '../Query';

import { BuildQueryContext, Optimization } from './buildQuery.types';

export function optimizeQuery<T>(ctx: BuildQueryContext, query: Query<T>, optimization: Optimization): Query<T> {
    switch (optimization) {
        case Optimization.None:
            return query;
    }
}
