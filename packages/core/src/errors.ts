import { UpdateEvent } from './events';
import { UUID } from './common.types';

export class DBError extends Error {}

export class InnerDBError extends Error {}

export class SpaceNotFoundError extends DBError {
    constructor(spaceID: UUID) {
        super(`Space not found "${spaceID}"`);
    }
}

export class TransactionConflictError extends DBError {
    constructor(public readonly conflictedRecords: UpdateEvent) {
        super(`Conflict while upserting records ${conflictedRecords.upserted.join(', ')}`);
    }
}
