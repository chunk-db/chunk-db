import { UUID } from './common.types';
import { UpdateEvent } from './events';

export class DBError extends Error {}

export class InnerDBError extends Error {}

export class SpaceNotFoundError extends DBError {
    constructor(spaceID: UUID) {
        super(`Space "${spaceID}" not found`);
    }
}

export class TransactionConflictError extends DBError {
    constructor(public readonly conflictedRecords: UpdateEvent) {
        super(`Conflict while upserting records ${conflictedRecords.upserted.join(', ')}`);
    }
}
