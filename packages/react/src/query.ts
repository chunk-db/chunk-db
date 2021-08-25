import { Cursor, IRecord, Query } from '@chunk-db/core';
import { QueryParams } from '@chunk-db/core/query/operators/operators.types';
import { useState } from 'react';

import { useChunkDB } from './index';

export type QueryResult<T> = [T, boolean]; // FIXME: [result: T, loading: boolean];

export function useQueryAll<T>(query: Query<T>, defaultValue: any = null): QueryResult<T[]> {
    const db = useChunkDB();

    const [status, setStatus] = useState<'initiating' | 'pending' | 'complete' | 'error'>('initiating');
    const [result, setResult] = useState<T[]>([]);

    if (status === 'pending') return [[], true];

    if (status === 'complete') return [result, false];

    if (status === 'error') return [[], false];

    setStatus('pending');
    db.find(query)
        .all()
        .then(
            (data: T[]) => {
                setStatus('complete');
                setResult(data);
            },
            (error: any) => {
                setStatus('error');
                setResult([]);
            }
        );
}
