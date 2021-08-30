import { Query } from '@chunk-db/core';
import { useEffect, useState } from 'react';

import { useChunkDB, useCurrentHash } from './context';

export type QueryResult<T> = [T, boolean]; // FIXME: [result: T, loading: boolean];

export function useQueryAll<T>(
    queryBuilder: (...params: any[]) => Query<T>,
    params: any[],
    defaultValue: any = []
): QueryResult<T[]> {
    const db = useChunkDB();
    const hash = useCurrentHash();

    const [status, setStatus] = useState<'initiating' | 'pending' | 'complete' | 'error'>('initiating');
    const [result, setResult] = useState<T[]>([]);

    const keyParams = params.map(value => {
        if (Array.isArray(value)) return value.join(',');
        if (typeof value === 'object') throw new Error(`Params must be an array or a primitive`);
        return value;
    });

    useEffect(() => {
        console.log('#### update');
        setStatus('pending');
        const query = queryBuilder(...params);
        db.find(query)
            .all()
            .then(
                (data: T[]) => {
                    console.log('#### complete');
                    setStatus('complete');
                    setResult(data);
                },
                (error: any) => {
                    setStatus('error');
                    console.error(error);
                }
            );
    }, [hash, ...keyParams]);

    if (status === 'pending') return [defaultValue, true];

    if (status === 'complete') return [result, false];

    if (status === 'error') return [defaultValue, false];

    return [defaultValue, true];
}
