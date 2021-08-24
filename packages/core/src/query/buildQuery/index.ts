import { ChunkID, makeSpaceID } from '../../common.types';
import { Query } from '../Query';
import { makePipeOperation } from '../partProcessing';

import { BuildQueryContext, BuiltQuery } from './buildQuery.types';
import { buildStaticQuery } from './buildStaticQuery';

/**
 * Build detailed query by API Query
 *
 * @param ctx context with functions and data required for building
 * @param query query for building
 */
export function buildQuery<T>(ctx: BuildQueryContext, query: Query<T>): BuiltQuery<T> {
    const queryModel = query.getModel();
    if (!ctx.collections[queryModel.name]) throw new Error(`Unregistered collection "${queryModel.name}"`);
    const model = ctx.collections[queryModel.name].model;

    const staticQuery = buildStaticQuery(query);

    const limit = Infinity;
    const offset = 0;

    const pipe = query.getParts().map(makePipeOperation);
    // make pipe by parts

    const refs: ChunkID[] = [];
    const queryRefs = Object.entries(query.getRefs());
    if (queryRefs.length) {
        queryRefs.forEach(([spaceID, ref]) => {
            if (!ref) {
                const space = ctx.refs.get(makeSpaceID(spaceID));
                if (space) ref = space.ref;
                else throw new Error(`Space "${spaceID}" not found`);
            }
            refs.push(ref);
        });
    } else {
        ctx.refs.forEach(space => refs.push(space.ref));
    }

    return {
        model,
        refs,
        staticQuery,
        params: query.getParams(),
        pipe,
        limit,
        offset,
    };
}
