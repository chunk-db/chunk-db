import { ChunkDB } from './ChunkDB';
import { IQuery } from './ConditionValidator';
import { Model } from './Model';
import { ChunkID } from './common.types';
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

    constructor(
        private readonly db: ChunkDB,
        private readonly model: Model<T>,
        private readonly query: IQuery,
        private readonly refs: ChunkID[]
    ) {
        this.scenario = this.db.run(findBruteForce(this.refs, this.model, this.query));
    }

    async next(): Promise<IFindResult<T>> {
        const { done, value } = await this.scenario.next();
        this._done = !!done;
        return value;
    }
}
