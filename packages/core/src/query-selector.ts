import { ChunkDB } from './ChunkDB';
import { IQuery } from './ConditionValidator';
import { DelayedRef } from './delayed-ref';
import { IRecord } from './record.types';
import { FindScenario, IFindResult } from './scenarios/find.types';
import { findBruteForce } from './scenarios/findBruteForce';

/**
 * Отвечает за создание выборки для конкретного пространства данных по конкретному запросу
 */
export class QuerySelector<T extends IRecord = IRecord> {
    private scenario: FindScenario<T>;
    private _done = false;
    public get done() {
        return this._done;
    }

    constructor(private readonly db: ChunkDB,
                private readonly delayedRef: DelayedRef<T>,
                private readonly query: IQuery) {
        this.scenario = this.db.run(findBruteForce(this.delayedRef, this.query));
    }

    async next(): Promise<IFindResult<T>> {
        const { done, value } = await this.scenario.next();
        this._done = !!done;
        return value;
    }
}
