import { UUID } from './common.types';

export interface UpdateEvent {
    updated: UUID[];
    inserted: UUID[];
    upserted: UUID[];
    deleted: UUID[];
}
