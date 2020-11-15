import { Accessor } from '../accessor';

import { call } from './scenario.types';
import { getSpace, updateSpaceRefs } from './utils';

export function* applyTransaction(accessor: Accessor<any>) {
    // console.log(accessor);
    // const refs = accessor.updatedRefs;
    // console.log(refs);
    // const changedCollections = Object.keys(refs);
    // for (const name of changedCollections) {
    //     const chunkID = accessor.updatedRefs[name]!;
    //     const chunk = yield call(getChunk, chunkID);
    //     console.log(chunk);
    // }

    console.log(yield call(getSpace, accessor.getSpace().id));
    yield call(updateSpaceRefs, accessor.getSpace().id, accessor.refs);
    console.log(yield call(getSpace, accessor.getSpace().id));

    return accessor.getStats();
}
