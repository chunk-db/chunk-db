import { UUID } from '@chunk-db/core';

export function shortId(id: UUID): string {
    if (!id) return id;

    return id.substr(0, 13) + '...' + id.substr(28);
}
